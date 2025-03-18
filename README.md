# AmericanaFood Drivers App

This is a React Native application built with Expo for the AmericanaFood Drivers platform.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Android SDK

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

## Running the App

### Development

To run the app in development mode:

```bash
npm start
```

Then press 'a' to run on Android emulator or scan the QR code with Expo Go app on your physical device.

### Building APK

To create a development build APK:

1. First, create a development build:

   ```bash
   npx expo prebuild
   ```

2. Then build the APK:

   ```bash
   npx expo run:android
   ```

The APK will be generated in the `android/app/build/outputs/apk/debug` directory.

## Project Structure

- `/assets` - Contains images, fonts, and other static files
- `/src` - Source code directory
- `App.js` - Main application component
- `app.json` - Expo configuration file

## Development Guidelines

- Follow the existing code style
- Create new components in the `/src/components` directory
- Add new screens in the `/src/screens` directory
- Use TypeScript for new files

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
