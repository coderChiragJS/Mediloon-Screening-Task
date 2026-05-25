import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';

interface Props {
  message?: string;
}

export function TrustBadge({
  message = 'Your data is processed securely. This is a demo flow — no real prescriptions are retrieved.',
}: Props) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Security note. ${message}`}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primaryMuted,
          borderRadius: theme.radius.md,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        },
      ]}
    >
      <Text style={[styles.icon, { color: theme.colors.primary }]}>🔒</Text>
      <Text
        style={[
          theme.typography.caption,
          { color: theme.colors.text, flex: 1, lineHeight: 18 },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  icon: {
    fontSize: 16,
    lineHeight: 18,
  },
});
