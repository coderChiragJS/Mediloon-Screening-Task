import { StyleSheet, Text, View } from 'react-native';
import { ErrorCode, userMessage } from '../utils/errors';
import { useTheme } from '../theme';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface Props {
  code: ErrorCode;
  onRetry?: () => void;
  onRestart?: () => void;
  onCancel?: () => void;
  onContact?: () => void;
}

export function ErrorView({ code, onRetry, onRestart, onCancel, onContact }: Props) {
  const theme = useTheme();
  const message = userMessage(code);

  const handlePrimary = () => {
    switch (message.primaryAction) {
      case 'retry':
        onRetry?.();
        return;
      case 'restart':
        onRestart?.();
        return;
      case 'cancel':
        onCancel?.();
        return;
      case 'contact':
        onContact?.();
        return;
    }
  };

  const handleSecondary = () => {
    if (message.secondaryAction === 'cancel') onCancel?.();
    if (message.secondaryAction === 'contact') onContact?.();
  };

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={`${message.title}. ${message.body}`}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.danger,
          borderRadius: theme.radius.lg,
          padding: theme.spacing.xl,
        },
      ]}
    >
      <Text style={[styles.icon, { color: theme.colors.danger }]}>⚠️</Text>
      <Text
        style={[
          theme.typography.heading,
          { color: theme.colors.text, marginTop: theme.spacing.sm },
        ]}
      >
        {message.title}
      </Text>
      <Text
        style={[
          theme.typography.body,
          { color: theme.colors.textMuted, marginTop: theme.spacing.sm },
        ]}
      >
        {message.body}
      </Text>

      <View style={{ marginTop: theme.spacing.lg, gap: theme.spacing.sm }}>
        <PrimaryButton title={message.primaryLabel} onPress={handlePrimary} />
        {message.secondaryAction && message.secondaryLabel && (
          <SecondaryButton title={message.secondaryLabel} onPress={handleSecondary} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  icon: {
    fontSize: 28,
  },
});
