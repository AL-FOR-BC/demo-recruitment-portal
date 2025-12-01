import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { JobPosition } from "@/@types/app";
import { appServices } from "@/services/AppService";

export interface JobsState {
  items: JobPosition[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  selectedJob: JobPosition | null;
}

const initialState: JobsState = {
  items: [],
  loading: false,
  error: null,
  lastFetched: null,
  selectedJob: null,
};

interface FetchJobsParams {
  companyId: string;
  expand?: string;
  endpoint?: string;
}

// Add a helper function to filter jobs
const filterJobsByUserAccess = (
  jobs: JobPosition[],
  userEmail: string | undefined
) => {
  const excludeJobs = ["Head hunting"];
  const currentJobs = jobs.filter(
    (job) => !excludeJobs.includes(job.RecruitmentMethod || "")
  );
  

  const isInternalUser = userEmail
    ?.toLowerCase()
    .endsWith("@reachoutmbuya.org");

  if (isInternalUser) {
    return currentJobs; // Return all jobs for internal users
  }

  // Filter out internal jobs for external users
  console.log(currentJobs);
  return currentJobs.filter(
    (job) =>
      // job.RecruitmentMethod?.toLowerCase().includes("external") ||
      job.RecruitmentMethod?.toLowerCase().includes("open job advert")
  );
};

// Create async thunk for fetching jobs
export const fetchJobs = createAsyncThunk<
  JobPosition[],
  
  FetchJobsParams & { userEmail?: string; filterQuery?: string },
  { rejectValue: string }
>(
  "jobs/fetchJobs",
  async ({ companyId, endpoint, userEmail, filterQuery }, { rejectWithValue }) => {
    try {
      const response = await appServices.getJobs(
        companyId,
        filterQuery,
        endpoint || "RecruitmentProjectPositions",
      );
      // Filter jobs based on user email
      return filterJobsByUserAccess(response.value, userEmail);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch jobs");
    }
  }
);

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setSelectedJob: (state, action: PayloadAction<JobPosition>) => {
      state.selectedJob = action.payload;
    },
    clearJobs: (state) => {
      state.items = [];
      state.lastFetched = null;
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      });
  },
});

export const { setSelectedJob, clearJobs } = jobSlice.actions;

export default jobSlice.reducer;
