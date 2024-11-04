package com.quarkus.alwanpos

import android.annotation.SuppressLint
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.webkit.WebViewAssetLoader
import com.sunmi.peripheral.printer.InnerPrinterCallback
import com.sunmi.peripheral.printer.InnerPrinterManager
import com.sunmi.peripheral.printer.SunmiPrinterService

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private var printerService: SunmiPrinterService? = null

    // Add these variables for back button handling
    private var doubleBackToExitPressedOnce = false
    private val handler = Handler(Looper.getMainLooper())
    private val doublePressDelay = 2000L // 2 seconds window for second press


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initWebView()
        initPrinter()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        // First check if WebView can go back
        if (webView.canGoBack()) {
            webView.goBack()
            return
        }

        // If WebView cannot go back, handle double press to exit
        if (doubleBackToExitPressedOnce) {
            super.onBackPressed()
            return
        }

        doubleBackToExitPressedOnce = true
        Toast.makeText(this, "Press back again to exit", Toast.LENGTH_SHORT).show()

        handler.postDelayed({
            doubleBackToExitPressedOnce = false
        }, doublePressDelay)
    }

    // Make sure to remove any callbacks when the activity is destroyed
    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        super.onDestroy()
    }

    @SuppressLint("SetJavaScriptEnabled", "NewApi")
    private fun initWebView() {
        val context = this
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        webView = WebView(this).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

            }
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    return assetLoader.shouldInterceptRequest(request.url)
                }
            }
            addJavascriptInterface(PrinterBridge(), "PrinterBridge")
            addJavascriptInterface(SettingsBridge(context), "SettingsBridge")
            loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
        }
        setContentView(webView)
    }

    private fun initPrinter() {
        InnerPrinterManager.getInstance().bindService(this,
            object : InnerPrinterCallback() {
                override fun onConnected(service: SunmiPrinterService?) {
                    printerService = service
                }

                override fun onDisconnected() {
                    // Handle disconnection
                    printerService = null
                }
            })
    }

    inner class PrinterBridge {
        @JavascriptInterface
        fun printText(text: String) {
            try {
                printerService?.apply {
                    // Left Align text
                    setAlignment(0, null)
                    printText(text, null)
                    lineWrap(1, null)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
        
        @JavascriptInterface
        fun printBarcode(data: String) {
            try {
                printerService?.apply {
                    // Center align the barcode
                    setAlignment(1, null)
                    printBarCode(
                        data,           // barcode content
                        8,              // CODE128 type
                        162,            // height
                        2,              // width
                        0,              // no text
                        null            // callback
                    )

                    lineWrap(1, null)     // Cut paper after barcode
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        @JavascriptInterface
        fun cutPaper() {
            try {
                printerService?.apply {
                    lineWrap(3, null)
                    cutPaper(null)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        @JavascriptInterface
        fun getPrinterStatus(): Int {
            return printerService?.updatePrinterState() ?: -1
        }
    }
}