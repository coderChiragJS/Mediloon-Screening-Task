# Screenshots

Capture the screens below from the iOS simulator (or any device running the app)
and drop the PNGs in this folder using the exact filenames listed. The root
README already links to them, so they will render once added.

## Capture checklist

| Filename | Screen | What to show |
|---|---|---|
| `01-start.png` | Start | Logo, "Request a prescription", how-it-works card, trust badge, CTA |
| `02-status-progress.png` | Session status | Vertical progress with one step active (e.g. "Waiting for external authorization") |
| `03-review.png` | Prescription review | Masked reference, medication, patient ref, pharmacy, demo banner, Submit CTA |
| `04-confirmation.png` | Order confirmation | Success check, order ref, "What happens next" steps |

## How to capture (iOS simulator)

1. `npx expo start` then press `i` to open in iOS simulator.
2. Walk through the flow.
3. `Cmd + S` in the simulator saves a PNG to the Desktop.
4. Rename and move to this folder.

## How to capture (real device via Expo Go)

1. `npx expo start`, scan the QR code.
2. Use the device's standard screenshot gesture.
3. AirDrop / transfer the PNGs and rename per the table above.

## Tip for the error screenshot

The simplest live error to capture is `USER_CANCELLED`: on the Session
status screen, tap **Cancel** — the slice flips `status` to `'failed'`
with code `USER_CANCELLED`, and `ErrorView` renders the user-friendly
"Request cancelled" card.

All other error codes (`SERVICE_UNAVAILABLE`, `SESSION_EXPIRED`,
`NETWORK_FAILED`, `PRESCRIPTION_MISSING`, `SDK_UNAVAILABLE`) are
implemented in [src/utils/errors.ts](../../src/utils/errors.ts) and
rendered by the same [ErrorView](../../src/components/ErrorView.tsx) —
they trigger automatically if the corresponding `GatewayError` is
thrown by a real backend. Walk the interviewer through the code if
they ask to see the others.
