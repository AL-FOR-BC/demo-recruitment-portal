import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { settingsService } from "@/services/SettingsService";

export interface SettingsState {
  companyLogo: string | null;
  themeColor: string;
  companyName: string | null;
  help: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  companyLogo: null,
  themeColor: "#094BAC", // Default theme color
  companyName: "ROM", // Default company name
  help: null,
  loading: false,
  error: null,
};

// Fetch settings from API
export const fetchSettings = createAsyncThunk<
  {
    companyLogo: string | null;
    themeColor: string;
    companyName: string | null;
    help: string | null;
  },
  string | undefined,
  { rejectValue: string }
>("settings/fetchSettings", async (settingsId, { rejectWithValue }) => {
  try {
    const axiosResponse = await settingsService.getSettings(settingsId);
    // ApiService returns AxiosResponse, so we need to access .data
    const response = axiosResponse.data;
    if (response && response.success && response.data) {
      return {
        companyLogo: response.data.companyLogo || null,
        themeColor: response.data.themeColor || "#094BAC",
        // Preserve the companyName value from API, use null if not provided
        companyName: response.data.companyName ?? null,
        help: response.data.help || null,
      };
    }
    return rejectWithValue("Invalid settings response");
  } catch (error: any) {
    console.error("Settings fetch error:", error);
    // Don't crash - just return defaults
    return rejectWithValue(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch settings"
    );
  }
});

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (
      state,
      action: PayloadAction<{
        companyLogo: string | null;
        themeColor: string;
        companyName: string | null;
        help: string | null;
      }>
    ) => {
      state.companyLogo = action.payload.companyLogo;
      state.themeColor = action.payload.themeColor;
      state.companyName = action.payload.companyName || "ROM";
      state.help = action.payload.help;
      state.loading = false;
      state.error = null;
    },
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.themeColor = action.payload;
    },
    setCompanyLogo: (state, action: PayloadAction<string | null>) => {
      state.companyLogo = action.payload;
    },
    clearSettings: (state) => {
      state.companyLogo = null;
      state.themeColor = "#094BAC";
      state.companyName = "ROM";
      state.help = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.companyLogo = action.payload.companyLogo;
        state.themeColor = action.payload.themeColor;
        // Only use fallback if companyName is null or undefined, not if it's an empty string
        state.companyName = action.payload.companyName ?? "ROM";
        state.help = action.payload.help;
        state.error = null;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch settings";
        // Keep default values on error
        state.themeColor = "#094BAC";
        state.companyLogo = null;
        state.companyName = "ROM"; // Ensure companyName is set on error
      });
  },
});

export const { setSettings, setThemeColor, setCompanyLogo, clearSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
