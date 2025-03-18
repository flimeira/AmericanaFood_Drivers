import { Text, TextProps, useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

type ThemedTextType = 'default' | 'defaultSemiBold' | 'title' | 'subtitle';

interface ThemedTextProps extends TextProps {
  type?: ThemedTextType;
}

export function ThemedText({ type = 'default', style, ...props }: ThemedTextProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const color = Colors[colorScheme].text;

  const textStyle = {
    color,
    ...(type === 'default' && { fontSize: 16 }),
    ...(type === 'defaultSemiBold' && { fontSize: 16, fontWeight: '600' }),
    ...(type === 'title' && { fontSize: 24, fontWeight: 'bold' }),
    ...(type === 'subtitle' && { fontSize: 20, fontWeight: '600' }),
  };

  return <Text style={[textStyle, style]} {...props} />;
}
