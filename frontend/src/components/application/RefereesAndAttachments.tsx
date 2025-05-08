import { useState, useEffect } from "react";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  getReferences,
  type Reference,
} from "@/store/slices/app/applicationSlice";
import { appServices } from "@/services/AppService";
import Attachments from "./Attachment";



const RefereesAndAttachments = () => {
  const dispatch = useAppDispatch();
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { applicationNo } = useAppSelector((state) => state.app.application);
  const { references = [] } = useAppSelector(
    (state) => state.app.application
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [editingReference, setEditingReference] = useState<Reference | null>(
    null
  );
  const [currentReference, setCurrentReference] = useState<Reference>({
    applicantNo: "",
    eMail: "",
    organization: "",
    position: "",
    referenceName: "",
    relationship: "",
    telephoneNo: "",
  });

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReferences = async () => {
      if (companyId && applicationNo) {
        try {
          setIsLoading(true);
          await dispatch(
            getReferences({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          ).unwrap();
        } catch (error) {
          toast.error("Failed to load references");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchReferences();
  }, [dispatch, companyId, applicationNo]);

  const handleChange = (field: keyof Reference, value: string) => {
    setCurrentReference((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = (reference: Reference) => {
    setEditingReference(reference);
    setCurrentReference(reference);
    setIsModalOpen(true);
  };

  const handleDelete = async (systemId: string | undefined) => {
    if (!systemId) {
      toast.error("Cannot delete reference without systemId");
      return;
    }

    if (confirm("Are you sure you want to delete this reference?")) {
      try {
        if (companyId) {
          await appServices.deleteApplicantReference(companyId, systemId);
          // Fetch fresh data after deletion
          await dispatch(
            getReferences({
              companyId,
              filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
            })
          );
          toast.success("Reference deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting reference:", error);
        toast.error("Failed to delete reference");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReference(null);
    setCurrentReference({
      applicantNo: "",
      eMail: "",
      organization: "",
      position: "",
      referenceName: "",
      relationship: "",
      telephoneNo: "",
    });
  };

  // Add email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Update the handleAddOrUpdateReference function with email validation
  const handleAddOrUpdateReference = async () => {
    if (
      !currentReference.referenceName ||
      !currentReference.organization ||
      !currentReference.eMail ||
      !currentReference.telephoneNo ||
      !currentReference.position ||
      !currentReference.relationship ||
      !applicationNo
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidEmail(currentReference.eMail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setIsModalSubmitting(true);

      const formattedReference: Reference = {
        ...currentReference,
        applicantNo: applicationNo,
      };

      if (editingReference) {
        await appServices.updateApplicantReference(companyId || "", {
          ...formattedReference,
          systemId: editingReference.systemId,
        });
      } else {
        await appServices.addApplicantReference(companyId || "", formattedReference);
      }

      // Refresh references after add/update
      await dispatch(
        getReferences({
          companyId: companyId || "",
          filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
        })
      );

      toast.success(
        editingReference
          ? "Reference updated successfully"
          : "Reference added successfully"
      );
      handleCloseModal();
    } catch (error) {
      toast.error(
        editingReference
          ? "Failed to update reference"
          : "Failed to add reference"
      );
    } finally {
      setIsModalSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* References Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">References</h2>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-sm bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Reference</span>
          </button>
        </div>

        {/* References Table */}
        <div className="overflow-x-auto text-gray-900">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D55A3]"></div>
            </div>
          ) : references.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No references added yet
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relationship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(references) &&
                  references.map((ref) => (
                    <tr key={ref.systemId || Math.random()}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ref.referenceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ref.organization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ref.position}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            <span className="font-medium">Email:</span>{" "}
                            {ref.eMail}
                          </div>
                          <div className="text-gray-900">
                            <span className="font-medium">Tel:</span>{" "}
                            {ref.telephoneNo}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ref.relationship}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(ref)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(ref.systemId)}
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
      </div>

      {/* Attachments Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Attachments</h2>
        </div>

        {/* Add the Attachments component */}
        {companyId && applicationNo && (
          <Attachments
            companyId={companyId}
            docType="Recruitment"
            docNo={applicationNo}
            status="Open"
            tableId={50341} // You might need to adjust this based on your requirements
          />
        )}
      </div>

      {/* Reference Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingReference ? "Edit Reference" : "Add Reference"}
      >
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentReference.referenceName}
              onChange={(e) => handleChange("referenceName", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentReference.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentReference.position}
              onChange={(e) => handleChange("position", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={currentReference.eMail}
              onChange={(e) => handleChange("eMail", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={currentReference.telephoneNo}
              onChange={(e) => handleChange("telephoneNo", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentReference.relationship}
              onChange={(e) => handleChange("relationship", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
              required
            />
          </div>
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
            onClick={handleAddOrUpdateReference}
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
                <span>{editingReference ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>{editingReference ? "Update" : "Add"} Reference</>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RefereesAndAttachments;
