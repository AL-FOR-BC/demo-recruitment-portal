import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { createProfile } from "@/services/ProfileService";
import { useNavigate } from "react-router-dom";
import { validateNIN } from "@/utils/validations";
import { nationalities } from "@/data/nationalities";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Add interface for the select option
interface NationalityOption {
  value: string;
  label: string;
}

const CreateProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    national_id_number?: string;
  }>({});

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    mobile_no: "",
    birth_date: "",
    birth_district: "",
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

    // Validate NIN before submission
    if (!validateNIN(formData.national_id_number)) {
      setErrors({
        national_id_number:
          "Invalid National ID format. Expected format: CMYYNNNNNNNNN (e.g. CM99123456789)",
      });
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Your Profile
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Please fill in your information to complete your profile
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Personal Information Section */}
          <div className="space-y-8 p-8 text-black">
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_no"
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
            <div className="border-b border-gray-200 pb-8 ">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Personal Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Birth District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="birth_district"
                    value={formData.birth_district}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                    placeholder="Enter your birth district"
                  />
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
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Additional Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    onChange={handleChange}
                    required
                    placeholder="e.g. CM99123456789"
                    className={`w-full p-3 border ${
                      errors.national_id_number
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#0D55A3]/50"
                    } rounded-lg focus:outline-none focus:ring-2 focus:border-[#0D55A3] transition-all duration-200`}
                  />
                  {errors.national_id_number && (
                    <p className="text-sm text-red-500 mt-1">
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
              <div className="mt-6">
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
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-white bg-[#0D55A3] rounded-lg hover:bg-[#0D55A3]/90 focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateProfile;
