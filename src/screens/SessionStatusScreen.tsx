import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ErrorView } from '../components/ErrorView';
import { LoadingDots } from '../components/LoadingDots';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { SecondaryButton } from '../components/SecondaryButton';
import { ScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  cancelFlow,
  clearError,
  completeSession,
  pollSessionStatus,
  startSession,
} from '../store/prescriptionSlice';
import { useTheme } from '../theme';

const POLL_INTERVAL_MS = 1200;
const AUTO_ADVANCE_MS = 500;

export function SessionStatusScreen({ navigation }: ScreenProps<'SessionStatus'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { session, status, error } = useAppSelector((s) => s.prescription);
  const pollHandle = useRef<ReturnType<typeof setInterval> | null>(null);

  const sessionId = session?.sessionId;

  // Start polling on mount, stop on terminal status, error, or unmount.
  useEffect(() => {
    if (!sessionId) return;
    if (status === 'ready_to_submit' || status === 'failed' || status === 'submitted') {
      return;
    }
    pollHandle.current = setInterval(() => {
      dispatch(pollSessionStatus(sessionId));
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollHandle.current) clearInterval(pollHandle.current);
      pollHandle.current = null;
    };
  }, [dispatch, sessionId, status]);

  // Auto-advance to review when ready.
  useEffect(() => {
    if (status === 'ready_to_submit') {
      const handle = setTimeout(() => navigation.replace('Review'), AUTO_ADVANCE_MS);
      return () => clearTimeout(handle);
    }
  }, [status, navigation]);

  const handleComplete = () => {
    if (sessionId) dispatch(completeSession(sessionId));
  };

  const handleCancel = () => {
    dispatch(cancelFlow());
    navigation.navigate('Start');
  };

  const handleRetry = async () => {
    dispatch(clearError());
    const result = await dispatch(startSession());
    if (!startSession.fulfilled.match(result)) {
      navigation.navigate('Start');
    }
  };

  const statusLabel = (() => {
    switch (status) {
      case 'session_created':
        return 'Setting up your secure session…';
      case 'awaiting_authorization':
        return 'Waiting for external authorization…';
      case 'prescription_received':
        return 'Prescription received from provider…';
      case 'ready_to_submit':
        return 'All set. Opening review…';
      case 'failed':
        return 'Something went wrong.';
      default:
        return 'Connecting…';
    }
  })();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={[styles.scroll, { padding: theme.spacing.xl }]}>
        <Text style={[theme.typography.label, { color: theme.colors.primary }]}>
          Step 2 of 4
        </Text>
        <Text
          style={[
            theme.typography.title,
            { color: theme.colors.text, marginTop: theme.spacing.sm },
          ]}
        >
          Retrieving your prescription
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: theme.spacing.sm },
          ]}
        >
          {statusLabel}
        </Text>

        {status !== 'failed' && (
          <View style={{ marginTop: theme.spacing.lg }}>
            <LoadingDots />
          </View>
        )}

        <Card style={{ marginTop: theme.spacing.xl }}>
          <ProgressIndicator status={status} failed={status === 'failed'} />
        </Card>

        {error && status === 'failed' && (
          <View style={{ marginTop: theme.spacing.lg }}>
            <ErrorView
              code={error.code}
              onRetry={handleRetry}
              onRestart={handleCancel}
              onCancel={handleCancel}
              onContact={handleCancel}
            />
          </View>
        )}

        <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
          {status !== 'failed' && status !== 'ready_to_submit' && (
            <SecondaryButton
              title="Complete Session"
              onPress={handleComplete}
              accessibilityHint="Completes the prescription session immediately"
            />
          )}
          {status !== 'failed' && (
            <SecondaryButton
              title="Cancel"
              variant="ghost"
              onPress={handleCancel}
              accessibilityHint="Cancels the prescription request and returns to start"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 32 },
});
