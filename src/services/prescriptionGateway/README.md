# Prescription Gateway

This module is the **integration boundary** between the app and the external
prescription provider. The rest of the app talks only to the
`PrescriptionGateway` interface defined in [`types.ts`](./types.ts).

```
screens / thunks  →  gateway (interface)  →  mockGateway  (today)
                                          ↘  realVendorGateway (later)
```

## Swapping in a real SDK

In production this would be a real vendor SDK — for example, a healthcare
prescription provider that exposes session-based retrieval over HTTPS or via
a native module.

To swap:

1. Add a new file, e.g. `realVendorGateway.ts`, that implements
   `PrescriptionGateway`. Inside, call the vendor SDK and translate its
   success/cancel/timeout/error callbacks into resolved promises or
   `GatewayError` rejections.
2. Change one line in [`index.ts`](./index.ts):
   ```diff
   - export const gateway: PrescriptionGateway = mockGateway;
   + export const gateway: PrescriptionGateway = realVendorGateway;
   ```

No screen, store, or thunk needs to change.

## Why this shape

- **One narrow contract** keeps the vendor blast radius small if the SDK
  is replaced again later.
- **Tagged `GatewayError` codes** map 1:1 to user-facing copy in
  [`utils/errors.ts`](../../utils/errors.ts), so error handling is uniform.
- **Async functions, not callbacks**, because RTK thunks and the rest of
  React work in promises. Vendor callback APIs get wrapped at this layer.
