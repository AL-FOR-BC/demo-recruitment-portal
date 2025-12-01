import { useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/store";
import { JobPosition } from "@/@types/app";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchJobs } from "@/store/slices/app/jobSlice";
import { fetchProfile } from "@/store/slices/app/profileSlice";
import { PageSpinner } from "@/components/common/Spinner";
import {
  createApplication,
  getApplications,
  setApplicationNo,
} from "@/store/slices/app/applicationSlice";
import useAuth from "@/utils/hooks/useAuth";
import { useCompanyName } from "@/utils/hooks/useCompanyName";

// API Response Types

// First, let's create a component that maps job titles to appropriate icons
const PositionIcon = ({ title }: { title: string }) => {
  // Helper function to determine icon based on job title keywords
  const getIconForPosition = (title: string) => {
    const lowerTitle = title.toLowerCase();

    if (
      lowerTitle.includes("developer") ||
      lowerTitle.includes("engineer") ||
      lowerTitle.includes("programming")
    ) {
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      );
    }

    if (
      lowerTitle.includes("manager") ||
      lowerTitle.includes("director") ||
      lowerTitle.includes("lead")
    ) {
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      );
    }

    if (
      lowerTitle.includes("designer") ||
      lowerTitle.includes("ui") ||
      lowerTitle.includes("ux")
    ) {
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
        />
      );
    }

    if (lowerTitle.includes("marketing") || lowerTitle.includes("sales")) {
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
      );
    }

    // Default icon for other positions
    return (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    );
  };

  return (
    <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-[#0D55A3]/5 text-[#0D55A3] group-hover:bg-[#0D55A3]/10 transition-colors">
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {getIconForPosition(title)}
      </svg>
    </div>
  );
};

