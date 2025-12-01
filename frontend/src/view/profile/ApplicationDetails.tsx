import { JSX, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BiodataForm from "@/components/application/BiodataForm";
import AcademicQualifications from "@/components/application/AcademicQualifications";
import Skills from "@/components/application/Skills";
import WorkExperience from "@/components/application/WorkExperience";
import RefereesAndAttachments from "@/components/application/RefereesAndAttachments";
import ConfirmDetails from "@/components/application/ConfirmDetails";
import Certificates from "@/components/application/Certificates";
// import { useAppSelector } from "@/store";

type WizardStep = {
  id: number;
  title: string;
  icon: JSX.Element;
};

const ApplicationDetails = () => {
  const [currentStep, setCurrentStep] = useState(1);
  // const { data: profile } = useAppSelector((state) => state.app.profile);
  // const { applications } = useAppSelector((state) => state.app.application);

  // const existingApplication = applications.find(
  //   (app) =>
  //     app.RecruitmentProjectNo === job.RecrProjNo &&
  //     app.EMail === profile?.email
  // );

  // const hasApplied = existingApplication?.ApplicationSubmitted === true;
  // const hasUnsubmittedApplication =
  //   existingApplication && !existingApplication.ApplicationSubmitted;

  const steps: WizardStep[] = [
    {
      id: 1,
      title: "Biodata",
      icon: (
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Academic",
      icon: (
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0L3 9m9 5v5m0-5l9-5m-9 5l9-5"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Skills",
      icon: (
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Certificates",
      icon: (
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 5,
      title: "Experience",
      icon: (
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
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
      ),
    },
    {
      id: 6,
      title: "References",
      icon: (
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
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
      ),
    },
    {
      id: 7,
      title: "Review",
      icon: (
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
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
      ),
    },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BiodataForm />;
      case 2:
        return <AcademicQualifications />;
      case 3:
        return <Skills />;
      case 4:
        return <Certificates />;
      case 5:
        return <WorkExperience />;
      case 6:
        return <RefereesAndAttachments />;
      case 7:
        return <ConfirmDetails />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-4 sm:py-8 px-2 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-8">
          <div className="flex flex-col gap-4">
            <div className="hidden sm:flex items-center justify-between w-full mb-6">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index < steps.length - 1 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300 ${
                      step.id === currentStep
                        ? "border-[#0D55A3] bg-[#0D55A3] text-white"
                        : step.id < currentStep
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 bg-white text-gray-500"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <svg
                        className="w-4 h-4 sm:w-6 sm:h-6"
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
                    ) : (
                      step.icon
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300 ${
                        step.id < currentStep ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="sm:hidden flex items-center justify-center">
              <span className="text-sm text-gray-500">
                Step {currentStep} of {steps.length}
              </span>
            </div>

            <div className="hidden sm:flex justify-between px-2">
              {steps.map((step) => (
                <div
                  key={`title-${step.id}`}
                  className={`text-center text-xs sm:text-sm font-medium transition-colors duration-300 ${
                    step.id === currentStep
                      ? "text-[#0D55A3]"
                      : step.id < currentStep
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
            {renderStep()}

            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[#0D55A3] border border-[#0D55A3] rounded-lg hover:bg-[#0D55A3]/10 transition-colors duration-200 ${
                  currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentStep === 1}
              >
                Previous
              </button>

              {currentStep < 7 && (
                <button
                  onClick={() =>
                    setCurrentStep((prev) => Math.min(7, prev + 1))
                  }
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-white bg-[#0D55A3] rounded-lg hover:bg-[#0D55A3]/90 focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 transition-all duration-200"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationDetails;
