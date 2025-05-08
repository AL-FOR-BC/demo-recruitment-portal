import { useAppSelector } from "@/store";
import Swal from "sweetalert2";
import { appServices } from "@/services/AppService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const ConfirmDetails = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { applicationNo } = useAppSelector((state) => state.app.application);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Submit Application?",
      text: "Please confirm that you want to submit your application. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0D55A3",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        setIsSubmitting(true);
        if (!companyId || !applicationNo) {
          throw new Error("Company ID or application number is not available");
        }
        const response = await appServices.submitApplication(
          companyId,
          applicationNo
        );

        if (response.status === 204) {
          // onSubmit();
          await Swal.fire({
            title: "Application Submitted!",
            text: "Your application has been submitted successfully.",
            icon: "success",
            confirmButtonColor: "#0D55A3",
          });
          navigate("/applications");
        }
      } catch (error) {
        await Swal.fire({
          title: "Error",
          text: "There was an error submitting your application. Please try again.",
          icon: "error",
          confirmButtonColor: "#0D55A3",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 px-4 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Application Review
        </h2>
        <p className="mt-2 text-gray-600">
          Please review your application details before submitting
        </p>
      </div>

      {/* <div className="grid gap-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="flex items-center p-4 bg-white rounded-lg border shadow-sm"
          >
            <div
              className={`flex-shrink-0 w-8 h-8 mr-4 ${
                section.isComplete ? "text-green-500" : "text-gray-300"
              }`}
            >
              <CheckCircleIcon />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900">{section.title}</h3>
              <p className="text-sm text-gray-500">
                {section.count} {section.count === 1 ? "entry" : "entries"}{" "}
                added
              </p>
            </div>
          </div>
        ))}
      </div> */}

      <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
        <input
          type="checkbox"
          id="confirm"
          required
          className="w-5 h-5 mt-0.5 text-[#0D55A3] border-gray-300 rounded focus:ring-[#0D55A3]"
        />
        <label htmlFor="confirm" className="text-sm text-gray-700">
          I confirm that all the information provided is accurate and complete.
          I understand that providing false information may result in the
          rejection of my application.
        </label>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-medium bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Submitting...</span>
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDetails;
