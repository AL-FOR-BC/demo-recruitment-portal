import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProfileData } from "@/@types/app";
import { apiProfile } from "@/services/ProfileService";

export interface ProfileState {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

// Define the API response type
interface ApiResponse {
  data: ProfileData;
}

// Create async thunk with proper typing
export const fetchProfile = createAsyncThunk<
  ProfileData,
  void,
  {
    rejectValue: string;
  }
>("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = (await apiProfile()) as ApiResponse;
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch profile"
    );
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setProfileError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<ProfileData>>) => {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        state.data = null;
      });
  },
});

export const {
  setProfileLoading,
  setProfileData,
  setProfileError,
  clearProfile,
  updateProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
