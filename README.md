# Alwan POS

A hybrid point-of-sale application built with React and Android.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Release Process](#release-process)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have the following installed:

- Node.js (v18 or higher)
- Java Development Kit (JDK) 17
- Android SDK
- Android Studio (recommended for SDK management)
- Gradle 8.x

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/alwan-pos.git
cd alwan-pos
```

2. Install dependencies:

```bash
npm install
```

3. Set up Android development environment:
   - Open Android Studio
   - Install any missing SDK components
   - Accept Android SDK licenses:
     ```bash
     $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
     ```

## Development

### Running the Development Server

The project uses a concurrent development setup that runs both web and Android builds:

```bash
# Start both web and Android development
npm run dev

# Start web development only
npm run web:dev

# Start Android development only
npm run android:dev
```

### Development Build Process

1. Web assets are built using Vite
2. Assets are copied to Android assets directory
3. Android app is built and installed on connected device/emulator
4. Changes in src/ trigger automatic rebuilds

## Building for Production

### Local Production Build

To create a debug APK locally:

```bash
npm run build
```

This will:

1. Build web assets
2. Copy assets to Android project
3. Create debug APK

### Release Build Setup

#### One-time Setup

1. Generate a keystore file:

```bash
keytool -genkey -v -keystore alwan-pos-release.keystore \
  -alias alwan-pos \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

2. Create `android/keystore.properties` for local development:

```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=alwan-pos
storeFile=keystore/release.keystore
```

Note: Don't commit keystore.properties to version control!

#### GitHub Actions Setup

1. Generate base64 version of your keystore:

```bash
# On macOS
base64 -i alwan-pos-release.keystore | pbcopy

# On Linux
base64 alwan-pos-release.keystore | tr -d \\n | clip
```

2. Add the following secrets to your GitHub repository:
   - Go to Repository Settings → Secrets and variables → Actions
   - Add New Repository Secrets:
     - `KEYSTORE_BASE64`: Your base64-encoded keystore
     - `KEYSTORE_STORE_PASSWORD`: Keystore password
     - `KEYSTORE_KEY_PASSWORD`: Key password
     - `KEYSTORE_KEY_ALIAS`: "alwan-pos"

## Release Process

1. Update version in `package.json`

2. Create and push a new tag:

```bash
git tag v1.0.0  # Use appropriate version
git push origin v1.0.0
```

3. GitHub Actions will automatically:

   - Build the web assets
   - Create a signed APK
   - Create a GitHub release
   - Upload the APK as a release asset

4. Find your release at: `https://github.com/your-username/alwan-pos/releases`

## Project Structure

```
alwan-pos/
├── src/               # React web application
├── android/           # Android application
├── dist/             # Built web assets
├── releases/         # Generated APK files
└── .github/
    └── workflows/    # GitHub Actions configurations
```

## Available Scripts

- `npm run dev`: Start development environment
- `npm run build`: Build debug APK
- `npm run build:apk`: Build release APK
- `npm run web:dev`: Start web development server
- `npm run android:dev`: Start Android development
- `npm run android:release`: Build release APK
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Troubleshooting

### Common Issues

1. **Build fails with keystore errors**

   - Verify keystore.properties exists for local builds
   - Check GitHub secrets are set correctly for CI/CD

2. **Android SDK not found**

   - Ensure ANDROID_HOME environment variable is set
   - Install required SDK versions through Android Studio

3. **Gradle build fails**
   - Run `cd android && ./gradlew clean`
   - Check Java version matches requirements

### Development Tips

1. Use `adb devices` to verify connected devices
2. Check `android/app/build/outputs/logs` for build issues
3. Run `npm run web:dev` separately for faster web development

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Add your license information here]
