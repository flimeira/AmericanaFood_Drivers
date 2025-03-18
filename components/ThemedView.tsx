import { View, ViewProps, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export function ThemedView(props: ViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = Colors[colorScheme].background;

  return <View style={[{ backgroundColor }, props.style]} {...props} />;
}
