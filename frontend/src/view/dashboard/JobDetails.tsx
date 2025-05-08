import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";
import { appServices } from "@/services/AppService";
import type { JobPosition as IJobPosition } from "@/@types/app"; // Rename to avoid conflict
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "react-toastify";


// Local interfaces
interface PositionDescription {
  systemId: string;
  positionNo: string;
  type: string;
  subType: string;
  description: string;
}

interface PositionCertificate {
  SystemId: string;
  certificate: string;
  description: string;
  Importance: string;
  positionNo: string;
}

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [job, setJob] = useState<IJobPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const { companyId } = useAppSelector((state) => state.auth.session);
  // const profile = useAppSelector((state) => state.app.profile.data);
  const [certificates, setCertificates] = useState<PositionCertificate[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<PositionDescription[]>(
    []
  );

  // Use the hook with autoFetch set to false


  // Add this component inside JobDetails
  const JobDescriptionSections = ({
    descriptions,
  }: {
    descriptions: PositionDescription[];
  }) => {
    console.log("JobDescriptionSections received descriptions:", descriptions);

    if (!descriptions || descriptions.length === 0) {
      return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-center">
            No job description available
          </p>
        </div>
      );
    }

    // Sort descriptions by type number
    const sortedDescriptions = [...descriptions].sort((a, b) => {
      const aNum = parseInt(a.type.split(".")[0]);
      const bNum = parseInt(b.type.split(".")[0]);
      return aNum - bNum;
    });

    console.log("Sorted descriptions:", sortedDescriptions);

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-8">
        <div className="space-y-8">
          {sortedDescriptions.map((section) => (
            <div key={section.systemId} className="space-y-4">
              <h3 className="text-lg font-semibold text-[#0D55A3]">
                {section.type}
              </h3>
              <div className="pl-4">
                {section.description.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="text-gray-600 mb-3">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // // Add this to your existing JobDetails component
  // const JobSummarySection = ({
  //   description,
  // }: {
  //   description: PositionDescription;
  // }) => {
  //   return (
  //     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
  //       <div className="flex items-center gap-3">
  //         <div className="p-2 rounded-lg bg-[#0D55A3]/5">
  //           <svg
  //             className="w-5 h-5 text-[#0D55A3]"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth={2}
  //               d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  //             />
  //           </svg>
  //         </div>
  //         <h2 className="text-xl font-semibold text-gray-900">
  //           {description.type}
  //         </h2>
  //       </div>

  //       <div className="pl-10">
  //         {description.description.split("\n").map((line, index) => (
  //           <div
  //             key={index}
  //             className="flex items-start gap-2 text-gray-600 mb-2"
  //           >
  //             <span className="mt-2 h-1 w-1 rounded-full bg-gray-400 flex-shrink-0" />
  //             <p className="text-base">{line}</p>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  const fetchData = async () => {
    try {
      if (!companyId || !jobId) {
        throw new Error("Missing required parameters");
      }

      setLoading(true);

      const jobData = await appServices.getJobDetails(
        companyId,
        jobId,
        "RecruitmentProjectPositions"
      );

      if (!jobData) {
        throw new Error("Job not found");
      }

      setJob(jobData);

      // Fetch descriptions
      const descriptionResponse = await appServices.getPostionDescription(
        companyId,
        "positionDescription",
        `$filter=positionNo eq '${jobData.PositionCode}'`
      );

      console.log("Raw description response:", descriptionResponse);

      // Check if descriptionResponse is an array directly
      if (Array.isArray(descriptionResponse)) {
        console.log(
          "Setting job descriptions with array:",
          descriptionResponse
        );
        setJobDescriptions(descriptionResponse);
      }
      // Check if it's wrapped in a value property
      else if (
        descriptionResponse?.value &&
        Array.isArray(descriptionResponse.value)
      ) {
        console.log(
          "Setting job descriptions with response.value:",
          descriptionResponse.value
        );
        setJobDescriptions(descriptionResponse.value);
      } else {
        console.warn(
          "Unexpected description response format:",
          descriptionResponse
        );
      }

      // Fetch certificates
      const certResponse = await appServices.getPostionCertification(
        companyId,
        "positionCertificates",
        `$filter=positionNo eq '${jobData.PositionCode}'`
      );

      if (certResponse?.value) {
        setCertificates(certResponse.value);
      }
    } catch (error: any) {
      console.error("Error in fetchData:", error);
      toast.error(error.message || "Failed to fetch job details");
    } finally {
      setLoading(false);
    }
  };

  // Add this debug effect
  useEffect(() => {
    console.log("Job data:", job?.PositionCode);
    if (job?.PositionCode) {
      console.log(`Fetching descriptions for position: ${job.PositionCode}`);
    }
  }, [job]);

  // Add an effect to monitor jobDescriptions changes
  useEffect(() => {
    console.log("Job Descriptions Updated:", jobDescriptions);
  }, [jobDescriptions]);

  // Add this near your other useEffects
  useEffect(() => {
    console.log("jobDescriptions state changed:", jobDescriptions);
  }, [jobDescriptions]);

  useEffect(() => {
    fetchData();
  }, [companyId, jobId]);



  // Add this new component for the certificates section
  const CertificatesSection = ({
    certificates,
  }: {
    certificates: PositionCertificate[];
  }) => {
    console.log("CertificatesSection received:", certificates);

    if (!certificates.length) {
      console.log("No certificates to display");
      return null;
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Required Certifications
        </h2>
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert.SystemId} className="flex items-start gap-3">
              <div className="mt-1">
                <svg
                  className="w-5 h-5 text-[#0D55A3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">
                    {cert.certificate}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium 
                    ${
                      cert.Importance === "Mandatory"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {cert.Importance}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">{cert.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D55A3]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center text-gray-500">Job not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4">
        {/* Navigation and Status Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#0D55A3] hover:text-[#0D55A3]/80 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm font-medium">Back to Jobs</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">
                {job.PositionDescription}
              </h1>
              {job.positionSummary && (
                <p className="mt-2 text-gray-600">{job.positionSummary}</p>
              )}
            </div>

            {/* Debug output */}
            <div className="text-sm text-gray-500">
              Number of descriptions: {jobDescriptions.length}
            </div>

            {/* Job Description Sections */}
            {Array.isArray(jobDescriptions) && jobDescriptions.length > 0 ? (
              <JobDescriptionSections descriptions={jobDescriptions} />
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <p className="text-gray-500 text-center">
                  {loading
                    ? "Loading job descriptions..."
                    : "No job description available"}
                </p>
              </div>
            )}

            {/* Certificates Section */}
            {certificates.length > 0 && (
              <CertificatesSection certificates={certificates} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Basic Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Job Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg
                      className="w-5 h-5 text-[#0D55A3]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Experience Level
                    </h3>
                    <p className="text-gray-600">
                      Minimum {job.MinYearsExperience} years of relevant
                      experience
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg
                      className="w-5 h-5 text-[#0D55A3]"
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
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Employment Type
                    </h3>
                    <p className="text-gray-600">{job.ContractType}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg
                      className="w-5 h-5 text-[#0D55A3]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Application Deadline
                    </h3>
                    <p className="text-gray-600">
                      {new Date(
                        job.applicationSubmissionDeadline
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <svg
                      className="w-5 h-5 text-[#0D55A3]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Positions Available
                    </h3>
                    <p className="text-gray-600">
                      {job.QuantityRequested} openings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Actions */}
            {/* <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <button
                onClick={() => {
                  if (
                    hasUnsubmittedApplication &&
                    existingApplication?.SystemId
                  ) {
                    navigate(
                      `/applicate-details/${existingApplication.SystemId}`
                    ); 
                  } else {
                    navigate(`/apply/${job.SystemId}`);
                  }
                }}
                disabled={hasApplied}
                className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium
                  ${
                    hasApplied
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : hasUnsubmittedApplication
                      ? "bg-[#0D55A3]/90 hover:bg-[#0D55A3] text-white"
                      : "bg-[#0D55A3] hover:bg-[#0D55A3]/90 text-white"
                  }`}
              >
                {hasApplied
                  ? "Application Submitted"
                  : hasUnsubmittedApplication
                  ? "Continue Application"
                  : "Apply for this Position"}
              </button>
            </div> */}

            {/* Share Job Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Share Job
              </h3>
              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 bg-[#0D55A3]/5 text-[#0D55A3] rounded-lg hover:bg-[#0D55A3]/10 transition-colors">
                  LinkedIn
                </button>
                <button className="flex-1 py-2 px-4 bg-[#0D55A3]/5 text-[#0D55A3] rounded-lg hover:bg-[#0D55A3]/10 transition-colors">
                  Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetails;
