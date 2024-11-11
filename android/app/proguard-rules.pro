# Keep your MainActivity and all its inner classes
-keep class com.quarkus.alwanpos.MainActivity { *; }
-keep class com.quarkus.alwanpos.MainActivity$* { *; }
-keepclassmembers class com.quarkus.alwanpos.MainActivity$* { *; }

# Keep SettingsBridge class if it exists
-keep class com.quarkus.alwanpos.SettingsBridge { *; }

# WebView and JavaScript interfaces
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebView related classes
-keep class android.webkit.** { *; }
-keep class androidx.webkit.** { *; }

# Sunmi Printer Service - Critical for printer functionality
-keep class android.os.SystemProperties { *; }
-keep class com.sunmi.peripheral.printer.** { *; }
-keep interface com.sunmi.peripheral.printer.** { *; }

# Keep AIDL related classes
-keep class woyou.aidlservice.jiuiv5.** { *; }
-keep interface woyou.aidlservice.jiuiv5.** { *; }

# Keep IBinder and IInterface for AIDL
-keep class android.os.IBinder { *; }
-keep class android.os.IInterface { *; }
-keep class android.os.Parcel { *; }

# Keep Parcelable
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

# Keep AIDL generated classes
-keep class * extends android.os.IInterface { *; }
-keep class * extends android.os.Binder { *; }

# Keep printer callbacks
-keep class com.sunmi.peripheral.printer.InnerPrinterCallback { *; }
-keep class com.sunmi.peripheral.printer.InnerResultCallback { *; }
-keep class com.sunmi.peripheral.printer.TransBean { *; }

# Keep essential Android components
-keep class android.content.** { *; }
-keep class android.app.** { *; }

# Keep all native methods
-keepclasseswithmembers class * {
    native <methods>;
}

# Keep Component names and Exceptions for better debugging
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses

# Keep R files
-keepclassmembers class **.R$* {
    public static <fields>;
}

# Keep BuildConfig
-keep class com.quarkus.alwanpos.BuildConfig { *; }

# Keep essential printer classes from being renamed
-keepnames class com.sunmi.peripheral.printer.SunmiPrinterService { *; }
-keepnames class com.sunmi.peripheral.printer.InnerPrinterManager { *; }