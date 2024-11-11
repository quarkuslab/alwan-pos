# Keep your MainActivity and all its inner classes
-keep class com.quarkus.alwanpos.MainActivity { *; }
-keep class com.quarkus.alwanpos.MainActivity$* { *; }
-keepclassmembers class com.quarkus.alwanpos.MainActivity$* { *; }

# Keep SettingsBridge class if it exists
-keep class com.quarkus.alwanpos.SettingsBridge { *; }

# Keep WebView and JavaScript interfaces
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebView related classes
-keep class android.webkit.** { *; }
-keep class androidx.webkit.** { *; }

# Keep Sunmi Printer related classes
-keep class com.sunmi.peripheral.printer.** { *; }
-keep class woyou.aidlservice.jiuiv5.** { *; }
-keep class com.sunmi.** { *; }

# Keep Android core components
-keep class androidx.core.** { *; }
-keep class androidx.appcompat.** { *; }

# Keep needed Android components
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.preference.Preference
-keep public class * extends android.view.View

# Keep all public constructors of all public classes
-keepclassmembers public class * {
    public <init>(...);
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep Parcelables
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep Serializable classes
-keepnames class * implements java.io.Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep source file names for better crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep Component names for better crash reports
-keepattributes *Annotation*

# Keep Exceptions
-keep public class * extends java.lang.Exception

# Keep Enum classes
-keepclassmembers,allowoptimization enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}