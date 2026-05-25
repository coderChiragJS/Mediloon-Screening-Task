# Mediloon — Prescription Flow POC

A small React Native (Expo + TypeScript) proof-of-concept that simulates a
customer starting a prescription retrieval session, receiving mocked
prescription data from an external service, reviewing it, and submitting an
order request to the pharmacy.

The focus of this POC is **mobile flow + integration structure**, not visual
polish. Every architectural decision is made with two goals in mind:

1. **Replaceable mock** — the mock prescription SDK lives behind a single
   TypeScript interface so it can be swapped for a real vendor SDK without
   touching any screen, thunk, or component.
2. **Production thinking** — sensitive prescription / patient references are
   masked in the UI, scrubbed in logs, and the README documents the
   security, storage, and release steps that would harden this for the
   App Store / Play Store.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo (managed) SDK 56, React Native 0.85, React 19 |
| Language | TypeScript (strict) |
| Navigation | `@react-navigation/native` + native-stack |
| State | Redux Toolkit + `createAsyncThunk` |
| Styling | React Native `StyleSheet` + theme tokens (`src/theme/`) |
| Mock SDK | Hardcoded async service layer behind a `PrescriptionGateway` interface |
| Logger | Tiny custom logger that scrubs sensitive keys |

Bundled deliberately small: no extra UI library, no animation library,
no state library besides Redux Toolkit.

---

## How to run locally

```bash
git clone <repo-url>
cd mediloon-prescription-app
npm install
npx expo start
```

Then either:

- press `i` in the terminal to open the iOS simulator (requires Xcode),
- press `a` for Android emulator (requires Android Studio), or
- scan the QR code with the **Expo Go** app on a real phone.

> Node 20+ is recommended. The project was tested on Node 23.

---

## Folder structure

```
mediloon-prescription-app/
├─ App.tsx                       # Entry: Provider + SafeAreaProvider + RootNavigator
├─ src/
│  ├─ navigation/RootNavigator.tsx   # Native stack: Start → Status → Review → Confirmation
│  ├─ screens/                       # The 4 screens
│  ├─ components/                    # Reusable themed primitives
│  ├─ services/prescriptionGateway/  # The SDK swap point — see its own README
│  ├─ store/                         # Redux Toolkit slice + typed hooks
│  ├─ theme/                         # Tokens (colors / spacing / typography / useTheme)
│  └─ utils/                         # mask, logger, errors
└─ app.json
```

Each folder has one job:

- `services/prescriptionGateway/` is the only place that talks to the
  outside world (or, today, the mock).
- `store/` owns the state machine and translates gateway errors into
  user-facing copy.
- `screens/` only read state and dispatch actions — no business logic.
- `components/` are dumb, themed primitives reused across screens.
- `utils/` is the security toolkit (`mask`, `logger`, `errors`).

---

## Mock SDK / API flow

```
┌──────────┐  dispatch   ┌─────────────────┐  await   ┌────────────────────────┐
│  Screen  │ ──────────► │ Redux thunk     │ ───────► │ gateway (interface)    │
└──────────┘             │ (prescription/  │          │                        │
       ▲                 │  startSession,  │ ◄─────── │ mockGateway (today)    │
       │ state           │  pollStatus,    │  resolve │ realVendorGateway      │
       │                 │  submitOrder)   │  /reject │ (production)           │
       │                 └─────────────────┘          └────────────────────────┘
       │                          │
       │                          ▼
       │                  ┌─────────────────┐
       └──────────────────│ prescription    │
              new state   │ slice (RTK)     │
                          └─────────────────┘
```

The gateway exposes four methods:

```ts
interface PrescriptionGateway {
  startPrescriptionSession(): Promise<PrescriptionSession>;
  checkSessionStatus(sessionId: string): Promise<PrescriptionSession>;
  completeMockPrescriptionSession(sessionId: string): Promise<PrescriptionSession>;
  submitOrder(sessionId: string): Promise<OrderResult>;
}
```

The mock implementation drives a state machine via `checkSessionStatus`:
each call advances the session one step (`session_created` →
`awaiting_authorization` → `prescription_received` → `ready_to_submit`),
which lets the Status screen's polling loop appear to drive the flow
naturally.

**To swap in a real SDK in production**: implement `PrescriptionGateway`
on top of the vendor SDK and change one line in
`src/services/prescriptionGateway/index.ts`. Nothing else changes.
See [`src/services/prescriptionGateway/README.md`](./src/services/prescriptionGateway/README.md).

---

## App flow walkthrough

| # | Screen | What happens |
|---|---|---|
| 1 | **Start** | Logo, process explainer, trust badge, "Start Prescription Flow" CTA. Dispatches `startSession` and navigates to Status. |
| 2 | **Session status** | Vertical 4-step `ProgressIndicator` advances as the mock state machine polls. Auto-advances to Review when `ready_to_submit`. Cancel or "Skip wait" (dev) available. |
| 3 | **Review** | Masked prescription reference, medication, patient reference, pharmacy. Demo-data banner. "Submit Order Request" CTA. |
| 4 | **Confirmation** | Success check, masked order ID, "what happens next" steps, "Start a new request" CTA. |

Screenshots: see [`docs/screenshots/`](./docs/screenshots/) (or attached
recording, depending on submission format).

---

## Error states implemented

The PDF asks for at least three. We deliver six, all driven by a single
`<ErrorView />` that reads the error code from Redux state and renders
the right copy + recovery action.

