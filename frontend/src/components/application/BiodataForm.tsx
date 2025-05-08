import { useAppSelector } from "@/store";

import "react-datepicker/dist/react-datepicker.css";

const BiodataForm = () => {
  const { data: profile } = useAppSelector((state) => state.app.profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review your personal information before proceeding
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Basic Details
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="flex gap-2 text-gray-900">
              <span>{profile?.first_name}</span>
              <span>{profile?.middle_name}</span>
              <span>{profile?.last_name}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="text-gray-900 capitalize">{profile?.gender}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="text-gray-900">{profile?.birth_date}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <div className="text-gray-900">{profile?.nationality}</div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Contact Information
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="text-gray-900">{profile?.email}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="text-gray-900">{profile?.mobile_no}</div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Address
            </label>
            <div className="text-gray-900">{profile?.applicant_address}</div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-4 md:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            Additional Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                National ID
              </label>
              <div className="text-gray-900">{profile?.national_id_number}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Marital Status
              </label>
              <div className="text-gray-900 capitalize">
                {profile?.marital_status}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                District of Birth
              </label>
              <div className="text-gray-900">{profile?.birth_district}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                District of Origin
              </label>
              <div className="text-gray-900">{profile?.district_of_origin}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="mt-8 flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D55A3]"
          onClick={() => window.history.back()}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-[#0D55A3] rounded-md hover:bg-[#0D55A3]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D55A3]"
        >
          Proceed with Application
        </button>
      </div> */}
    </form>
  );
};

export default BiodataForm;
