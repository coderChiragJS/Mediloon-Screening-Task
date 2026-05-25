export type ErrorCode =
  | 'SERVICE_UNAVAILABLE'
  | 'SESSION_EXPIRED'
  | 'USER_CANCELLED'
  | 'PRESCRIPTION_MISSING'
  | 'NETWORK_FAILED'
  | 'SDK_UNAVAILABLE';

export interface UserMessage {
  title: string;
  body: string;
  primaryAction: 'retry' | 'restart' | 'cancel' | 'contact';
  primaryLabel: string;
  secondaryAction?: 'cancel' | 'contact';
  secondaryLabel?: string;
}

const MESSAGES: Record<ErrorCode, UserMessage> = {
  SERVICE_UNAVAILABLE: {
    title: 'Pharmacy service is offline',
    body: "We can't reach the prescription service right now. Please try again in a moment.",
    primaryAction: 'retry',
    primaryLabel: 'Try again',
    secondaryAction: 'cancel',
    secondaryLabel: 'Cancel',
  },
  SESSION_EXPIRED: {
    title: 'Your session timed out',
    body: 'For your security, prescription sessions expire after a short time. Please start a new request.',
    primaryAction: 'restart',
    primaryLabel: 'Start over',
  },
  USER_CANCELLED: {
    title: 'Request cancelled',
    body: 'You cancelled the prescription request. No data was sent to the pharmacy.',
    primaryAction: 'restart',
    primaryLabel: 'Start a new request',
  },
  PRESCRIPTION_MISSING: {
    title: 'No prescription found',
    body: "We couldn't find a prescription linked to this session. If you believe this is wrong, please contact your pharmacy.",
    primaryAction: 'restart',
    primaryLabel: 'Start over',
    secondaryAction: 'contact',
    secondaryLabel: 'Contact pharmacy',
  },
  NETWORK_FAILED: {
    title: 'No internet connection',
    body: 'Check your connection and try again. Your data has not been sent.',
    primaryAction: 'retry',
    primaryLabel: 'Try again',
  },
  SDK_UNAVAILABLE: {
    title: "This device isn't supported yet",
    body: 'Your device does not support secure prescription retrieval. Please use the Mediloon app on a supported device.',
    primaryAction: 'cancel',
    primaryLabel: 'Close',
  },
};

export function userMessage(code: ErrorCode): UserMessage {
  return MESSAGES[code];
}
