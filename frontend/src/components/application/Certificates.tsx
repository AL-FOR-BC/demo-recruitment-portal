import { useState, useEffect } from "react";
import {
  TrashIcon,
  PencilIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getCertificates,
  setCertificates,
} from "@/store/slices/app/applicationSlice";
import { appServices } from "@/services/AppService";
import type { Certificate } from "@/@types/app";
import { PageSpinner } from "@/components/common/Spinner";


interface CertificateOption {
  systemId: string;
  code: string;
  description: string;
}

const Certificates = () => {
  const dispatch = useAppDispatch();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { applicationNo } = useAppSelector((state) => state.app.application);
  const { certificates = [] } = useAppSelector(
    (state) => state.app.application
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate>({
    typeCode: "",
    type: "",
    applicantNo: "",
    startDate: "",
    attainmentDate: "",
    description: "",
    academicLevel: "",
    institute: "",
    educationCertificateStatus: "",
  });

  const [certificateOptions, setCertificateOptions] = useState<
    CertificateOption[]
  >([]);

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true);
        if (companyId && applicationNo) {
          // Always fetch fresh data
          await dispatch(
            getCertificates({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
        toast.error("Failed to load certificates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificates();
  }, [companyId, applicationNo]);

  useEffect(() => {
    const fetchCertificateOptions = async () => {
      if (companyId) {
        try {
          const response = await appServices.getProfessionalCertificates(
            companyId
          );
          setCertificateOptions(response || []);
        } catch (error) {
          console.error("Error fetching certificate options:", error);
          toast.error("Failed to load certificate types");
        }
      }
    };

    fetchCertificateOptions();
  }, [companyId]);

  const handleChange = (field: keyof Certificate, value: any) => {
    setCurrentCertificate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setCurrentCertificate(certificate);
    setIsModalOpen(true);
  };

  const handleDelete = async (systemId: string | undefined) => {
    if (!systemId) {
      toast.error("Cannot delete certificate without systemId");
      return;
    }

    if (confirm("Are you sure you want to delete this certificate?")) {
      try {
        if (companyId) {
          await appServices.deleteApplicantCertification(companyId, systemId);
          dispatch(
            setCertificates(
              certificates.filter((cert) => cert.systemId !== systemId)
            )
          );
          toast.success("Certificate deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting certificate:", error);
        toast.error("Failed to delete certificate");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCertificate(null);
    setCurrentCertificate({
      typeCode: "",
      type: "",
      applicantNo: "",
      startDate: "",
      attainmentDate: "",
      description: "",
      academicLevel: "",
      institute: "",
      educationCertificateStatus: "",
    });
  };

  const handleAddOrUpdateCertificate = async () => {
    if (
      !currentCertificate.type ||
      !currentCertificate.typeCode ||
      !currentCertificate.description ||
      !currentCertificate.institute ||
      !currentCertificate.startDate ||
      !currentCertificate.attainmentDate ||
      !currentCertificate.educationCertificateStatus ||
      !applicationNo
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsModalSubmitting(true);

      if (!companyId) {
        toast.error("Company ID is required");
        return;
      }

      const formattedCertificate: Certificate = {
        ...currentCertificate,
        applicantNo: applicationNo,
      };

      if (editingCertificate?.systemId) {
        // Update existing certificate
        const updatePayload: Certificate = {
          ...formattedCertificate,
          systemId: editingCertificate.systemId,
        };

        const response = await appServices.updateApplicantCertification(
          companyId,
          updatePayload
        );

        if (response) {
          // Fetch fresh data after update
          await dispatch(
            getCertificates({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
          toast.success("Certificate updated successfully");
        }
      } else {
        // Add new certificate
        const response = await appServices.addApplicantCertification(
          companyId,
          formattedCertificate
        );

        if (response) {
          // Fetch fresh data after creation
          await dispatch(
            getCertificates({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
          toast.success("Certificate added successfully");
        }
      }
      handleCloseModal();
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(
        error.message ||
          (editingCertificate
            ? "Failed to update certificate"
            : "Failed to add certificate")
      );
    } finally {
      setIsModalSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Professional Certificates
        </h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="overflow-x-auto text-gray-900">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <PageSpinner />
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No certificates added yet
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institute
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(certificates) &&
                certificates.map((cert) => (
                  <tr key={cert.systemId || Math.random()}>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium">{cert.type}</div>
                        <div className="text-sm text-gray-500">
                          {cert.description}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            cert.educationCertificateStatus === "COMPLETED"
                              ? "text-green-600"
                              : cert.educationCertificateStatus === "ONGOING"
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}
                        >
                          {cert.educationCertificateStatus?.toLowerCase()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{cert.institute}</td>
                    <td className="px-6 py-4">
                      {new Date(cert.startDate).toLocaleDateString()} -{" "}
                      {new Date(cert.attainmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                          cert.educationCertificateStatus
                            ?.toUpperCase() === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : cert.educationCertificateStatus
                              ?.toUpperCase() === "ONGOING"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {cert.educationCertificateStatus
                          ? cert.educationCertificateStatus.charAt(0) +
                            cert.educationCertificateStatus
                              .slice(1)
                              .toLowerCase()
                          : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(cert)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.systemId)}
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCertificate ? "Edit Certificate" : "Add Certificate"}
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Type <span className="text-red-500">*</span>
            </label>
            <select
              value={currentCertificate.typeCode}
              onChange={(e) => {
                const selected = certificateOptions.find(
                  (opt) => opt.code === e.target.value
                );
                if (selected) {
                  handleChange("type", "Cert");
                  handleChange("typeCode", selected.code);
                  handleChange("description", selected.description);
                }
              }}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
              required
            >
              <option value="">Select Certificate Type</option>
              {certificateOptions.map((option) => (
                <option key={option.systemId} value={option.code}>
                  {option.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentCertificate.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3] disabled:bg-gray-100"
              disabled={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Institute <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentCertificate.institute}
              onChange={(e) => handleChange("institute", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education/Certificate Status{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              value={currentCertificate.educationCertificateStatus}
              onChange={(e) =>
                handleChange("educationCertificateStatus", e.target.value)
              }
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
              required
            >
              <option value="">Select Status</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  currentCertificate.startDate
                    ? new Date(currentCertificate.startDate)
                    : null
                }
                onChange={(date) =>
                  handleChange("startDate", date?.toISOString().split("T")[0])
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
                Attainment Date <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={
                  currentCertificate.attainmentDate
                    ? new Date(currentCertificate.attainmentDate)
                    : null
                }
                onChange={(date) =>
                  handleChange(
                    "attainmentDate",
                    date?.toISOString().split("T")[0]
                  )
                }
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
                placeholderText="Select attainment date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={
                  currentCertificate.startDate
                    ? new Date(currentCertificate.startDate)
                    : undefined
                }
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Level
            </label>
            <input
              type="text"
              value={currentCertificate.academicLevel}
              onChange={(e) => handleChange("academicLevel", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
              placeholder="e.g., Level 6"
            />
          </div> */}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={isModalSubmitting}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddOrUpdateCertificate}
            disabled={isModalSubmitting}
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
                <span>{editingCertificate ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>{editingCertificate ? "Update" : "Add"} Certificate</>
            )}
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default Certificates;
