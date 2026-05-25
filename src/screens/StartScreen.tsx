import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ErrorView } from '../components/ErrorView';
import { PrimaryButton } from '../components/PrimaryButton';
import { TrustBadge } from '../components/TrustBadge';
import { ScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearError, resetFlow, startSession } from '../store/prescriptionSlice';
import { useTheme } from '../theme';

export function StartScreen({ navigation }: ScreenProps<'Start'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error, status } = useAppSelector((s) => s.prescription);

  useEffect(() => {
    dispatch(resetFlow());
  }, [dispatch]);

  const handleStart = async () => {
    const result = await dispatch(startSession());
    if (startSession.fulfilled.match(result)) {
      navigation.navigate('SessionStatus');
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { padding: theme.spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View
          accessibilityRole="header"
          accessibilityLabel="Mediloon"
          style={{ alignItems: 'center', marginTop: theme.spacing.xxl }}
        >
          <View
            style={[
              styles.logoCircle,
              { backgroundColor: theme.colors.primary, borderRadius: theme.radius.pill },
            ]}
          >
            <Text style={[styles.logoMark, { color: theme.colors.textInverse }]}>M</Text>
          </View>
          <Text style={[theme.typography.title, { color: theme.colors.text, marginTop: theme.spacing.lg }]}>
            Mediloon
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 4 }]}>
            Demo Pharmacy
          </Text>
        </View>

        <View style={{ marginTop: theme.spacing.xxl }}>
          <Text style={[theme.typography.display, { color: theme.colors.text }]}>
            Request a prescription
          </Text>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textMuted, marginTop: theme.spacing.sm },
            ]}
          >
            Start your prescription request securely. Your prescription data will be retrieved
            and sent to the pharmacy for review.
          </Text>
        </View>

        <Card style={{ marginTop: theme.spacing.xl }}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            How it works
          </Text>
          <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}>
            {[
              'Start a secure prescription session.',
              'We retrieve your prescription securely.',
              'You review and submit the order to the pharmacy.',
            ].map((line, i) => (
              <View key={i} style={styles.bullet}>
                <View
                  style={[
                    styles.bulletDot,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <Text
                  style={[
                    theme.typography.body,
                    { color: theme.colors.text, flex: 1 },
                  ]}
                >
                  {line}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ marginTop: theme.spacing.lg }}>
          <TrustBadge />
        </View>

        {error && status === 'failed' && (
          <View style={{ marginTop: theme.spacing.lg }}>
            <ErrorView
              code={error.code}
              onRetry={handleStart}
              onRestart={() => dispatch(clearError())}
              onCancel={() => dispatch(clearError())}
              onContact={() => dispatch(clearError())}
            />
          </View>
        )}

        <View style={{ marginTop: theme.spacing.xl }}>
          <PrimaryButton
            title="Start Prescription Flow"
            onPress={handleStart}
            loading={isLoading}
            accessibilityHint="Starts a new secure prescription session"
            testID="start-flow-button"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  logoCircle: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    fontSize: 28,
    fontWeight: '800',
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 10,
  },
});