| Code | Title | Recovery |
|---|---|---|
| `SERVICE_UNAVAILABLE` | Pharmacy service is offline | Retry / Cancel |
| `SESSION_EXPIRED` | Your session timed out | Start over |
| `NETWORK_FAILED` | No internet connection | Retry |
| `PRESCRIPTION_MISSING` | No prescription found | Start over / Contact pharmacy |
| `SDK_UNAVAILABLE` | This device isn't supported yet | Close |
| `USER_CANCELLED` | Request cancelled | Start a new request |

### Triggering errors on demand (live demo)

Long-press the Mediloon logo on the Start screen. A developer bottom
sheet opens (gated behind `__DEV__`) that arms the next gateway call to
throw a specific `GatewayError`. This guarantees the error UI can be
shown reliably during the interview without waiting on randomness.

---

## Security considerations

### What data should be treated as sensitive

- `prescriptionReference` — the equivalent of a one-time prescription token.
- `patientReference` — pseudonymous, but still PHI-adjacent under HIPAA / GDPR.
- `sessionId` — short-lived but a valid bearer of a session in flight.
- In production: any real medication, dosage, prescriber identity, or
  insurance data would join this list.

### Why prescription references aren't logged openly

Plaintext tokens in logs become a breach in waiting — anything that
flows into Sentry/Datadog, gets screenshot for a bug report, or syncs to
a vendor backup becomes a leak surface. Regulators (HIPAA §164.312,
GDPR Art. 32) require technical safeguards over identifiers like these,
and treating them as opaque "secret-equivalent" in logs is the cheapest
such safeguard.

`src/utils/logger.ts` enforces this at the framework level: any object
field named `prescriptionReference`, `patientReference`, `sessionId`,
or any auth token is automatically masked (`RX-****-1234`) before it
hits `console.*`. Adding a new sensitive field is a one-line change to
`SENSITIVE_KEYS`.

### Secure storage in production

- **Never `AsyncStorage`** for tokens or PHI — it is plaintext SQLite/files.
- **Use `expo-secure-store`** (managed) → iOS Keychain / Android
  EncryptedSharedPreferences backed by Keystore.
- Short-lived session tokens stay in memory only and never persist.
- Refresh tokens, if any, go into Keychain/Keystore with biometric
  reauthentication required to unlock.

### Authentication

- OAuth 2.0 / OIDC with PKCE — the only safe flow for public mobile clients.
- Access tokens in memory; refresh tokens in secure storage.
- A biometric gate (`expo-local-authentication` → Face ID / Touch ID
  / Android BiometricPrompt) sits in front of the prescription review
  screen, so even an unlocked-and-handed-over phone cannot reveal
  prescription detail.
- Server-side enforcement of session timeout, IP/device pinning, and
  audit logging.

### Real SDK callbacks

A real vendor SDK typically exposes callbacks like
`onSuccess`, `onCancel`, `onTimeout`, `onError`. These map cleanly onto
the existing thunks:

- `onSuccess(payload)` → thunk resolves with payload.
- `onCancel()` → thunk rejects with `GatewayError('USER_CANCELLED')`.
- `onTimeout()` → thunk rejects with `GatewayError('SESSION_EXPIRED')`.
- `onError(err)` → thunk rejects with a code mapped from `err`
  (network failure, SDK init failure, etc.).

Because every error becomes an `ErrorCode`, the rest of the app
(`ErrorView`, the slice, the screens) does not change.

### Preparing for TestFlight / Play Store internal testing

- Build with **EAS Build** (`eas.json` profiles for `development`,
  `preview`, `production`).
- Sign with Apple-managed certs (EAS handles provisioning) and the
  Google Play app signing key.
- Bump `expo.version` (user-facing) and `expo.ios.buildNumber` /
  `expo.android.versionCode` (monotonic) per upload.
- TestFlight internal testing group → smoke test on a real device.
- Play Console internal testing track → same on Android.
- Wire **Sentry** (or equivalent) and configure release tagging so
  crash reports are tied to a specific build.
- Keep release notes terse and free of any PHI.

---

## Assumptions made

- No real authentication, no real NFC, no real prescription SDK.
- Single-user device, no multi-account switching.
- Session state is in-memory only and resets on app reload — production
  would persist a minimal session pointer in secure storage.
- The mock state machine is deterministic per session, but each app
  reload creates a new session.
- The "external authorization" step is a label — no real OAuth flow
  runs.
- Pharmacy identity (`pharmacy_demo_001` / "Mediloon Demo Pharmacy") is
  hardcoded; in production it would be fetched per user.

---

## What would change in production

- **Replace the mock gateway** with a real vendor SDK implementation
  behind `PrescriptionGateway`.
- **Secure storage** for refresh tokens (`expo-secure-store`).
- **Real auth** (OIDC + PKCE), biometric gate before review.
- **Observability**: Sentry with PII scrubbing, analytics with explicit
  consent capture (HIPAA / GDPR), log shipping that respects the same
  `SENSITIVE_KEYS` set used on-device.
- **Network hardening**: certificate pinning on iOS (NSPinnedDomains)
  and Android (Network Security Config) for the vendor and pharmacy
  endpoints.
- **CI/CD**: GitHub Actions → EAS Build → automatic submission to
  internal tracks on every `main` merge.

---

## Known limitations

- No unit tests. With <24 h to deliver this POC the priority was a
  clean architecture and a working end-to-end flow; adding tests is
  the very next step (a `__tests__` folder for `mockGateway`,
  `prescriptionSlice`, `mask`, and `logger` would catch the highest-
  risk regressions).
- Mock state resets on every app reload — there is no persistence
  layer because the goal is to demonstrate flow structure, not
  storage.
- One locale (English) — i18n would slot in via React Native's
  `Intl` / `react-intl` without touching any screen logic.
- No deep-linking or push notifications — both are explicitly out of
  scope for this POC.
