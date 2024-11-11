import java.io.FileInputStream
import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

// Keep your existing version functions
fun getVersionCode(): Int {
    val tagName = System.getenv("GITHUB_REF_NAME") ?: return 1
    return when {
        tagName.startsWith("v") -> {
            val parts = tagName.substring(1).split(".")
            if (parts.size >= 3) {
                val major = parts[0].toIntOrNull() ?: 0
                val minor = parts[1].toIntOrNull() ?: 0
                val patch = parts[2].toIntOrNull() ?: 0
                major * 1_000_000 + minor * 1_000 + patch
            } else {
                1
            }
        }
        else -> 1
    }
}

fun getVersionName(): String {
    return System.getenv("GITHUB_REF_NAME")?.let { tag ->
        if (tag.startsWith("v")) tag.substring(1) else tag
    } ?: "0.1.0"
}

fun getKeystoreProperties(): Properties {
    val properties = Properties()
    val keystorePropertiesFile = rootProject.file("keystore.properties")
    if (keystorePropertiesFile.exists()) {
        properties.load(FileInputStream(keystorePropertiesFile))
    } else {
        properties.setProperty("storePassword", System.getenv("KEYSTORE_STORE_PASSWORD") ?: "")
        properties.setProperty("keyPassword", System.getenv("KEYSTORE_KEY_PASSWORD") ?: "")
        properties.setProperty("keyAlias", System.getenv("KEYSTORE_KEY_ALIAS") ?: "")
        properties.setProperty("storeFile", System.getenv("KEYSTORE_FILE") ?: "")
    }
    return properties
}

android {
    namespace = "com.quarkus.alwanpos"
    compileSdk = 34

    buildFeatures {
        buildConfig = true
    }

    defaultConfig {
        applicationId = "com.quarkus.alwanpos"
        minSdk = 25
        targetSdk = 34
        versionCode = getVersionCode()
        versionName = getVersionName()

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    signingConfigs {
        create("release") {
            val props = getKeystoreProperties()
            if (props.getProperty("storeFile")?.isNotEmpty() == true) {
                storeFile = file(props.getProperty("storeFile"))
                storePassword = props.getProperty("storePassword")
                keyAlias = props.getProperty("keyAlias")
                keyPassword = props.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            // Ensure WebView can load assets in release build
            manifestPlaceholders["webViewAssetLoader"] = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.1"
    }

    packaging {
        resources {
            excludes += listOf(
                "/META-INF/{AL2.0,LGPL2.1}",
                "META-INF/DEPENDENCIES",
                "META-INF/LICENSE",
                "META-INF/LICENSE.txt",
                "META-INF/license.txt",
                "META-INF/NOTICE",
                "META-INF/NOTICE.txt",
                "META-INF/notice.txt",
                "META-INF/ASL2.0",
                "META-INF/*.kotlin_module"
            )
        }
    }
}

dependencies {
    // Keep your existing dependencies
    implementation("com.sunmi:printerlibrary:1.0.15")
    implementation("androidx.webkit:webkit:1.8.0")
    implementation("androidx.core:core-ktx:1.7.0")
    implementation("androidx.appcompat:appcompat:1.4.1")

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.webkit)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}