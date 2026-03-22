package com.anonymous.returnapp.appblocker

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Shader
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.WindowInsetsController
import android.widget.LinearLayout
import android.widget.TextView

/**
 * BlockingActivity
 *
 * Full-screen blocking UI displayed when user opens a blocked app.
 * Matches the app's sky-300 accent design language (like screen-10 "loading plan" screen).
 *
 * Design philosophy:
 *  - Sky-300 immersive background (like screen-10)
 *  - Large, confident typography
 *  - Shows the actual blocked app name
 *  - Motivational messaging that changes based on context
 *  - Clean action buttons with the app's signature border-bottom style
 *  - Privacy-respecting: only shows what's needed
 */
class BlockingActivity : Activity() {

    companion object {
        const val EXTRA_BLOCKED_PACKAGE = "blocked_package_name"

        /** Motivational messages — randomly shown */
        private val MESSAGES = listOf(
            "Your future self will thank you.",
            "This moment of resistance builds discipline.",
            "What matters most right now?",
            "Stay with it. You're doing great.",
            "Small wins compound into big changes.",
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setupStatusBar()

        val blockedPackage = intent.getStringExtra(EXTRA_BLOCKED_PACKAGE) ?: ""
        val appName = getAppLabel(blockedPackage)

        setContentView(buildUI(appName))
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        goToHomeScreen()
    }

    // ─── UI ─────────────────────────────────────────────────────────────────

    private fun buildUI(appName: String): View {
        val dp = { value: Int ->
            TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                value.toFloat(),
                resources.displayMetrics
            ).toInt()
        }

        // App's exact color palette
        val sky100 = Color.parseColor("#DFF2FE")
        val sky300 = Color.parseColor("#74D4FF")
        val sky400 = Color.parseColor("#00BCFF")
        val sky500 = Color.parseColor("#00A6F4")
        val sky800 = Color.parseColor("#00598A")
        val white = Color.WHITE
        val whiteAlpha60 = Color.parseColor("#99FFFFFF")

        val message = MESSAGES.random()

        // Root: sky-300 background (matches screen-10's bg-sky-300)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(sky300)
            gravity = Gravity.CENTER_HORIZONTAL
        }

        // Top spacer — push content to center
        val topSpacer = View(this).apply {
            layoutParams = LinearLayout.LayoutParams(0, 0, 1.2f)
        }
        root.addView(topSpacer)

        // ── Shield emoji (large) ──
        val shield = TextView(this).apply {
            text = "🛡️"
            textSize = 56f
            gravity = Gravity.CENTER
            setPadding(0, 0, 0, dp(16))
        }
        root.addView(shield)

        // ── Headline: "Take a break." ──
        val headline = TextView(this).apply {
            text = "Take a break."
            textSize = 34f
            setTextColor(white)
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
            gravity = Gravity.CENTER
            letterSpacing = -0.03f
            setPadding(dp(32), 0, dp(32), dp(8))
        }
        root.addView(headline)

        // ── Blocked app name ──
        if (appName.isNotEmpty()) {
            val appLabel = TextView(this).apply {
                text = "$appName is blocked right now."
                textSize = 17f
                setTextColor(sky100)
                typeface = Typeface.create("sans-serif", Typeface.NORMAL)
                gravity = Gravity.CENTER
                setPadding(dp(32), 0, dp(32), dp(6))
            }
            root.addView(appLabel)
        }

        // ── Motivational message ──
        val quoteView = TextView(this).apply {
            text = message
            textSize = 15f
            setTextColor(whiteAlpha60)
            typeface = Typeface.create("sans-serif", Typeface.ITALIC)
            gravity = Gravity.CENTER
            setPadding(dp(40), dp(8), dp(40), 0)
        }
        root.addView(quoteView)

        // Middle spacer
        val midSpacer = View(this).apply {
            layoutParams = LinearLayout.LayoutParams(0, 0, 1f)
        }
        root.addView(midSpacer)

        // ── Buttons container ──
        val btnContainer = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(24), 0, dp(24), dp(48))
        }

        // Primary: "Continue Focus" — white bg, sky-800 text (like the app's white buttons)
        val continueBg = GradientDrawable().apply {
            setColor(white)
            cornerRadius = dp(16).toFloat()
        }
        val continueBtn = TextView(this).apply {
            text = "Continue Focus"
            textSize = 18f
            setTextColor(sky800)
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
            gravity = Gravity.CENTER
            background = continueBg
            setPadding(dp(24), dp(16), dp(24), dp(16))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setOnClickListener { goToHomeScreen() }
        }
        btnContainer.addView(continueBtn)

        // Spacer
        btnContainer.addView(View(this).apply {
            layoutParams = LinearLayout.LayoutParams(1, dp(12))
        })

        // Secondary: "5 min break" — transparent, white border
        val breakBg = GradientDrawable().apply {
            setColor(Color.TRANSPARENT)
            setStroke(dp(2), whiteAlpha60)
            cornerRadius = dp(16).toFloat()
        }
        val breakBtn = TextView(this).apply {
            text = "Take a 5 min break"
            textSize = 16f
            setTextColor(white)
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
            gravity = Gravity.CENTER
            background = breakBg
            setPadding(dp(24), dp(14), dp(24), dp(14))
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setOnClickListener { finish() }
        }
        btnContainer.addView(breakBtn)

        // Spacer
        btnContainer.addView(View(this).apply {
            layoutParams = LinearLayout.LayoutParams(1, dp(16))
        })

        // Tertiary: "Open Return" — text link
        val openAppBtn = TextView(this).apply {
            text = "Open Return"
            textSize = 14f
            setTextColor(whiteAlpha60)
            typeface = Typeface.create("sans-serif-medium", Typeface.NORMAL)
            gravity = Gravity.CENTER
            setPadding(0, dp(8), 0, dp(8))
            setOnClickListener { openReturnApp() }
        }
        btnContainer.addView(openAppBtn)

        root.addView(btnContainer)

        return root
    }

    // ─── Navigation ─────────────────────────────────────────────────────────

    private fun goToHomeScreen() {
        val homeIntent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        startActivity(homeIntent)
        finish()
    }

    private fun openReturnApp() {
        val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
        if (launchIntent != null) {
            launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(launchIntent)
        }
        finish()
    }

    private fun getAppLabel(packageName: String): String {
        return try {
            val ai = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(ai).toString()
        } catch (e: Exception) {
            ""
        }
    }

    // ─── Status Bar ─────────────────────────────────────────────────────────

    private fun setupStatusBar() {
        actionBar?.hide()

        // Sky-300 status bar matching the background
        window.statusBarColor = Color.parseColor("#74D4FF")

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.setSystemBarsAppearance(
                0, // Clear light status bar flag — use white icons on sky bg
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
            window.navigationBarColor = Color.parseColor("#74D4FF")
        } else {
            @Suppress("DEPRECATION")
            window.decorView.systemUiVisibility = 0
        }
    }
}
