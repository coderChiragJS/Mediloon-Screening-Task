import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  gateway,
  GatewayError,
  OrderResult,
  PrescriptionSession,
  SessionStatus,
} from '../services/prescriptionGateway';
import { ErrorCode, userMessage } from '../utils/errors';
import { log } from '../utils/logger';

export interface SerializedError {
  code: ErrorCode;
  title: string;
  body: string;
}

export interface PrescriptionState {
  session: PrescriptionSession | null;
  status: SessionStatus;
  isLoading: boolean;
  error: SerializedError | null;
  order: OrderResult | null;
}

const initialState: PrescriptionState = {
  session: null,
  status: 'idle',
  isLoading: false,
  error: null,
  order: null,
};

function toSerializedError(err: unknown): SerializedError {
  const code: ErrorCode =
    err instanceof GatewayError ? err.code : 'SERVICE_UNAVAILABLE';
  const message = userMessage(code);
  return { code, title: message.title, body: message.body };
}

export const startSession = createAsyncThunk<PrescriptionSession>(
  'prescription/startSession',
  async (_, { rejectWithValue }) => {
    try {
      return await gateway.startPrescriptionSession();
    } catch (err) {
      log.warn('startSession failed', { error: String(err) });
      return rejectWithValue(toSerializedError(err));
    }
  },
);

export const pollSessionStatus = createAsyncThunk<
  PrescriptionSession,
  string
>('prescription/pollSessionStatus', async (sessionId, { rejectWithValue }) => {
  try {
    return await gateway.checkSessionStatus(sessionId);
  } catch (err) {
    log.warn('pollSessionStatus failed', { error: String(err) });
    return rejectWithValue(toSerializedError(err));
  }
});

export const completeSession = createAsyncThunk<PrescriptionSession, string>(
  'prescription/completeSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      return await gateway.completeMockPrescriptionSession(sessionId);
    } catch (err) {
      log.warn('completeSession failed', { error: String(err) });
      return rejectWithValue(toSerializedError(err));
    }
  },
);

export const submitOrder = createAsyncThunk<OrderResult, string>(
  'prescription/submitOrder',
  async (sessionId, { rejectWithValue }) => {
    try {
      return await gateway.submitOrder(sessionId);
    } catch (err) {
      log.warn('submitOrder failed', { error: String(err) });
      return rejectWithValue(toSerializedError(err));
    }
  },
);

const slice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    cancelFlow(state) {
      const cancel = userMessage('USER_CANCELLED');
      state.session = null;
      state.status = 'idle';
      state.isLoading = false;
      state.order = null;
      state.error = { code: 'USER_CANCELLED', title: cancel.title, body: cancel.body };
    },
    resetFlow() {
      return initialState;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // startSession
      .addCase(startSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload;
        state.status = action.payload.status;
      })
      .addCase(startSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as SerializedError) ?? toSerializedError(action.error);
        state.status = 'failed';
      })
      // pollSessionStatus
      .addCase(pollSessionStatus.pending, (state) => {
        // intentionally don't toggle isLoading — polling is silent
        state.error = null;
      })
      .addCase(pollSessionStatus.fulfilled, (state, action) => {
        state.session = action.payload;
        state.status = action.payload.status;
      })
      .addCase(pollSessionStatus.rejected, (state, action: PayloadAction<unknown>) => {
        state.error = (action.payload as SerializedError) ?? toSerializedError(action);
        state.status = 'failed';
      })
      // completeSession
      .addCase(completeSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload;
        state.status = action.payload.status;
      })
      .addCase(completeSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as SerializedError) ?? toSerializedError(action.error);
        state.status = 'failed';
      })
      // submitOrder
      .addCase(submitOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
        state.status = 'submitted';
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as SerializedError) ?? toSerializedError(action.error);
        state.status = 'failed';
      });
  },
});

export const { cancelFlow, resetFlow, clearError } = slice.actions;
export default slice.reducer;
