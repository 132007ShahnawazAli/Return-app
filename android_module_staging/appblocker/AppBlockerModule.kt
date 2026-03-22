package com.anonymous.returnapp.appblocker

import android.content.Intent
import android.provider.Settings
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

/**
 * AppBlockerModule
 *
 * React Native native module bridge for the app blocking system.
 *
 * Exposes:
 *  - setBlockedApps(packageNames[])  → update the blocked apps list
 *  - getBlockedApps()                → read the current blocked apps
 *  - isAccessibilityServiceEnabled() → check if user has enabled the service
 *  - openAccessibilitySettings()     → deep-link to system accessibility settings
 *
 * Accessed from JS as: NativeModules.AppBlocker
 */
class AppBlockerModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AppBlocker"

    // ─── Blocked Apps Management ────────────────────────────────────────────

    /**
     * Set the list of package names that should be blocked.
     * This persists to SharedPreferences and immediately updates the running
     * accessibility service (if active).
     *
     * @param packageNames ReadableArray of package name strings
     */
    @ReactMethod
    fun setBlockedApps(packageNames: ReadableArray, promise: Promise) {
        try {
            val packages = mutableListOf<String>()
            for (i in 0 until packageNames.size()) {
                val pkg = packageNames.getString(i)
                if (!pkg.isNullOrBlank()) {
                    packages.add(pkg)
                }
            }

            AppBlockAccessibilityService.BlockedAppsStorage.setBlockedApps(
                reactContext.applicationContext,
                packages
            )

            promise.resolve(packages.size)
        } catch (e: Exception) {
            promise.reject("ERR_SET_BLOCKED", "Failed to set blocked apps: ${e.message}", e)
        }
    }

    /**
     * Get the current list of blocked package names.
     */
    @ReactMethod
    fun getBlockedApps(promise: Promise) {
        try {
            val apps = AppBlockAccessibilityService.BlockedAppsStorage.getBlockedApps(
                reactContext.applicationContext
            )

            val array = com.facebook.react.bridge.Arguments.createArray()
            for (pkg in apps) {
                array.pushString(pkg)
            }

            promise.resolve(array)
        } catch (e: Exception) {
            promise.reject("ERR_GET_BLOCKED", "Failed to get blocked apps: ${e.message}", e)
        }
    }

    // ─── Accessibility Service Status ───────────────────────────────────────

    /**
     * Check if the accessibility service is currently enabled by the user.
     * Returns true/false.
     */
    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        try {
            val enabled = AppBlockAccessibilityService.BlockedAppsStorage.isServiceEnabled(
                reactContext.applicationContext
            )
            promise.resolve(enabled)
        } catch (e: Exception) {
            promise.reject("ERR_CHECK_SERVICE", "Failed to check service status: ${e.message}", e)
        }
    }

    /**
     * Opens the system Accessibility Settings screen so the user can enable
     * our accessibility service. Used during onboarding.
     */
    @ReactMethod
    fun openAccessibilitySettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("ERR_OPEN_SETTINGS", "Failed to open accessibility settings: ${e.message}", e)
        }
    }
}
