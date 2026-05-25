# Screenshots

Capture the screens below from the iOS simulator (or any device running the app)
and drop the PNGs in this folder using the exact filenames listed. The root
README already links to them, so they will render once added.

## Capture checklist

| Filename | Screen | What to show |
|---|---|---|
| `01-start.png` | Start | Logo, "Request a prescription", how-it-works card, trust badge, CTA |
| `02-status-progress.png` | Session status | Vertical progress with one step active (e.g. "Waiting for external authorization") |
| `03-status-complete.png` | Session status | All four steps complete, just before auto-advance |
| `04-review.png` | Prescription review | Masked reference, medication, patient ref, pharmacy, demo banner, Submit CTA |
| `05-confirmation.png` | Order confirmation | Success check, order ref, "What happens next" steps |
| `06-error.png` | Any | An error state (trigger via long-press the Mediloon logo on Start → arm a fault) |

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

On the Start screen, long-press the Mediloon "M" logo (700ms). A developer
sheet opens with buttons for each error code. Tap one, then press
"Start Prescription Flow" — the matching error screen renders.
