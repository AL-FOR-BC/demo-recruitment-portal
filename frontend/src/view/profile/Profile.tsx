import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "@/store/slices/app/profileSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import profileIcon from "@/assets/profile.png";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { nationalities } from "@/data/nationalities";
import { validateNIN } from "@/utils/validations";
import { toast } from "react-hot-toast";
import { updateProfile } from "@/services/ProfileService";
import { PageSpinner, Spinner } from "@/components/common/Spinner";
import { useTheme } from "@/utils/hooks/useTheme";
import { useCompanyName } from "@/utils/hooks/useCompanyName";

interface ProfileFormData {
  first_name: string;
  middle_name: string;
  last_name: string;
  mobile_no: string;
  applicant_address: string;
  gender: string;
  birth_date: string;
  national_id_number: string;
  district_of_origin: string;
  nationality: string;
  passport_number?: string;
  email?: string;
  marital_status?: string;
  last_modified?: string;
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    data: profile,
    loading,
    error,
  } = useAppSelector((state) => state.app.profile);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { primaryColor } = useTheme();
  const themeColor = primaryColor || "#094BAC";
  const companyName = useCompanyName();
  const [editFormData, setEditFormData] = useState<ProfileFormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    mobile_no: "",
    applicant_address: "",
    gender: "",
    birth_date: "",
    national_id_number: "",
    district_of_origin: "",
    nationality: "",
    passport_number: "",
    email: "",
    marital_status: "",
  });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [errors, setErrors] = useState<{ national_id_number?: string }>({});
  console.log(errors);
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile && isEditModalOpen) {
      setEditFormData({
        ...profile,
        birth_date: profile.birth_date
          ? new Date(profile.birth_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [profile, isEditModalOpen]);

  const handleCreateProfile = () => {
    navigate("/create-profile");
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any
  ) => {
    if (e?.target) {
      const { name, value, type } = e.target;
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));

      setEditFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    } else if (e?.value) {
      setEditFormData((prev) => ({
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(editFormData);
    if (!validateNIN(editFormData.national_id_number)) {
      console.log("invalid");
      setErrors({
        national_id_number:
          "Invalid National ID format. Expected format: CMYYNNNNNNNNN (e.g. CM99123456789)",
      });
      toast.error(
        "Invalid National ID format. Expected format: CMYYNNNNNNNNN (e.g. CM99123456789/CF99123456789)"
      );
      return;
    }
    toast.success("Profile updated successfully");

    setLoadingEdit(true);
    try {
      // remove email and last_modified_by from the object
      const { email, last_modified, ...rest } = editFormData;
      await updateProfile(rest);
      dispatch(fetchProfile());
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setEditFormData((prev) => ({
      ...prev,
      birth_date: date ? date.toISOString().split("T")[0] : "",
    }));
  };

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
              onClick={handleCreateProfile}
              className="px-6 py-3 text-white rounded-lg transition-all font-medium flex items-center gap-2 shadow-lg"
              style={{ 
                backgroundColor: themeColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${themeColor}E6`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeColor;
              }}
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
        <div className="text-red-500">Error loading profile: {error}</div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              No Profile Found
            </h2>
            <p className="text-gray-600">Create your profile to get started</p>
          </div>
          <button
            onClick={handleCreateProfile}
            className="px-6 py-3 text-white rounded-lg transition-all flex items-center gap-2"
            style={{ 
              backgroundColor: themeColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${themeColor}E6`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeColor;
            }}
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
            Create Profile
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Profile
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              View and manage your profile information
            </p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 text-white rounded-lg transition-all flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: themeColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${themeColor}E6`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = themeColor;
            }}
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={user?.avatar || profileIcon}
                    alt="Profile"
                    className="w-24 sm:w-32 h-24 sm:h-32 p-2 rounded-full object-cover border-4 border-[#0D55A3]"
                  />
                </div>
                <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900 text-center">
                  {profile.first_name} {profile.last_name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 break-all text-center">
                  {profile.email}
                </p>

                <div className="mt-6 w-full space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{profile.mobile_no}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{profile.applicant_address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{profile.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {profile.first_name} {profile.middle_name}{" "}
                    {profile.last_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Gender</h3>
                  <p className="mt-1 text-gray-900">{profile.gender}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {new Date(profile.birth_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Nationality
                  </h3>
                  <p className="mt-1 text-gray-900">{profile.nationality}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    National ID
                  </h3>
                  <p className="mt-1 text-gray-900">
                    {profile.national_id_number}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Marital Status
                  </h3>
                  <p className="mt-1 text-gray-900">{profile.marital_status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen px-2 sm:px-4 text-center flex items-center justify-center">
            <div className="relative bg-white w-full max-w-4xl rounded-2xl text-left overflow-hidden shadow-xl transform transition-all">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="text-black">
                <div className="space-y-8 p-8">
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
                          value={editFormData.first_name}
                          onChange={handleEditChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Middle Name
                        </label>
                        <input
                          type="text"
                          name="middle_name"
                          value={editFormData.middle_name}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={editFormData.last_name}
                          onChange={handleEditChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

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
                          value={editFormData.mobile_no}
                          onChange={handleEditChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="applicant_address"
                          value={editFormData.applicant_address}
                          onChange={handleEditChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Personal Details
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gender"
                          value={editFormData.gender}
                          onChange={handleEditChange}
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          selected={
                            editFormData.birth_date
                              ? new Date(editFormData.birth_date)
                              : null
                          }
                          onChange={handleDateChange}
                          dateFormat="yyyy-MM-dd"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                          placeholderText="Select date"
                          isClearable
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nationality <span className="text-red-500">*</span>
                        </label>
                        <Select
                          value={
                            editFormData?.nationality
                              ? {
                                  value: editFormData.nationality,
                                  label: `${editFormData.nationality}`,
                                }
                              : null
                          }
                          onChange={handleEditChange}
                          options={nationalities.map((item) => ({
                            value: item.nationality,
                            label: `${item.nationality} (${item.country})`,
                          }))}
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
                              borderColor: state.isFocused
                                ? "#0D55A3"
                                : "#E5E7EB",
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
                          National ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="national_id_number"
                          value={editFormData.national_id_number}
                          onChange={handleEditChange}
                          onBlur={handleNINBlur}
                          maxLength={14}
                          required
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
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Location Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          District of Origin{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="district_of_origin"
                          value={editFormData.district_of_origin}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-8 w-1 bg-[#0D55A3] rounded-full"></div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Additional Information
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          name="passport_number"
                          value={editFormData.passport_number}
                          onChange={handleEditChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingEdit}
                    className="px-6 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: themeColor,
                      '--tw-ring-color': `${themeColor}50`,
                    } as React.CSSProperties}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = `${themeColor}E6`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = themeColor;
                    }}
                  >
                    {loadingEdit ? (
                      <>
                        <Spinner variant="button" size="sm" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Profile;
