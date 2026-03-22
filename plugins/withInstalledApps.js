/**
 * withInstalledApps.js — Expo Config Plugin
 *
 * Responsibilities:
 *  1. Add the MAIN/LAUNCHER <intent> into the AndroidManifest.xml <queries>
 *     block so the app can enumerate launchable packages on Android 11+.
 *  2. Register InstalledAppsPackage and AppBlockerPackage in MainApplication.kt.
 *  3. Copy Kotlin source files from android_module_staging/ into the generated
 *     android/ project tree (both installedapps/ and appblocker/ modules).
 *  4. Add accessibility service + BlockingActivity to AndroidManifest.xml.
 *  5. Copy accessibility_service_config.xml into res/xml/.
 *  6. Add required string resources.
 *
 * All steps are idempotent — safe to run `expo prebuild` repeatedly.
 */

const {
    withAndroidManifest,
    withMainApplication,
    withDangerousMod,
} = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

// ─── Step 1: Patch AndroidManifest.xml (queries + service + activity) ───────

function addLauncherQueryIntent(androidManifest) {
    const manifest = androidManifest.manifest;

    const launcherIntent = {
        action: [{ $: { 'android:name': 'android.intent.action.MAIN' } }],
        category: [{ $: { 'android:name': 'android.intent.category.LAUNCHER' } }],
    };

    if (!manifest.queries) {
        manifest.queries = [{ intent: [launcherIntent] }];
    } else {
        const queries = manifest.queries[0];
        if (!queries.intent) {
            queries.intent = [];
        }

        const alreadyPresent = queries.intent.some(
            (i) =>
                i.action &&
                i.action.some((a) => a.$?.['android:name'] === 'android.intent.action.MAIN')
        );

        if (!alreadyPresent) {
            queries.intent.push(launcherIntent);
        }
    }

    return androidManifest;
}

function addAccessibilityServiceAndBlockingActivity(androidManifest) {
    const app = androidManifest.manifest.application[0];

    // ── Accessibility Service ──
    if (!app.service) app.service = [];
    const serviceAlready = app.service.some(
        (s) => s.$?.['android:name'] === '.appblocker.AppBlockAccessibilityService'
    );
    if (!serviceAlready) {
        app.service.push({
            $: {
                'android:name': '.appblocker.AppBlockAccessibilityService',
                'android:permission': 'android.permission.BIND_ACCESSIBILITY_SERVICE',
                'android:exported': 'false',
            },
            'intent-filter': [{
                action: [{
                    $: { 'android:name': 'android.accessibilityservice.AccessibilityService' },
                }],
            }],
            'meta-data': [{
                $: {
                    'android:name': 'android.accessibilityservice',
                    'android:resource': '@xml/accessibility_service_config',
                },
            }],
        });
    }

    // ── BlockingActivity ──
    if (!app.activity) app.activity = [];
    const activityAlready = app.activity.some(
        (a) => a.$?.['android:name'] === '.appblocker.BlockingActivity'
    );
    if (!activityAlready) {
        app.activity.push({
            $: {
                'android:name': '.appblocker.BlockingActivity',
                'android:label': '@string/blocking_activity_label',
                'android:theme': '@style/Theme.AppCompat.NoActionBar',
                'android:exported': 'false',
                'android:excludeFromRecents': 'true',
                'android:noHistory': 'true',
                'android:screenOrientation': 'portrait',
            },
        });
    }

    return androidManifest;
}

const withManifestPatches = (config) =>
    withAndroidManifest(config, (cfg) => {
        cfg.modResults = addLauncherQueryIntent(cfg.modResults);
        cfg.modResults = addAccessibilityServiceAndBlockingActivity(cfg.modResults);
        return cfg;
    });

// ─── Step 2: Register packages in MainApplication.kt ───────────────────────

const withPackageRegistration = (config) =>
    withMainApplication(config, (cfg) => {
        let contents = cfg.modResults.contents;
        const appPackage = cfg.android?.package ?? 'com.anonymous.returnapp';

        // ── InstalledAppsPackage ──
        if (!contents.includes('InstalledAppsPackage')) {
            const importLine = `import ${appPackage}.installedapps.InstalledAppsPackage`;
            const packageDeclMatch = contents.match(/^package\s+[\w.]+/m);
            if (packageDeclMatch && !contents.includes(importLine)) {
                contents = contents.replace(
                    packageDeclMatch[0],
                    `${packageDeclMatch[0]}\n${importLine}`
                );
            }
            const anchor = 'PackageList(this).packages';
            if (contents.includes(anchor)) {
                contents = contents.replace(
                    anchor,
                    `${anchor}.also { pkgs -> pkgs.add(InstalledAppsPackage()) }`
                );
            }
        }

        // ── AppBlockerPackage ──
        if (!contents.includes('AppBlockerPackage')) {
            const importLine = `import ${appPackage}.appblocker.AppBlockerPackage`;
            const packageDeclMatch = contents.match(/^package\s+[\w.]+/m);
            if (packageDeclMatch && !contents.includes(importLine)) {
                contents = contents.replace(
                    packageDeclMatch[0],
                    `${packageDeclMatch[0]}\n${importLine}`
                );
            }
            // Add after InstalledAppsPackage registration
            if (contents.includes('InstalledAppsPackage()') && !contents.includes('AppBlockerPackage()')) {
                contents = contents.replace(
                    'pkgs.add(InstalledAppsPackage())',
                    'pkgs.add(InstalledAppsPackage()); pkgs.add(AppBlockerPackage())'
                );
            }
        }

        cfg.modResults.contents = contents;
        return cfg;
    });

