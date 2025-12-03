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

// Create async thunk with proper typing
export const fetchProfile = createAsyncThunk<
  ProfileData,
  void,
  {
    rejectValue: string;
  }
>("profile/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const response = await apiProfile();

    // Handle different response structures
    let profileData: any;

    // If response has a data property, use it
    if (response.data && typeof response.data === "object") {
      profileData = response.data;
    } else {
      // Otherwise, use the response directly
      profileData = response;
    }

    // Handle Mongoose document structure (_doc property)
    if (profileData._doc) {
      profileData = profileData._doc;
    }

    // Convert camelCase to snake_case if needed
    const mappedProfile: ProfileData = {
      email: profileData.email || profileData.Email,
      first_name:
        profileData.first_name ||
        profileData.firstName ||
        profileData.FirstName,
      middle_name:
        profileData.middle_name ||
        profileData.middleName ||
        profileData.MiddleName ||
        "",
      last_name:
        profileData.last_name || profileData.lastName || profileData.LastName,
      gender: profileData.gender || profileData.Gender || profileData.Sex,
      applicant_address:
        profileData.applicant_address ||
        profileData.applicantAddress ||
        profileData.Address2 ||
        "",
      national_id_number:
        profileData.national_id_number ||
        profileData.nationalIdNumber ||
        profileData.NationalIdNumber,
      mobile_no:
        profileData.mobile_no ||
        profileData.mobileNo ||
        profileData.MobilePhoneNo,
      birth_date:
        profileData.birth_date ||
        profileData.birthDate ||
        profileData.DateOfBirth,
      birth_district:
        profileData.birth_district ||
        profileData.birthDistrict ||
        profileData.DistrictOfBirth ||
        "",
      district_of_origin:
        profileData.district_of_origin ||
        profileData.districtOfOrigin ||
        profileData.DistrictOfOrigin ||
        "",
      nationality: profileData.nationality || profileData.Nationality,
      passport_number:
        profileData.passport_number ||
        profileData.passportNumber ||
        profileData.PassportNo ||
        "",
      marital_status:
        profileData.marital_status ||
        profileData.maritalStatus ||
        profileData.MaritalStatus,
      relative_in_organisation:
        profileData.relative_in_organisation !== undefined
          ? profileData.relative_in_organisation
          : profileData.relativeInOrganisation !== undefined
          ? profileData.relativeInOrganisation
          : false,
    };

    return mappedProfile;
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
