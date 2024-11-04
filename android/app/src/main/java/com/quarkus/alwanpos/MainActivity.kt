package com.quarkus.alwanpos

import android.annotation.SuppressLint
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import com.sunmi.peripheral.printer.InnerPrinterCallback
import com.sunmi.peripheral.printer.InnerPrinterManager
import com.sunmi.peripheral.printer.SunmiPrinterService

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private var printerService: SunmiPrinterService? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initWebView()
        initPrinter()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun initWebView() {
        val context = this
        webView = WebView(this).apply {
            settings.apply {
                javaScriptEnabled = true
                domStorageEnabled = true
                allowFileAccess = true
                allowContentAccess = true
            }
            webViewClient = object : WebViewClient() {
                override fun shouldInterceptRequest(
                    view: WebView?,
                    request: WebResourceRequest
                ): WebResourceResponse? {
                    val url = request.url.toString()
                    if (url.endsWith(".js")) {
                        try {
                            // Open the file from assets
                            val path = url.replace("file:///android_asset/", "")
                            val input = context.assets.open(path)

                            // Return with correct MIME type
                            return WebResourceResponse(
                                "application/javascript",
                                "UTF-8",
                                input
                            )
                        } catch (e: Exception) {
                            Log.e("WebView", "Error loading JS file: ${e.message}")
                        }
                    }
                    return super.shouldInterceptRequest(view, request)
                }
            }
            addJavascriptInterface(PrinterBridge(), "PrinterBridge")
            addJavascriptInterface(SettingsBridge(context), "SettingsBridge")
            loadUrl("file:///android_asset/www/index.html")
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