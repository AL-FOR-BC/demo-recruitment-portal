import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { appServices } from "@/services/AppService";
import {
  AcademicQualification,
  ApplicantResponse,
  CreateApplicationParams,
  ProfileData,
  WorkExperience,
  Certificate,
  Referee,
  Skill,
} from "@/@types/app";

// Define the create profile params type
interface CreateProfileParams {
  companyId: string;
  profileData: ProfileData;
}

// Create async thunk for profile creation
export const createProfile = createAsyncThunk<
  ProfileData,
  CreateProfileParams,
  { rejectValue: string }
>(
  "application/createProfile",
  async ({ companyId, profileData }, { rejectWithValue }) => {
    try {
      const response = await appServices.createProflieInBC(
        companyId,
        undefined,
        "RecruitmentApplicants",
        profileData
      );
      // Make sure we return the correct type
      if (!response.value || typeof response.value !== "object") {
        return rejectWithValue("Invalid response format");
      }
      // Transform the response to match ProfileData type
      return response.value as any;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create profile");
    }
  }
);

// Update the createApplication thunk to use the correct response type
export const createApplication = createAsyncThunk<
  ApplicantResponse,
  CreateApplicationParams,
  { rejectValue: string }
>(
  "application/createApplication",
  async ({ companyId, applicationData }, { rejectWithValue }) => {
    try {
      const response = await appServices.createProflieInBC(
        companyId,
        undefined,
        "Applicants",
        applicationData
      );
      // The response is nested under data property
      return response.value.data as ApplicantResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create application");
    }
  }
);

export const getApplications = createAsyncThunk<
  ApplicantResponse[],
  { companyId: string },
  { rejectValue: string }
>("application/getApplications", async ({ companyId }, { rejectWithValue }) => {
  try {
    const response = await appServices.getApplicant(
      companyId,
      undefined,
      "Applicants"
    );
    return response as ApplicantResponse[];
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch applications");
  }
});

export const getAcademicQualifications = createAsyncThunk<
  AcademicQualification[],
  { companyId: string; filterQuery?: string },
  { rejectValue: string }
>(
  "application/getAcademicQualifications",
  async ({ companyId, filterQuery }, { rejectWithValue }) => {
    try {
      const response = await appServices.getAcademicQualification(
        companyId,
        filterQuery
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch academic qualifications"
      );
    }
  }
);

// Add new thunk for work experience
export const getWorkExperience = createAsyncThunk<
  WorkExperience[],
  { companyId: string; filterQuery?: string },
  { rejectValue: string }
>(
  "application/getWorkExperience",
  async ({ companyId, filterQuery }, { rejectWithValue }) => {
    try {
      const response = await appServices.getApplicantWorkExperience(
        companyId,
        filterQuery
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch work experience"
      );
    }
  }
);

// Keep only one interface for references
export interface Reference {
  systemId?: string;
  applicantNo: string;
  referenceName: string;
  position: string;
  organization: string;
  eMail: string;
  telephoneNo: string;
  relationship: string;
}