// ─── Step 3: Copy source files + resources into android/ ────────────────────

const withSourceFiles = (config) =>
    withDangerousMod(config, [
        'android',
        async (cfg) => {
            const appPackage = cfg.android?.package ?? 'com.anonymous.returnapp';
            const pkgPath = appPackage.split('.').join('/');
            const projectRoot = cfg.modRequest.projectRoot;
            const stagingDir = path.join(projectRoot, 'android_module_staging');

            // ── Copy installedapps module ──
            const installedAppsDestDir = path.join(
                projectRoot, 'android', 'app', 'src', 'main', 'java', pkgPath, 'installedapps'
            );
            fs.mkdirSync(installedAppsDestDir, { recursive: true });

            for (const fileName of ['InstalledAppsModule.kt', 'InstalledAppsPackage.kt']) {
                copyAndPatchPackage(stagingDir, installedAppsDestDir, fileName, appPackage, 'installedapps');
            }

            // ── Copy appblocker module ──
            const appBlockerStagingDir = path.join(stagingDir, 'appblocker');
            const appBlockerDestDir = path.join(
                projectRoot, 'android', 'app', 'src', 'main', 'java', pkgPath, 'appblocker'
            );
            fs.mkdirSync(appBlockerDestDir, { recursive: true });

            for (const fileName of [
                'AppBlockAccessibilityService.kt',
                'BlockingActivity.kt',
                'AppBlockerModule.kt',
                'AppBlockerPackage.kt',
            ]) {
                copyAndPatchPackage(appBlockerStagingDir, appBlockerDestDir, fileName, appPackage, 'appblocker');
            }

            // ── Copy accessibility_service_config.xml ──
            const xmlDestDir = path.join(
                projectRoot, 'android', 'app', 'src', 'main', 'res', 'xml'
            );
            fs.mkdirSync(xmlDestDir, { recursive: true });

            const xmlSrc = path.join(appBlockerStagingDir, 'accessibility_service_config.xml');
            const xmlDest = path.join(xmlDestDir, 'accessibility_service_config.xml');
            if (fs.existsSync(xmlSrc)) {
                fs.copyFileSync(xmlSrc, xmlDest);
                console.log(`[withInstalledApps] Copied accessibility_service_config.xml`);
            }

            // ── Add string resources ──
            const stringsPath = path.join(
                projectRoot, 'android', 'app', 'src', 'main', 'res', 'values', 'strings.xml'
            );
            if (fs.existsSync(stringsPath)) {
                let stringsContent = fs.readFileSync(stringsPath, 'utf8');
                if (!stringsContent.includes('accessibility_service_description')) {
                    stringsContent = stringsContent.replace(
                        '</resources>',
                        '  <string name="accessibility_service_description">Monitors which app is in the foreground to block distracting apps during focus sessions. No personal data is collected.</string>\n' +
                        '  <string name="blocking_activity_label">Focus Mode</string>\n' +
                        '</resources>'
                    );
                    fs.writeFileSync(stringsPath, stringsContent, 'utf8');
                    console.log(`[withInstalledApps] Added string resources`);
                }
            }

            return cfg;
        },
    ]);

/**
 * Helper: copy a Kotlin file from staging to dest, patching the package declaration.
 */
function copyAndPatchPackage(stagingDir, destDir, fileName, appPackage, subPackage) {
    const srcFile = path.join(stagingDir, fileName);
    const destFile = path.join(destDir, fileName);

    if (!fs.existsSync(srcFile)) {
        console.warn(`[withInstalledApps] Staging file not found: ${srcFile}`);
        return;
    }

    let content = fs.readFileSync(srcFile, 'utf8');
    // Patch package declaration to match actual app package
    const regex = new RegExp(`^package\\s+[\\w.]+\\.${subPackage}`, 'm');
    content = content.replace(regex, `package ${appPackage}.${subPackage}`);

    fs.writeFileSync(destFile, content, 'utf8');
    console.log(`[withInstalledApps] Copied ${fileName} → ${destDir}`);
}

// ─── Compose & Export ───────────────────────────────────────────────────────

const withInstalledApps = (config) => {
    config = withManifestPatches(config);
    config = withPackageRegistration(config);
    config = withSourceFiles(config);
    return config;
};

module.exports = withInstalledApps;
