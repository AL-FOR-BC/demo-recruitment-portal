const JobCard = ({ job }: { job: JobPosition }) => (
    <div className="bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#0D55A3]/30">
      {/* Card Header - Company Info */}
      <div className="p-5 border-b border-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="h-16 w-16 rounded-lg bg-gray-50 p-2 border border-gray-100 flex items-center justify-center">
              <CompanyLogoA />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0D55A3] transition-colors">
                {job.PositionDescription}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{job.RecrProjNo}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span className="text-sm text-gray-500">Remote</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium 
                ${
                  job.ContractType === "CONTRACT"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : job.ContractType === "PROBATION"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-purple-50 text-purple-700 border border-purple-200"
                }`}
            >
              {job.ContractType}
            </span>
            <span className="text-sm font-medium text-[#0D55A3]">
              {job.QuantityRequested} Position
              {job.QuantityRequested > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
  
      {/* Card Body - Skills & Details */}
      <div className="p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0D55A3]/5 text-[#0D55A3] border border-[#0D55A3]/10">
            {job.RecruitmentMethod}
          </span>
          {job.MinYearsExperience > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#0D55A3]/5 text-[] border border-[#0D55A3]/10">
              {job.MinYearsExperience}+ Years Experience
            </span>
          )}
        </div>
  
        <p className="text-sm text-gray-600 line-clamp-2">
          {job.positionSummary || "No description provided"}
        </p>
  
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-gray-400"
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
              <span className="text-sm text-gray-600">
                Deadline:{" "}
                {new Date(job.applicationSubmissionDeadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
  
        {/* New Actions Section */}
        <div className="flex items-center gap-3 pt-3">
          <button
            onClick={() => (window.location.href = `/job/${job.SystemId}`)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0D55A3] bg-[#0D55A3]/5 rounded-lg hover:bg-[#0D55A3]/10 transition-colors"
          >
            View Details
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#0D55A3] rounded-lg hover:bg-[#0D55A3]/90 transition-colors">
            Apply Now
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
  