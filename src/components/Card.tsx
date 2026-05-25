import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
  accessibilityLabel?: string;
}

export function Card({ children, style, accessibilityLabel }: Props) {
  const theme = useTheme();
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
});
