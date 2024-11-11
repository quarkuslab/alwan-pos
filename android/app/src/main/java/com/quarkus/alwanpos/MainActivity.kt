package com.quarkus.alwanpos

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.AssetManager
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
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
    private var doubleBackToExitPressedOnce = false
    private val handler = Handler(Looper.getMainLooper())
    private val doublePressDelay = 2000L


    override fun onCreate(savedInstanceState: Bundle?) {
        Thread.setDefaultUncaughtExceptionHandler { _, throwable ->
            Log.e("MainActivity", "Uncaught exception", throwable)
            // Log to file or crash reporting service
        }

        super.onCreate(savedInstanceState)
        try {
            initWebView()
            initPrinter()
        } catch (e: Exception) {
            Log.e("MainActivity", "Error in onCreate", e)
            Toast.makeText(this, "Error initializing app: ${e.message}", Toast.LENGTH_LONG).show()
        }
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
        try {
            val context = this
            val assetLoader = WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
                .build()

            webView = WebView(this).apply {
                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    databaseEnabled = true
                    mediaPlaybackRequiresUserGesture = false
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                }

                webViewClient = object : WebViewClient() {
                    override fun shouldInterceptRequest(
                        view: WebView,
                        request: WebResourceRequest
                    ): WebResourceResponse? {
                        return try {
                            assetLoader.shouldInterceptRequest(request.url)
                        } catch (e: Exception) {
                            Log.e("WebView", "Error intercepting request", e)
                            null
                        }
                    }

                    @Deprecated("Deprecated in Java")
                    override fun onReceivedError(
                        view: WebView?,
                        errorCode: Int,
                        description: String?,
                        failingUrl: String?
                    ) {
                        Log.e("WebView", "Error loading URL: $failingUrl, Error: $description")
                        super.onReceivedError(view, errorCode, description, failingUrl)
                    }
                }

                // Add JavaScript interfaces
                addJavascriptInterface(PrinterBridge(), "PrinterBridge")
                addJavascriptInterface(SettingsBridge(context), "SettingsBridge")

                // Load the URL
                loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
            }
            setContentView(webView)
        } catch (e: Exception) {
            Log.e("WebView", "Error initializing WebView", e)
            throw e
        }
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
        private val context: Context = this@MainActivity

        @JavascriptInterface
        fun printLogo() {
            try {
                val assetManager: AssetManager = context.assets

                assetManager.open("www/logo.jpg").use { inputStream ->
                    var bitmap = BitmapFactory.decodeStream(inputStream)

                    // Preprocess the bitmap for better printing
                    bitmap = preprocessBitmap(bitmap)

                    // Scale the bitmap
                    val scaledBitmap = scaleBitmap(bitmap, 192)

                    printerService?.apply {
                        setAlignment(1, null)
                        // Use black/white mode with preprocessed image
                        printBitmapCustom(scaledBitmap, 1, null)
                        lineWrap(1, null)
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        private fun preprocessBitmap(original: Bitmap): Bitmap {
            // Create a mutable copy of the bitmap
            val processed = original.copy(Bitmap.Config.ARGB_8888, true)

            // Get pixel array
            val pixels = IntArray(processed.width * processed.height)
            processed.getPixels(pixels, 0, processed.width, 0, 0, processed.width, processed.height)

            // Process each pixel
            for (i in pixels.indices) {
                val pixel = pixels[i]
                // Convert to grayscale using luminance formula
                val gray = (0.299 * android.graphics.Color.red(pixel) +
                        0.587 * android.graphics.Color.green(pixel) +
                        0.114 * android.graphics.Color.blue(pixel)).toInt()

                // Apply threshold (adjust this value if needed)
                val threshold = 127
                val finalColor = if (gray > threshold) {
                    android.graphics.Color.WHITE
                } else {
                    android.graphics.Color.BLACK
                }

                pixels[i] = finalColor
            }

            // Set processed pixels back to bitmap
            processed.setPixels(pixels, 0, processed.width, 0, 0, processed.width, processed.height)
            return processed
        }

        private fun scaleBitmap(originalBitmap: Bitmap, maxWidth: Int): Bitmap {
            val width = originalBitmap.width
            val height = originalBitmap.height

            if (width <= maxWidth) {
                return originalBitmap
            }

            val ratio = maxWidth.toFloat() / width.toFloat()
            val newHeight = (height * ratio).toInt()

            return Bitmap.createScaledBitmap(originalBitmap, maxWidth, newHeight, true)
        }

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