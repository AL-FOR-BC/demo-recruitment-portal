import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import { appServices } from "@/services/AppService";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getWorkExperience,
} from "@/store/slices/app/applicationSlice";
// import { appServices } from "../../services/appServices";

interface WorkExperience {
  systemId?: string;
  applicantNo: string;
  type: string;
  typeCode: string;
  experienceFrom: string;
  experienceTo: string;
  experienceOrganization: string;
  experiencePosition: string;
  experienceDuties: string;
}



const WorkExperience = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [editingExperience, setEditingExperience] =
    useState<WorkExperience | null>(null);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    applicantNo: "",
    type: "Experience",
    typeCode: "EXPERIENCE",
    experienceFrom: "",
    experienceTo: "",
    experienceOrganization: "",
    experiencePosition: "",
    experienceDuties: "",
  });
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { applicationNo } = useAppSelector((state) => state.app.application);
  const { workExperience } = useAppSelector(
    (state) => state.app.application
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkExperience = async () => {
      try {
        setIsLoading(true);
        if (companyId && applicationNo) {
          await dispatch(
            getWorkExperience({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching work experience:", error);
        toast.error("Failed to load work experience");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkExperience();
  }, [companyId, applicationNo]);

  const handleChange = (field: keyof WorkExperience, value: any) => {
    setCurrentExperience((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (experience: WorkExperience) => {
    if (!experience.systemId) {
      toast.error("Cannot edit experience without systemId");
      return;
    }
    setEditingExperience(experience);
    setCurrentExperience(experience);
    setIsModalOpen(true);
  };

  const handleDelete = async (systemId: string | undefined) => {
    if (!systemId) {
      toast.error("Cannot delete experience without systemId");
      return;
    }

    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        if (companyId) {
          await appServices.deleteApplicantWorkExperience(companyId, systemId);
          await dispatch(
            getWorkExperience({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
          toast.success("Work experience deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting experience:", error);
        toast.error("Failed to delete work experience");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    setCurrentExperience({
      applicantNo: "",
      type: "Experience",
      typeCode: "EXPERIENCE",
      experienceFrom: "",
      experienceTo: "",
      experienceOrganization: "",
      experiencePosition: "",
      experienceDuties: "",
    });
  };

  const handleAddOrUpdateExperience = async () => {
    if (
      !currentExperience.experiencePosition ||
      !currentExperience.experienceOrganization ||
      !currentExperience.experienceFrom ||
      !currentExperience.experienceTo ||
      !currentExperience.experienceDuties ||
      !applicationNo
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsModalSubmitting(true);

      const formattedExperience: WorkExperience = {
        applicantNo: applicationNo,
        type: "Experience",
        typeCode: "EXPERIENCE",
        experienceFrom: new Date(currentExperience.experienceFrom)
          .toISOString()
          .split("T")[0],
        experienceTo: new Date(currentExperience.experienceTo)
          .toISOString()
          .split("T")[0],
        experienceOrganization: currentExperience.experienceOrganization,
        experiencePosition: currentExperience.experiencePosition,
        experienceDuties: currentExperience.experienceDuties,
      };

      if (companyId) {
        if (editingExperience?.systemId) {
          const updatePayload: WorkExperience = {
            ...formattedExperience,
            systemId: editingExperience.systemId,
          };

          await appServices.updateApplicantWorkExperience(
            companyId,
            updatePayload
          );

          await dispatch(
            getWorkExperience({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
          toast.success("Work experience updated successfully");
        } else {
          await appServices.addApplicantWorkExperience(
            companyId,
            formattedExperience
          );

          await dispatch(
            getWorkExperience({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
          toast.success("Work experience added successfully");
        }
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        editingExperience
          ? "Failed to update work experience"
          : "Failed to add work experience"
      );
    } finally {
      setIsModalSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Work Experience</span>
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D55A3]"></div>
          </div>
        ) : workExperience.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No work experience added yet
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-gray-900">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workExperience.map((exp) => (
                <tr key={exp.systemId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exp.experiencePosition}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exp.experienceOrganization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(exp.experienceFrom).toLocaleDateString()} -
                    {new Date(exp.experienceTo).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.systemId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingExperience ? "Edit Work Experience" : "Add Work Experience"
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentExperience.experiencePosition}
              onChange={(e) =>
                handleChange("experiencePosition", e.target.value)
              }
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentExperience.experienceOrganization}
              onChange={(e) =>
                handleChange("experienceOrganization", e.target.value)
              }
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  currentExperience.experienceFrom
                    ? new Date(currentExperience.experienceFrom)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "experienceFrom",
                    date?.toISOString().split("T")[0]
                  )
                }
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
                placeholderText="Select start date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  currentExperience.experienceTo
                    ? new Date(currentExperience.experienceTo)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "experienceTo",
                    date?.toISOString().split("T")[0]
                  )
                }
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
                placeholderText="Select end date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={
                  currentExperience.experienceFrom
                    ? new Date(currentExperience.experienceFrom)
                    : undefined
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duties & Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              value={currentExperience.experienceDuties}
              onChange={(e) => handleChange("experienceDuties", e.target.value)}
              rows={3}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isModalSubmitting}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddOrUpdateExperience}
            disabled={
              isModalSubmitting ||
              !currentExperience.experienceFrom ||
              !currentExperience.experienceTo ||
              !currentExperience.experienceOrganization ||
              !currentExperience.experiencePosition ||
              !currentExperience.experienceDuties
            }
            className="px-4 py-2 text-sm bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isModalSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>{editingExperience ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>{editingExperience ? "Update" : "Add"} Work Experience</>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default WorkExperience;