const JobCard = ({ job }: { job: JobPosition }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.app.profile.data);
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { applications, loading: applicationLoading } = useAppSelector(
    (state) => state.app.application
  );

  useEffect(() => {
    if (companyId) {
      console.log("runinig");
      console.log(companyId);
      dispatch(getApplications({ companyId }));
    }
  }, [companyId, dispatch]);

  // Filter applications on the frontend
  const existingApplication = applications.find(
    (app) =>
      app.RecruitmentProjectNo === job.RecrProjNo &&
      app.EMail === profile?.email
  );

  const hasApplied = existingApplication?.ApplicationSubmitted === true;
  const hasUnsubmittedApplication =
    existingApplication && !existingApplication.ApplicationSubmitted;

  const handleApplyNow = async () => {
    try {
       
      if (!profile) {
        toast.error("Please complete your profile first");
        navigate("/profile");
        return;
      }

      if (!companyId) {
        toast.error("Company ID is required");
        return;
      }

      if (hasUnsubmittedApplication) {
        if (existingApplication?.SystemId) {
          dispatch(setApplicationNo(existingApplication.ApplicantNo));
          navigate(`/applicate-details/${existingApplication.SystemId}`);
        }
        return;
      }

      const applicationData = {
        FirstName: profile.first_name,
        MiddleName: profile.middle_name,
        LastName: profile.last_name,
        Address2: profile.applicant_address,
        DateOfBirth: profile.birth_date,
        DesiredPosition: job.PositionCode,
        RecruitmentProjectNo: job.RecrProjNo,
        DistrictOfBirth: profile.birth_district,
        DistrictOfOrigin: profile.district_of_origin,
        EMail: profile.email,
        MaritalStatus: profile.marital_status,
        MobilePhoneNo: profile.mobile_no,
        NationalIdNumber: profile.national_id_number,
        Nationality: profile.nationality,
        PassportNo: profile.passport_number || "",
        Sex: profile.gender,
      };

      const result = await dispatch(
        createApplication({
          companyId,
          applicationData,
        })
      ).unwrap();

      if (result?.SystemId) {
        toast.success("Application submitted successfully");
        dispatch(setApplicationNo(result.ApplicantNo));
        navigate(`/applicate-details/${result.SystemId}`);
      } else {
        throw new Error("No system ID returned from application creation");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to submit application");
      console.error("Application submission error:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden group hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.25)] transition-all duration-300 border border-gray-100 shadow-[0_3px_10px_-2px_rgba(0,0,0,0.15)]">
      <div className="p-3 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          {/* Icon and Title */}
          <div className="flex gap-3 sm:gap-4">
            <PositionIcon title={job.PositionDescription} />
            <div className="space-y-1 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-[#0D55A3] transition-colors line-clamp-2">
                {job.PositionDescription}
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{job.RecrProjNo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Remote</span>
                </div>
              </div>
            </div>
          </div>

          {/* Badges - Stack on mobile */}
          <div className="flex flex-wrap sm:flex-col items-start gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium 
                ${
                  job.ContractType === "CONTRACT"
                    ? "bg-emerald-50 text-emerald-700"
                    : job.ContractType === "PROBATION"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-purple-50 text-purple-700"
                }`}
            >
              {job.ContractType}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-[#0D55A3]">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.QuantityRequested} Position
              {job.QuantityRequested > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Tags and Description */}
        <div className="mt-3 sm:mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium 
                ${
                  job.RecruitmentMethod?.toLowerCase() === "internal"
                    ? "bg-purple-50 text-purple-700"
                    : "bg-green-50 text-green-700"
                }`}
            >
              {job.RecruitmentMethod} Position
            </span>
            {job.MinYearsExperience > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0D55A3]/5 text-[#0D55A3]">
                {job.MinYearsExperience}+ Years Experience
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {job.positionSummary || "No description provided"}
          </p>

          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 pt-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Application Deadline:{" "}
              {new Date(job.applicationSubmissionDeadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Actions Section - Stack buttons on mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 sm:mt-5">
          <button
            onClick={() => navigate(`/job-details/${job.SystemId}`)}
            className="px-4 py-2 text-sm font-medium text-[#0D55A3] bg-white border border-[#0D55A3]/20 rounded-md hover:bg-[#0D55A3]/5 transition-colors w-full sm:w-auto"
          >
            View Details
          </button>
          <button
            onClick={handleApplyNow }
            disabled={applicationLoading}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md transition-all
              ${
                hasApplied
                  ? "bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed"
                  : hasUnsubmittedApplication
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-[#0D55A3] hover:bg-[#0D55A3]/90 text-white"
              }`}
          >
            {hasApplied ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Submitted
              </>
            ) : hasUnsubmittedApplication ? (
              <>
                Continue
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                Apply Now
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { user } = useAppSelector((state) => state.auth);
  const { signOut } = useAuth();
  const {
    items: jobs,
    loading: jobsLoading,
    error: jobsError,
  } = useAppSelector((state) => state.app.job);
  const { loading: profileLoading, error: profileError } = useAppSelector(
    (state) => state.app.profile
  );
  const navigate = useNavigate();
  const companyName = useCompanyName();

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) {
        signOut();
        return;
      }

      try {
        const profileResult = await dispatch(fetchProfile()).unwrap();

        if (!profileResult) {
          navigate("/profile");
          return;
        }

        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0];
        await dispatch(
          fetchJobs({
            companyId,
            endpoint: "RecruitmentProjectPositions",
            userEmail: user?.email,
            filterQuery: `$filter=applicationSubmissionDeadline gt ${formattedDate}`,
          })
        );
      } catch (error: any) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [companyId, dispatch, navigate, user?.email]);

  // Add a message to show job visibility status
  const isInternalUser = user?.email
    ?.toLowerCase()
    .endsWith("@reachoutmbuya.org");

  const loading = jobsLoading || profileLoading;
  const error = jobsError || profileError;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <PageSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    console.log(error);
    if (error.toString().includes("Failed to fetch profile")) {
      return (
        <DashboardLayout>
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome to {companyName} Recruitment
              </h2>
              <p className="text-gray-600 max-w-md">
                To start applying for jobs, please create your profile first
              </p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 transition-colors font-medium flex items-center gap-2 shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your Profile
            </button>
          </div>
        </DashboardLayout>
      );
    }
    return (
      <DashboardLayout>
        <div className="text-red-500">Error loading data: {error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header Section - Improve mobile layout */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Find Your Dream Job
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {jobs.length} jobs available
              {isInternalUser
                ? " (Viewing all internal and external positions)"
                : " (Viewing external positions only)"}
            </p>
          </div>
        </div>

        {/* Job Listings Grid - Improve responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 p-1 sm:p-2">
          {jobs.map((job) => (
            <JobCard key={job.SystemId} job={job} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
