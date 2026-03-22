package com.anonymous.returnapp.appblocker

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.content.SharedPreferences
import android.view.accessibility.AccessibilityEvent

/**
 * AppBlockAccessibilityService
 *
 * Monitors foreground app transitions via AccessibilityService.
 * When the user opens a blocked app, it immediately launches BlockingActivity.
 *
 * Architecture:
 *  - Listens ONLY for TYPE_WINDOW_STATE_CHANGED events (minimal footprint)
 *  - Blocked package list stored in SharedPreferences for persistence
 *  - Uses a HashSet for O(1) package-name lookups
 *  - Debounces via lastBlockedTimestamp to prevent launch loops
 *  - Excludes system-critical packages and our own package
 *
 * Play Store compliance:
 *  - canRetrieveWindowContent = false (declared in XML config)
 *  - No logging of accessibility events beyond package name checks
 *  - Purpose: digital wellbeing / productivity only
 */
class AppBlockAccessibilityService : AccessibilityService() {

    companion object {
        private const val PREFS_NAME = "app_blocker_prefs"
        private const val KEY_BLOCKED_APPS = "blocked_apps"
        private const val DEBOUNCE_MS = 1500L

        /**
         * System packages that must NEVER be blocked.
         * Blocking these would break essential device functionality.
         */
        private val SYSTEM_EXEMPT = setOf(
            "com.android.systemui",
            "com.android.settings",
            "com.android.launcher",
            "com.android.launcher3",
            "com.google.android.apps.nexuslauncher",
            "com.sec.android.app.launcher",     // Samsung
            "com.miui.home",                    // Xiaomi
            "com.android.packageinstaller",
            "com.android.permissioncontroller",
        )
    }

    private var blockedPackages = HashSet<String>()
    private var lastBlockedPackage: String? = null
    private var lastBlockedTimestamp: Long = 0L

    // ─── Lifecycle ──────────────────────────────────────────────────────────

    override fun onServiceConnected() {
        super.onServiceConnected()
        loadBlockedApps()
    }

    // ─── Core Event Handler ─────────────────────────────────────────────────

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) return
        if (event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return

        val packageName = event.packageName?.toString() ?: return

        // Don't block ourselves
        if (packageName == applicationContext.packageName) return

        // Don't block system-critical apps
        if (SYSTEM_EXEMPT.contains(packageName)) return

        // Don't block the blocking activity itself
        if (packageName == applicationContext.packageName) return

        // Check if this package is blocked
        if (!blockedPackages.contains(packageName)) return

        // Debounce: prevent rapid re-launch loops
        val now = System.currentTimeMillis()
        if (packageName == lastBlockedPackage && (now - lastBlockedTimestamp) < DEBOUNCE_MS) {
            return
        }

        lastBlockedPackage = packageName
        lastBlockedTimestamp = now

        // Launch blocking screen
        launchBlockingActivity(packageName)
    }

    override fun onInterrupt() {
        // Required override — nothing to clean up
    }

    // ─── Blocking Activity Launch ───────────────────────────────────────────

    private fun launchBlockingActivity(blockedPackageName: String) {
        val intent = Intent(applicationContext, BlockingActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP)
            putExtra(BlockingActivity.EXTRA_BLOCKED_PACKAGE, blockedPackageName)
        }
        applicationContext.startActivity(intent)
    }

    // ─── SharedPreferences Persistence ──────────────────────────────────────

    /**
     * Loads blocked apps from SharedPreferences.
     * Called on service connect and whenever React Native updates the list.
     */
    fun loadBlockedApps() {
        val prefs = getSharedPreferences()
        val csv = prefs.getString(KEY_BLOCKED_APPS, "") ?: ""
        blockedPackages = if (csv.isBlank()) {
            HashSet()
        } else {
            HashSet(csv.split(",").map { it.trim() }.filter { it.isNotEmpty() })
        }
    }

    private fun getSharedPreferences(): SharedPreferences {
        return applicationContext.getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
    }

    /**
     * Static utility for writing blocked apps from the React Native bridge.
     * The service instance reads from the same SharedPreferences on next event.
     */
    object BlockedAppsStorage {
        fun setBlockedApps(context: android.content.Context, packages: List<String>) {
            val prefs = context.getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            prefs.edit()
                .putString(KEY_BLOCKED_APPS, packages.joinToString(","))
                .apply()

            // If the service is already running, reload immediately
            instance?.loadBlockedApps()
        }

        fun getBlockedApps(context: android.content.Context): Set<String> {
            val prefs = context.getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            val csv = prefs.getString(KEY_BLOCKED_APPS, "") ?: ""
            return if (csv.isBlank()) emptySet()
            else csv.split(",").map { it.trim() }.filter { it.isNotEmpty() }.toSet()
        }

        fun isServiceEnabled(context: android.content.Context): Boolean {
            val enabledServices = android.provider.Settings.Secure.getString(
                context.contentResolver,
                android.provider.Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            ) ?: return false

            val serviceName = "${context.packageName}/${AppBlockAccessibilityService::class.java.canonicalName}"
            return enabledServices.contains(serviceName)
        }

        var instance: AppBlockAccessibilityService? = null
    }

    override fun onCreate() {
        super.onCreate()
        BlockedAppsStorage.instance = this
    }

    override fun onDestroy() {
        BlockedAppsStorage.instance = null
        super.onDestroy()
    }
}
