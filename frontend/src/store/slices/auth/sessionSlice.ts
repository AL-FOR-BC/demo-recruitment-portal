import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SLICE_BASE_NAME } from "./constants";

export interface SessionState {
  signedIn: boolean;
  signature: string | null;
  appToken?: string | null;
  verified: boolean;
  companyId?: string | null;
}

const initialState: SessionState = {
  signedIn: false,
  signature: null,
  appToken: null,
  verified: false,
  companyId: null,
};

const sessionSlice = createSlice({
  name: `${SLICE_BASE_NAME}/session`,
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<SessionState>) {
      state.signedIn = true;
      state.signature = action.payload.signature;
      state.verified = action.payload.verified;
      state.appToken = action.payload.appToken;
      state.companyId = action.payload.companyId;
    },
    bcTokenSuccess(state, action: PayloadAction<string>) {
      state.appToken = action.payload;
    },
    verificationRequired(state, action: PayloadAction<string>) {
      state.signedIn = false;
      state.signature = action.payload;
    },
    signOutSuccess(state) {
      state.signedIn = false;
      state.signature = null;
      state.verified = false;
      state.appToken = null;
      state.companyId = null;
    },
  },
});

export const {
  signInSuccess,
  signOutSuccess,
  bcTokenSuccess,
  verificationRequired,
} = sessionSlice.actions;
export default sessionSlice.reducer;
