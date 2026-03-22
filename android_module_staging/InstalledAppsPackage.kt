package com.anonymous.returnapp.installedapps

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

/**
 * InstalledAppsPackage
 *
 * Registers InstalledAppsModule with the React Native bridge.
 * This class is instantiated inside MainApplication's getPackages() method
 * via the Expo config plugin `withInstalledApps`.
 *
 * Follows the standard ReactPackage contract:
 *  - createNativeModules  → bridge modules (our case)
 *  - createViewManagers   → custom views (none here)
 */
class InstalledAppsPackage : ReactPackage {

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): List<NativeModule> = listOf(InstalledAppsModule(reactContext))

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): List<ViewManager<*, *>> = emptyList()
}
