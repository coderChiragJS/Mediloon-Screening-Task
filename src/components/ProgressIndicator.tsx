import { View } from 'react-native';
import { SessionStatus } from '../services/prescriptionGateway';
import { useTheme } from '../theme';
import { StatusStep, StepState } from './StatusStep';

interface Props {
  status: SessionStatus;
  failed?: boolean;
}

const STEPS: { key: SessionStatus; label: string }[] = [
  { key: 'session_created', label: 'Session created' },
  { key: 'awaiting_authorization', label: 'Waiting for external authorization' },
  { key: 'prescription_received', label: 'Prescription received' },
  { key: 'ready_to_submit', label: 'Ready to submit order' },
];

function stateFor(stepIndex: number, statusIndex: number, failed: boolean): StepState {
  if (failed && stepIndex === statusIndex) return 'failed';
  if (statusIndex > stepIndex) return 'complete';
  if (statusIndex === stepIndex) return 'active';
  return 'pending';
}

export function ProgressIndicator({ status, failed = false }: Props) {
  const theme = useTheme();
  const statusIndex = (() => {
    if (status === 'idle' || status === 'failed') return -1;
    if (status === 'submitted') return STEPS.length;
    return STEPS.findIndex((step) => step.key === status);
  })();

  return (
    <View style={{ paddingVertical: theme.spacing.sm }} accessibilityRole="progressbar">
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        const state =
          statusIndex === -1
            ? 'pending'
            : stateFor(index, statusIndex, failed);
        return (
          <StatusStep
            key={step.key}
            title={step.label}
            state={state}
            isLast={isLast}
          />
        );
      })}
    </View>
  );
}
