import { ErrorCode } from '../../utils/errors';

export type SessionStatus =
  | 'idle'
  | 'session_created'
  | 'awaiting_authorization'
  | 'prescription_received'
  | 'ready_to_submit'
  | 'submitted'
  | 'failed';

export interface PrescriptionSession {
  sessionId: string;
  status: SessionStatus;
  prescriptionReference?: string;
  patientReference?: string;
  medicationName?: string;
  pharmacyId?: string;
  pharmacyName?: string;
}

export interface OrderResult {
  orderId: string;
  submittedAt: string;
}

/**
 * Tagged error used by every gateway method. Screens read `code` to decide
 * which user-facing message and recovery action to render.
 */
export class GatewayError extends Error {
  readonly code: ErrorCode;
  constructor(code: ErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'GatewayError';
    this.code = code;
  }
}

/**
 * The interface a real vendor SDK would have to satisfy. Swapping
 * `mockGateway` for a real implementation in `index.ts` is the only change
 * required to wire production — the rest of the app talks to this contract.
 */
export interface PrescriptionGateway {
  startPrescriptionSession(): Promise<PrescriptionSession>;
  checkSessionStatus(sessionId: string): Promise<PrescriptionSession>;
  completeMockPrescriptionSession(sessionId: string): Promise<PrescriptionSession>;
  submitOrder(sessionId: string): Promise<OrderResult>;
}
