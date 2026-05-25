/**
 * SDK swap point.
 *
 * To wire a real prescription vendor SDK in production:
 *   1. Implement `PrescriptionGateway` (see ./types.ts) on top of the vendor SDK.
 *   2. Replace the default export below with that implementation.
 * No other file in the app needs to change — screens, store, and thunks all
 * depend on the `PrescriptionGateway` interface, not on the mock.
 */
import { mockGateway } from './mockGateway';
import { PrescriptionGateway } from './types';

export const gateway: PrescriptionGateway = mockGateway;

export * from './types';