// Remove the Referee interface and keep only one thunk for references
export const getReferences = createAsyncThunk(
  "application/getReferences",
  async ({
    companyId,
    filterQuery,
  }: {
    companyId: string;
    filterQuery?: string;
  }) => {
    try {
      const response = await appServices.getApplicantReferences(
        companyId,
        filterQuery
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Add certificates thunk
export const getCertificates = createAsyncThunk(
  "application/getCertificates",
  async ({
    companyId,
    filterQuery,
  }: {
    companyId: string;
    filterQuery: string;
  }) => {
    try {
      const response = await appServices.getApplicantCertifications(
        companyId,
        filterQuery
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Add these thunks
export const getSkills = createAsyncThunk(
  "application/getSkills",
  async (
    { companyId, filterQuery }: { companyId: string; filterQuery: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await appServices.getSkillsAndCertifications(
        companyId,
        filterQuery
      );
      // Transform the response to match the Skill type
      return response.map((skill: any) => ({
        skillId: skill.typeCode || "",
        skillName: skill.description || "",
        skillLevel: skill.skillLevel || "",
        systemId: skill.systemId || "",
        description: skill.description || "",
        type: skill.type || "Skill",
        typeCode: skill.typeCode || "",
        applicantNo: skill.applicantNo || null,
        trainer: skill.trainer || "",
        status: skill.status || "Actual",
      }));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Update ApplicationState to use only references
export interface ApplicationState {
  biodata: any;
  academicQualifications: AcademicQualification[];
  skills: Skill[];
  workExperience: WorkExperience[];
  attachments: any[];
  loading: boolean;
  error: string | null;
  createdProfile: ProfileData | null;
  createdApplication: ApplicantResponse | null;
  applications: ApplicantResponse[];
  lastFetched: string | null;
  applicationNo: string | null;
  workExperienceLastFetched: string | null;
  references: Reference[];
  referencesLastFetched: string | null;
  certificates: Certificate[];
  skillsLastFetched: string | null;
  referees: Referee[];
}

const initialState: ApplicationState = {
  biodata: {},
  academicQualifications: [],
  skills: [],
  workExperience: [],
  attachments: [],
  loading: false,
  error: null,
  createdProfile: null,
  createdApplication: null,
  applications: [],
  lastFetched: null,
  applicationNo: null,
  workExperienceLastFetched: null,
  references: [],
  referencesLastFetched: null,
  certificates: [],
  skillsLastFetched: null,
  referees: [],
};

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setApplicationNo: (state, action: PayloadAction<string>) => {
      state.applicationNo = action.payload;
    },
    setBiodata: (state, action: PayloadAction<any>) => {
      state.biodata = action.payload;
    },
    setAcademicQualifications: (
      state,
      action: PayloadAction<AcademicQualification[]>
    ) => {
      state.academicQualifications = action.payload;
    },
    setSkills: (state, action: PayloadAction<Skill[]>) => {
      state.skills = action.payload;
    },
    setWorkExperience: (state, action: PayloadAction<WorkExperience[]>) => {
      state.workExperience = action.payload;
      state.workExperienceLastFetched = new Date().toISOString();
    },
    setAttachments: (state, action: PayloadAction<any[]>) => {
      state.attachments = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetApplication: (state) => {
      Object.assign(state, initialState);
    },
    setReferences: (state, action: PayloadAction<Reference[]>) => {
      state.references = action.payload;
    },
    setCertificates: (state, action: PayloadAction<Certificate[]>) => {
      state.certificates = action.payload;
    },
    deleteAcademicQualification: (state, action: PayloadAction<string>) => {
      state.academicQualifications = state.academicQualifications.filter(
        (qual) => qual.systemId !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.createdProfile = action.payload;
      })
      .addCase(createProfile.rejected, (state) => {
        state.loading = false;
        // state.error = action.payload || "An error occurred";
        state.createdProfile = null;
      })
      .addCase(createApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.createdApplication = action.payload;
        state.applications = [...state.applications, action.payload];
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
        state.createdApplication = null;
      })
      .addCase(getApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.applications = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch applications";
      })
      .addCase(getAcademicQualifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAcademicQualifications.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.academicQualifications = action.payload;
      })
      .addCase(getAcademicQualifications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch academic qualifications";
      })
      .addCase(getWorkExperience.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.workExperience = action.payload;
        state.workExperienceLastFetched = new Date().toISOString();
      })
      .addCase(getWorkExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch work experience";
      })
      .addCase(getReferences.fulfilled, (state, action) => {
        state.references = action.payload;
      })
      .addCase(getCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload;
      })
      .addCase(getCertificates.rejected, (state) => {
        state.loading = false;
        // state.error = action.payload || "Failed to fetch certificates";
      })
      .addCase(getSkills.fulfilled, (state, action) => {
        state.skills = action.payload;
        state.skillsLastFetched = new Date().toISOString();
        state.loading = false;
      });
  },
});

export const {
  setBiodata,
  setAcademicQualifications,
  setSkills,
  setWorkExperience,
  setReferences,
  setAttachments,
  setLoading,
  setError,
  setApplicationNo,
  resetApplication,
  setCertificates,
  deleteAcademicQualification,
} = applicationSlice.actions;

export default applicationSlice.reducer;
