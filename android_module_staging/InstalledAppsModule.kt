package com.anonymous.returnapp.installedapps

import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.util.Base64
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import java.io.ByteArrayOutputStream

/**
 * InstalledAppsModule
 *
 * A React Native native module that retrieves launchable installed applications
 * from the Android device, including their icons as base64 PNG strings.
 *
 * Architecture notes:
 *  - Extends ReactContextBaseJavaModule for old-arch & new-arch TurboModule compat
 *  - All heavy PackageManager work runs on the JS thread pool via Promise
 *  - Filters strictly to apps with a MAIN/LAUNCHER intent (no service-only apps)
 *  - Does NOT request QUERY_ALL_PACKAGES; relies on <queries> in AndroidManifest.xml
 *  - Icons are rendered at 48dp (scaled to device density) and compressed as PNG
 */
class InstalledAppsModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    /** Name exposed to JS — accessed as NativeModules.InstalledApps */
    override fun getName(): String = MODULE_NAME

    // ─── Public API ─────────────────────────────────────────────────────────

    /**
     * getInstalledApps()
     *
     * Returns a Promise that resolves with a WritableArray of WritableMap objects.
     * Each map has the shape:
     *   { appName: string, packageName: string, isSystemApp: boolean, icon: string }
     *
     * The list is:
     *   1. Filtered to apps that have a MAIN/LAUNCHER intent (launchable only)
     *   2. De-duplicated by packageName
     *   3. Sorted alphabetically by appName (case-insensitive)
     */
    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val pm = reactContext.packageManager
                ?: return promise.reject(ERR_PM_UNAVAILABLE, "PackageManager is not available.")

            val launchableApps = buildLaunchableAppList(pm)
            promise.resolve(launchableApps)
        } catch (e: Exception) {
            promise.reject(ERR_UNEXPECTED, "Failed to retrieve installed apps: ${e.message}", e)
        }
    }

    // ─── Private Helpers ────────────────────────────────────────────────────

    /**
     * Queries PackageManager for all installed applications, then filters
     * and maps them to the shape expected by the JS layer.
     */
    private fun buildLaunchableAppList(pm: PackageManager): WritableArray {
        val installedApps = pm.getInstalledApplications(PackageManager.GET_META_DATA)

        // Use a HashSet to avoid duplicate packageNames before we sort
        val seen = HashSet<String>()
        val result = mutableListOf<AppRecord>()

        // Pre-calculate icon render size in pixels (48dp)
        val density = reactContext.resources.displayMetrics.density
        val iconSizePx = (ICON_SIZE_DP * density).toInt()

        for (appInfo in installedApps) {
            val packageName = appInfo.packageName ?: continue

            // Skip if already processed
            if (!seen.add(packageName)) continue

            // Only include apps that can be launched from the home screen
            val launchIntent = pm.getLaunchIntentForPackage(packageName) ?: continue

            val label = appInfo.loadLabel(pm).toString().trim()
            if (label.isBlank()) continue

            val isSystem = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0

            // Extract icon as base64 PNG
            val iconBase64 = try {
                val drawable = appInfo.loadIcon(pm)
                drawableToBase64(drawable, iconSizePx)
            } catch (e: Exception) {
                null // icon extraction is best-effort
            }

            result.add(AppRecord(label, packageName, isSystem, iconBase64))
        }

        // Sort alphabetically by name, case-insensitive
        result.sortWith(compareBy { it.appName.lowercase() })

        // Map to WritableArray for the React Native bridge
        val array = Arguments.createArray()
        for (record in result) {
            val map = Arguments.createMap().apply {
                putString("appName", record.appName)
                putString("packageName", record.packageName)
                putBoolean("isSystemApp", record.isSystemApp)
                if (record.icon != null) {
                    putString("icon", record.icon)
                }
            }
            array.pushMap(map)
        }
        return array
    }

    /**
     * Converts an Android Drawable to a base64-encoded PNG string.
     * Renders at the specified pixel size for consistent output.
     */
    private fun drawableToBase64(drawable: Drawable, sizePx: Int): String {
        val bitmap = if (drawable is BitmapDrawable && drawable.bitmap != null) {
            Bitmap.createScaledBitmap(drawable.bitmap, sizePx, sizePx, true)
        } else {
            val bmp = Bitmap.createBitmap(sizePx, sizePx, Bitmap.Config.ARGB_8888)
            val canvas = Canvas(bmp)
            drawable.setBounds(0, 0, sizePx, sizePx)
            drawable.draw(canvas)
            bmp
        }

        val stream = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.PNG, 90, stream)
        val bytes = stream.toByteArray()
        return Base64.encodeToString(bytes, Base64.NO_WRAP)
    }

    // ─── Data Model ─────────────────────────────────────────────────────────

    /** Lightweight intermediate DTO — not exposed to JS directly */
    private data class AppRecord(
        val appName: String,
        val packageName: String,
        val isSystemApp: Boolean,
        val icon: String?,
    )

    // ─── Constants ──────────────────────────────────────────────────────────

    companion object {
        const val MODULE_NAME = "InstalledApps"
        private const val ERR_PM_UNAVAILABLE = "ERR_PM_UNAVAILABLE"
        private const val ERR_UNEXPECTED = "ERR_UNEXPECTED"
        private const val ICON_SIZE_DP = 48
    }
}
