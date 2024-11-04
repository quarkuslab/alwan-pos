package com.quarkus.alwanpos

import android.content.Context
import android.content.SharedPreferences
import android.webkit.JavascriptInterface

class SettingsBridge(private val context: Context) {
    private val preferences: SharedPreferences = context.getSharedPreferences("app_settings", Context.MODE_PRIVATE)

    @JavascriptInterface
    fun saveString(key: String, value: String) {
        preferences.edit().putString(key, value).apply()
    }

    @JavascriptInterface
    fun getString(key: String): String? {
        return if (preferences.contains(key)) {
            preferences.getString(key, null)
        } else null
    }

    @JavascriptInterface
    fun hasKey(key: String): Boolean {
        return preferences.contains(key)
    }

    @JavascriptInterface
    fun remove(key: String) {
        preferences.edit().remove(key).apply()
    }

    @JavascriptInterface
    fun clear() {
        preferences.edit().clear().apply()
    }
}