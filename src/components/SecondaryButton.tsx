import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'outline' | 'ghost' | 'danger';
  disabled?: boolean;
  testID?: string;
  accessibilityHint?: string;
}

export function SecondaryButton({
  title,
  onPress,
  variant = 'outline',
  disabled = false,
  testID,
  accessibilityHint,
}: Props) {
  const theme = useTheme();

  const palette = (() => {
    switch (variant) {
      case 'ghost':
        return { bg: 'transparent', border: 'transparent', text: theme.colors.primary };
      case 'danger':
        return { bg: 'transparent', border: theme.colors.danger, text: theme.colors.danger };
      default:
        return {
          bg: 'transparent',
          border: theme.colors.border,
          text: theme.colors.text,
        };
    }
  })();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          borderWidth: variant === 'ghost' ? 0 : 1,
          opacity: pressed ? 0.6 : disabled ? 0.5 : 1,
          borderRadius: theme.radius.lg,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      <Text style={[theme.typography.bodyStrong, { color: palette.text, textAlign: 'center' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
});
