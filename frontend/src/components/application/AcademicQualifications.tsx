import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../common/Modal";
import { appServices } from "@/services/AppService";
import {
  AcademicCourse,
  AcademicQualification,
  CreateAcademicQualificationRequest,
} from "@/@types/app";
import { useAppDispatch, useAppSelector } from "@/store";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import { toast } from "react-hot-toast";
import {
  deleteAcademicQualification,
  getAcademicQualifications,
  setAcademicQualifications,
} from "@/store/slices/app/applicationSlice";

// Update the enum name to reflect its new purpose
export enum EducationType {
  DIPLOMA = "DIPLOMA",
  BACHELOR = "BACHELOR",
  MASTERS = "MASTERS",
  PHD = "PHD",
  POSTGRADUATE_DIPLOMA = "POSTGRADUATE DIPLOMA",
  OTHER = "OTHER",
}

// interface ApiAcademicQualification {
//   systemId: string;
//   educationType: EducationType | string;
//   courseNo: string;
//   description: string;
//   institute: string;
//   startDate: string | null;
//   attainmentDate: string | null;
//   certificate: File | null;
// }

interface ComponentAcademicQualification {
  systemId: string;
  educationType: EducationType | string;
  educationTypeCode?: string;
  programName: string;
  description: string;
  institute: string;
  startDate: Date | null;
  attainmentDate: Date | null;
  certificate: File | null;
}

