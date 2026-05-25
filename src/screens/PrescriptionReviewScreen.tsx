import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { DataRow } from '../components/DataRow';
import { ErrorView } from '../components/ErrorView';
import { PrimaryButton } from '../components/PrimaryButton';
import { SecondaryButton } from '../components/SecondaryButton';
import { ScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cancelFlow, clearError, submitOrder } from '../store/prescriptionSlice';
import { useTheme } from '../theme';
import { maskReference } from '../utils/mask';

export function PrescriptionReviewScreen({ navigation }: ScreenProps<'Review'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { session, isLoading, error, status } = useAppSelector((s) => s.prescription);

  if (!session) {
    // Defensive — if user lands here without state, kick back to start.
    navigation.replace('Start');
    return null;
  }

  const handleSubmit = async () => {
    const result = await dispatch(submitOrder(session.sessionId));
    if (submitOrder.fulfilled.match(result)) {
      navigation.replace('Confirmation');
    }
  };

  const handleCancel = () => {
    dispatch(cancelFlow());
    navigation.navigate('Start');
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={[styles.scroll, { padding: theme.spacing.xl }]}>
        <Text style={[theme.typography.label, { color: theme.colors.primary }]}>
          Step 3 of 4
        </Text>
        <Text
          style={[
            theme.typography.title,
            { color: theme.colors.text, marginTop: theme.spacing.sm },
          ]}
        >
          Review prescription
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: theme.spacing.sm },
          ]}
        >
          Please confirm the details below before sending this request to the pharmacy.
        </Text>

        <View
          style={[
            styles.demoBanner,
            {
              backgroundColor: theme.colors.primaryMuted,
              borderRadius: theme.radius.md,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
              marginTop: theme.spacing.lg,
            },
          ]}
          accessibilityRole="text"
        >
          <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
            This is demo / mocked data. No real prescription has been retrieved.
          </Text>
        </View>

        <Card style={{ marginTop: theme.spacing.lg }}>
          <DataRow
            label="Prescription reference"
            value={maskReference(session.prescriptionReference)}
            monospace
          />
          <DataRow
            label="Patient reference"
            value={session.patientReference ?? '—'}
            monospace
          />
          <DataRow
            label="Medication"
            value={session.medicationName ?? '—'}
          />
          <DataRow
            label="Pharmacy"
            value={session.pharmacyName ?? session.pharmacyId ?? '—'}
          />
        </Card>

        {error && status === 'failed' && (
          <View style={{ marginTop: theme.spacing.lg }}>
            <ErrorView
              code={error.code}
              onRetry={() => {
                dispatch(clearError());
                handleSubmit();
              }}
              onRestart={handleCancel}
              onCancel={handleCancel}
              onContact={handleCancel}
            />
          </View>
        )}

        <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
          <PrimaryButton
            title="Submit Order Request"
            onPress={handleSubmit}
            loading={isLoading}
            testID="submit-order-button"
          />
          <SecondaryButton
            title="Cancel"
            variant="ghost"
            onPress={handleCancel}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  demoBanner: {},
});
