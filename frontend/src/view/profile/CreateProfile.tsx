import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { createProfile } from "@/services/ProfileService";
import { useNavigate } from "react-router-dom";
import { validateNIN } from "@/utils/validations";
import { nationalities } from "@/data/nationalities";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useTheme } from "@/utils/hooks/useTheme";
import { Spinner } from "@/components/common/Spinner";

// Add interface for the select option
interface NationalityOption {
  value: string;
  label: string;
}

const CreateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";
  const [errors, setErrors] = useState<{
    national_id_number?: string;
  }>({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    mobile_no: "",
    birth_date: "",
    district_of_origin: "",
    marital_status: "",
    nationality: "",
    passport_number: "",
    national_id_number: "",
    gender: "",
    applicant_address: "",
    relative_in_organisation: false,
  });

  // Convert nationalities to react-select options
  const nationalityOptions: NationalityOption[] = nationalities.map((item) => ({
    value: item.nationality,
    label: `${item.nationality} (${item.country})`,
  }));

  // Update handleChange to handle react-select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any
  ) => {
    if (e?.target) {
      // Handle regular input changes
      const { name, value, type } = e.target;

      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));

      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    } else if (e?.value) {
      // Handle react-select change
      setFormData((prev) => ({
        ...prev,
        nationality: e.value,
      }));
    }
  };

  const handleNINBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && !validateNIN(value)) {
      setErrors({
        national_id_number: "Invalid National ID format.",
      });
      toast.error("Invalid National ID format.");
    }
  };

  // Find the current nationality option for the select
  const selectedNationality = nationalityOptions.find(
    (option) => option.value === formData.nationality
  );

  // Add date handling functions
  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      birth_date: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //  disclaimer that your profile will you informantion will be used for the purpose of the recruitment process
    const result = await Swal.fire({
      title: "Disclaimer",
      text: "Your profile information will be used for the purpose of the recruitment process",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "I agree",
      cancelButtonText: "I disagree",
      confirmButtonColor: "#0D55A3",
      cancelButtonColor: "#dc2626",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      navigate("/dashboard");
      return;
    }

    // Validate NIN before submission
    if (!validateNIN(formData.national_id_number)) {
      setErrors({
        national_id_number:
          "Invalid National ID format. Format should be: CM/CF + YY + 6 digits + 4 letters (e.g., CM97046100XNKL)",
      });
      toast.error(
        "Invalid National ID format. Format should be: CM/CF + YY + 6 digits + 4 letters (e.g., CM97046100XNKL for male, CF97046100XNKL for female)"
      );
      return;
    }

    setLoading(true);
    try {
      await createProfile(formData);
      navigate("/profile");
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create Your Profile
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-2">
            Please fill in your information to complete your profile
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Personal Information Section */}
          <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 text-black">
            <div className="border-b border-gray-200 pb-6 sm:pb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your middle name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-6 sm:pb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_no"
                    maxLength={10}
                    value={formData.mobile_no}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicant_address"
                    value={formData.applicant_address}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="border-b border-gray-200 pb-6 sm:pb-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Personal Details
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={
                      formData.birth_date ? new Date(formData.birth_date) : null
                    }
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select date of birth"
                    required
                    maxDate={new Date()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    calendarClassName="date-picker-calendar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District of Origin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district_of_origin"
                    value={formData.district_of_origin}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your district of origin"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Additional Information
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={selectedNationality}
                    onChange={handleChange}
                    options={nationalityOptions}
                    isSearchable={true}
                    isClearable={true}
                    placeholder="Search nationality..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                    required
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        minHeight: "46px",
                        borderColor: state.isFocused ? "#0D55A3" : "#E5E7EB",
                        boxShadow: state.isFocused
                          ? "0 0 0 2px rgba(13, 85, 163, 0.2)"
                          : "none",
                        "&:hover": {
                          borderColor: "#0D55A3",
                        },
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isSelected
                          ? "#0D55A3"
                          : state.isFocused
                          ? "#E8F0FE"
                          : "white",
                        color: state.isSelected ? "white" : "#374151",
                        "&:active": {
                          backgroundColor: "#0D55A3",
                          color: "white",
                        },
                      }),
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                  >
                    <option value="">Select Status</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    National ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="national_id_number"
                    value={formData.national_id_number}
                    maxLength={14}
                    onChange={handleChange}
                    onBlur={handleNINBlur}
                    required
                    placeholder="e.g. CM97046100XNKL"
                    className={`w-full p-3 border ${
                      errors.national_id_number
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-[#0D55A3]/50"
                    } rounded-lg focus:outline-none focus:ring-2 focus:border-[#0D55A3] transition-all duration-200`}
                  />
                  {errors.national_id_number && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.national_id_number}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Number
                  </label>
                  <input
                    type="text"
                    name="passport_number"
                    value={formData.passport_number}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your passport number"
                  />
                </div>
              </div>
              {/* <div className="mt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="relative_in_organisation"
                    checked={formData.relative_in_organisation}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-[#0D55A3] focus:ring-[#0D55A3] transition-all duration-200"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    Do you have any relatives in the organisation?
                  </span>
                </label>
              </div> */}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: themeColor,
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = `${themeColor}E6`;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColor;
                }}
              >
                {loading ? (
                  <>
                    <Spinner variant="button" size="sm" />
                    Creating Profile...
                  </>
                ) : (
                  <>
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Create Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateProfile;
