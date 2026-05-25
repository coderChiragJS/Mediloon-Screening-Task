import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenProps } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetFlow } from '../store/prescriptionSlice';
import { useTheme } from '../theme';
import { maskReference } from '../utils/mask';

export function OrderConfirmationScreen({ navigation }: ScreenProps<'Confirmation'>) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { order, session } = useAppSelector((s) => s.prescription);

  const handleNew = () => {
    dispatch(resetFlow());
    navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScrollView contentContainerStyle={[styles.scroll, { padding: theme.spacing.xl }]}>
        <View
          style={[
            styles.checkCircle,
            { backgroundColor: theme.colors.success, marginTop: theme.spacing.xxl },
          ]}
        >
          <Text style={styles.checkMark}>✓</Text>
        </View>

        <Text
          style={[
            theme.typography.display,
            { color: theme.colors.text, marginTop: theme.spacing.xl, textAlign: 'center' },
          ]}
        >
          Order submitted
        </Text>
        <Text
          style={[
            theme.typography.body,
            {
              color: theme.colors.textMuted,
              marginTop: theme.spacing.sm,
              textAlign: 'center',
            },
          ]}
        >
          Your prescription request has been sent to the pharmacy. The pharmacy team will review
          it and contact you if anything else is needed.
        </Text>

        <Card style={{ marginTop: theme.spacing.xl }}>
          <Text style={[theme.typography.label, { color: theme.colors.textMuted }]}>
            Order reference
          </Text>
          <Text
            style={[
              theme.typography.mono,
              { color: theme.colors.text, marginTop: 4 },
            ]}
            selectable
          >
            {order ? maskReference(order.orderId) : '—'}
          </Text>
          {session?.pharmacyName && (
            <>
              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.border, marginVertical: theme.spacing.md },
                ]}
              />
              <Text style={[theme.typography.label, { color: theme.colors.textMuted }]}>
                Pharmacy
              </Text>
              <Text
                style={[theme.typography.bodyStrong, { color: theme.colors.text, marginTop: 4 }]}
              >
                {session.pharmacyName}
              </Text>
            </>
          )}
        </Card>

        <Card style={{ marginTop: theme.spacing.lg }}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>
            What happens next
          </Text>
          <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}>
            {[
              'The pharmacy team reviews your request, usually within a few hours.',
              "You'll get a notification once it's approved or if more info is needed.",
              'Once approved, you can pick up your medication or arrange delivery.',
            ].map((line, i) => (
              <View key={i} style={styles.bullet}>
                <Text style={[theme.typography.body, { color: theme.colors.primary }]}>
                  {i + 1}.
                </Text>
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

        <View style={{ marginTop: theme.spacing.xl }}>
          <PrimaryButton title="Start a new request" onPress={handleNew} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'stretch', paddingBottom: 32 },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  checkMark: {
    color: 'white',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 38,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
});
