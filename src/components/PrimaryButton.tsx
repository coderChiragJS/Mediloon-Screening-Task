import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  testID?: string;
  accessibilityHint?: string;
}

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  testID,
  accessibilityHint,
}: Props) {
  const theme = useTheme();
  const isInactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isInactive}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isInactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isInactive ? theme.colors.textMuted : theme.colors.primary,
          opacity: pressed && !isInactive ? 0.85 : 1,
          borderRadius: theme.radius.lg,
          paddingVertical: theme.spacing.lg,
          paddingHorizontal: theme.spacing.xl,
        },
      ]}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator color={theme.colors.textInverse} style={{ marginRight: 8 }} />
        )}
        <Text
          style={[
            theme.typography.bodyStrong,
            { color: theme.colors.textInverse, textAlign: 'center' },
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
