import { ErrorCode } from '../../utils/errors';
import { log } from '../../utils/logger';
import {
  GatewayError,
  OrderResult,
  PrescriptionGateway,
  PrescriptionSession,
  SessionStatus,
} from './types';

/**
 * Status progression. Each call to `checkSessionStatus` advances one step,
 * so the UI's polling loop drives the state machine naturally.
 */
const STATUS_PROGRESSION: SessionStatus[] = [
  'session_created',
  'awaiting_authorization',
  'prescription_received',
  'ready_to_submit',
];

const NETWORK_DELAY_MS = { min: 600, max: 1200 };
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const randomDelay = () =>
  wait(NETWORK_DELAY_MS.min + Math.random() * (NETWORK_DELAY_MS.max - NETWORK_DELAY_MS.min));

const sessions = new Map<string, PrescriptionSession>();

let nextFault: ErrorCode | null = null;

/**
 * Dev-only hook used by the hidden debug menu in StartScreen to force the
 * next gateway call to fail with a specific error code. No effect in prod
 * (the menu that calls it is gated behind `__DEV__`).
 */
export function __setNextFault(code: ErrorCode | null) {
  nextFault = code;
  log.info('mockGateway: nextFault armed', { code: code ?? 'none' });
}

function consumeFault(): ErrorCode | null {
  const fault = nextFault;
  nextFault = null;
  return fault;
}

function generateSessionId(): string {
  return `sess_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function generatePrescriptionRef(): string {
  const chunk = () =>
    Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase();
  return `RX-${chunk()}-${chunk()}`;
}

function fillPrescriptionData(session: PrescriptionSession): PrescriptionSession {
  return {
    ...session,
    prescriptionReference: session.prescriptionReference ?? generatePrescriptionRef(),
    patientReference: session.patientReference ?? `PAT-${Math.floor(Math.random() * 900 + 100)}`,
    medicationName: session.medicationName ?? 'Mediloon Sample Medication 50mg',
    pharmacyId: session.pharmacyId ?? 'pharmacy_demo_001',
    pharmacyName: session.pharmacyName ?? 'Mediloon Demo Pharmacy',
  };
}

export const mockGateway: PrescriptionGateway = {
  async startPrescriptionSession() {
    await randomDelay();
    const fault = consumeFault();
    if (fault) throw new GatewayError(fault);

    const session: PrescriptionSession = {
      sessionId: generateSessionId(),
      status: 'session_created',
    };
    sessions.set(session.sessionId, session);
    log.info('mockGateway: session started', { sessionId: session.sessionId });
    return session;
  },

  async checkSessionStatus(sessionId: string) {
    await randomDelay();
    const fault = consumeFault();
    if (fault) throw new GatewayError(fault);

    const current = sessions.get(sessionId);
    if (!current) throw new GatewayError('SESSION_EXPIRED');

    const currentIndex = STATUS_PROGRESSION.indexOf(current.status);
    if (currentIndex === -1) {
      // Already submitted / failed / idle — nothing to advance.
      return current;
    }

    const nextStatus =
      STATUS_PROGRESSION[Math.min(currentIndex + 1, STATUS_PROGRESSION.length - 1)];

    let updated: PrescriptionSession = { ...current, status: nextStatus };
    if (nextStatus === 'prescription_received' || nextStatus === 'ready_to_submit') {
      updated = fillPrescriptionData(updated);
    }

    sessions.set(sessionId, updated);
    log.info('mockGateway: status advanced', {
      sessionId,
      from: current.status,
      to: updated.status,
    });
    return updated;
  },

  async completeMockPrescriptionSession(sessionId: string) {
    await randomDelay();
    const fault = consumeFault();
    if (fault) throw new GatewayError(fault);

    const current = sessions.get(sessionId);
    if (!current) throw new GatewayError('SESSION_EXPIRED');

    const completed: PrescriptionSession = fillPrescriptionData({
      ...current,
      status: 'ready_to_submit',
    });
    sessions.set(sessionId, completed);
    log.info('mockGateway: session force-completed', { sessionId });
    return completed;
  },

  async submitOrder(sessionId: string): Promise<OrderResult> {
    await randomDelay();
    const fault = consumeFault();
    if (fault) throw new GatewayError(fault);

    const current = sessions.get(sessionId);
    if (!current) throw new GatewayError('SESSION_EXPIRED');
    if (current.status !== 'ready_to_submit') {
      throw new GatewayError('PRESCRIPTION_MISSING');
    }

    sessions.set(sessionId, { ...current, status: 'submitted' });
    const result: OrderResult = {
      orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
      submittedAt: new Date().toISOString(),
    };
    log.info('mockGateway: order submitted', {
      sessionId,
      orderId: result.orderId,
    });
    return result;
  },
};