const AcademicQualifications = () => {
  const { companyId } = useAppSelector((state) => state.auth.session);
  // const { data: profile } = useAppSelector((state) => state.app.profile);
  // const [qualifications, setQualifications] = useState<AcademicQualification[]>(
  //   initialData || []
  // );
  const academicQualifications = useAppSelector(
    (state) => state.app.application.academicQualifications
  );
  const [academicCourses, setAcademicCourses] = useState<AcademicCourse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQualification, setEditingQualification] =
    useState<AcademicQualification | null>(null);
  const [currentQualification, setCurrentQualification] =
    useState<ComponentAcademicQualification>({
      systemId: "",
      educationType: "",
      educationTypeCode: "",
      programName: "",
      description: "",
      institute: "",
      startDate: null,
      attainmentDate: null,
      certificate: null,
    });
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const { applicationNo } = useAppSelector((state) => state.app.application);
  const dispatch = useAppDispatch();

  const educationTypes = Object.values(EducationType);

  // Fetch academic courses
  useEffect(() => {
    console.log("Fetching academic courses");
    console.log(applicationNo);
    const fetchData = async () => {
      try {
        if (companyId) {
          const courses = await appServices.getAcademicCourses(companyId);
          dispatch(
            getAcademicQualifications({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
          console.log(courses);
          setAcademicCourses(courses);
        }
      } catch (error) {
        console.error("Failed to fetch academic courses:", error);
      }
    };

    fetchData();
  }, [companyId]);

  // Filter courses based on selected education type
  const filteredCourses = academicCourses.filter(
    (course) => course.EducationTypeCode === currentQualification.educationType
  );

  const handleChange = (
    field: keyof ComponentAcademicQualification,
    value: any
  ) => {
    setCurrentQualification((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (qual: AcademicQualification) => {
    const convertedQualification: ComponentAcademicQualification = {
      ...qual,
      startDate: qual.startDate ? new Date(qual.startDate) : null,
      attainmentDate: qual.attainmentDate
        ? new Date(qual.attainmentDate)
        : null,
    };

    setEditingQualification(qual);
    setCurrentQualification(convertedQualification);
    setIsModalOpen(true);
  };

  const handleDelete = async (systemId: string) => {
    if (confirm("Are you sure you want to delete this qualification?")) {
      // setQualifications(academicQualifications.filter((_, i) => i !== index));
      // dispatch(deleteAcademicQualification(systemId));
      if (companyId && systemId) {
        const updatedQualifications =
          await appServices.deleteAcademicQualification(companyId, systemId);
        if (updatedQualifications) {
          dispatch(deleteAcademicQualification(systemId));
          toast.success("Qualification deleted successfully");
        }
      }
    }
  };

  const handleAddOrUpdateQualification = async () => {
    try {
      setIsModalSubmitting(true);

      if (!companyId) {
        toast.error("Company ID is required");
        return;
      }

      // Create request data
      const requestData: CreateAcademicQualificationRequest = {
        programName: currentQualification.programName,
        applicantNo: applicationNo || "",
        type: "Edu",
        startDate:
          currentQualification.startDate?.toISOString().split("T")[0] || "",
        attainmentDate:
          currentQualification.attainmentDate?.toISOString().split("T")[0] ||
          "",
        description: currentQualification.description || "",
        institute: currentQualification.institute,
        educationTypeCode: currentQualification.educationType,
      };

      const response = await appServices.createAcademicQualification(
        companyId,
        requestData
      );

      if (response) {
        // Convert dates to strings for Redux store
        const newQualification: AcademicQualification = {
          systemId: response.SystemId,
          educationType: currentQualification.educationType,
          educationTypeCode: currentQualification.educationType,
          programName: currentQualification.programName,
          description: currentQualification.description,
          institute: currentQualification.institute,
          startDate: currentQualification.startDate?.toISOString() || "",
          attainmentDate:
            currentQualification.attainmentDate?.toISOString() || "",
          certificate: currentQualification.certificate,
        };

        // Update Redux store immediately
        if (editingQualification) {
          dispatch(
            setAcademicQualifications(
              academicQualifications.map((q) =>
                q.systemId === editingQualification.systemId
                  ? newQualification
                  : q
              )
            )
          );
        } else {
          dispatch(
            setAcademicQualifications([
              ...academicQualifications,
              newQualification,
            ])
          );
        }

        handleCloseModal();
        toast.success(
          editingQualification
            ? "Qualification updated successfully"
            : "Qualification added successfully"
        );
      }
    } catch (error) {
      console.error("Error adding/updating qualification:", error);
      toast.error("Failed to save qualification");
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQualification(null);
    setCurrentQualification({
      systemId: "",
      educationType: "",
      educationTypeCode: "",
      programName: "",
      description: "",
      institute: "",
      startDate: null,
      attainmentDate: null,
      certificate: null,
    });
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Academic Qualifications
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Qualification</span>
        </button>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-gray-900">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Education Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program Name/Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institute
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {academicQualifications.map((qual, index) => (
              <tr key={qual.systemId || index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {qual.educationTypeCode || qual.educationType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {qual.programName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {qual.institute}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(qual.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(qual.attainmentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const qualWithDates: AcademicQualification = {
                          ...qual,
                          startDate: new Date(qual.startDate).toISOString(),
                          attainmentDate: new Date(
                            qual.attainmentDate
                          ).toISOString(),
                          educationType:
                            qual.educationTypeCode || qual.educationType,
                        };
                        handleEdit(qualWithDates);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(qual.systemId)}
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
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          editingQualification ? "Edit Qualification" : "Add Qualification"
        }
      >
        <div className="grid grid-cols-1 gap-4">
          {/* Education Type and Course in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Type <span className="text-red-500">*</span>
              </label>
              <select
                value={currentQualification.educationType}
                onChange={(e) => handleChange("educationType", e.target.value)}
                required
                className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] bg-white"
              >
                <option value="">Select education type</option>
                {educationTypes.map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                value={currentQualification.programName}
                onChange={(e) => handleChange("programName", e.target.value)}
                required
                disabled={!currentQualification.educationType}
                className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] bg-white"
              >
                <option value="">Select a course</option>
                {filteredCourses.map((course) => (
                  <option key={course.ProgramName} value={course.ProgramName}>
                    {course.ProgramName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Institute in full width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institute <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentQualification.institute}
              onChange={(e) => handleChange("institute", e.target.value)}
              required
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          {/* Start Date and Attainment Date in one row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={currentQualification.startDate}
                  onChange={(date) => handleChange("startDate", date)}
                  dateFormat="dd/MM/yyyy"
                  required
                  className="w-full text-black p-3 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] bg-white"
                  placeholderText="Select start date"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  popperClassName="react-datepicker-popper"
                  popperProps={{
                    strategy: "fixed",
                    placement: "bottom-start",
                  }}
                  customInput={
                    <input
                      type="text"
                      className="w-full text-black p-3 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] bg-white cursor-pointer"
                      placeholder="Select start date"
                    />
                  }
                />
                {/* <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attainment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DatePicker
                  selected={currentQualification.attainmentDate}
                  onChange={(date) => handleChange("attainmentDate", date)}
                  dateFormat="dd/MM/yyyy"
                  required
                  className="w-full text-black p-3 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] bg-white"
                  placeholderText="Select attainment date"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable
                  minDate={currentQualification.startDate || undefined}
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  popperClassName="react-datepicker-popper"
                  popperProps={{
                    strategy: "fixed",
                    placement: "bottom-start",
                  }}
                  customInput={
                    <input
                      type="text"
                      className="w-full text-black p-3 pl-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] bg-white cursor-pointer"
                      placeholder="Select attainment date"
                    />
                  }
                />
                {/* <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
              </div>
            </div>
          </div>

          {/* Description in full width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={currentQualification.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
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
            onClick={handleAddOrUpdateQualification}
            disabled={
              isModalSubmitting ||
              !currentQualification.educationType ||
              !currentQualification.description ||
              !currentQualification.institute ||
              !currentQualification.startDate ||
              !currentQualification.attainmentDate
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
                <span>
                  {editingQualification ? "Updating..." : "Adding..."}
                </span>
              </>
            ) : (
              <>{editingQualification ? "Update" : "Add"} Qualification</>
            )}
          </button>
        </div>
      </Modal>

      {/* Navigation Buttons */}
      {/* <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 text-[#0D55A3] border border-[#0D55A3] rounded-lg hover:bg-[#0D55A3]/10"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default AcademicQualifications;
