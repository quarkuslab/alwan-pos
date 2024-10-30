package com.quarkus.alwanpos

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.quarkus.alwanpos.ui.theme.AlwanPOSTheme
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
                allowFileAccessFromFileURLs = true
                allowUniversalAccessFromFileURLs = true
            }
            webViewClient = object : WebViewClient() {}
            addJavascriptInterface(WebAppInterface(context), "Android")
            addJavascriptInterface(PrinterBridge(), "PrinterBridge")
            Log.d("WebView", "Loading URL: ${BuildConfig.WEBVIEW_URL}")
            loadUrl(BuildConfig.WEBVIEW_URL)
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
        fun print(text: String) {
            try {
                printerService?.apply {
                    printText(text, null)
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


class WebAppInterface(private val context: Context) {
    @JavascriptInterface
    fun showToast(message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }
}