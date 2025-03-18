module.exports = {
  expo: {
    name: 'AmericanaFood Drivers',
    slug: 'americanafooddrivers',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.americanafood.drivers'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.americanafood.drivers',
      permissions: [
        'INTERNET',
        'ACCESS_NETWORK_STATE'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-router'
    ],
    extra: {
      eas: {
        projectId: 'your-project-id'
      }
    },
    scheme: 'americanafooddrivers'
  }
}; 