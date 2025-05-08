// frontend/src/components/application/Attachments.tsx
import { useState, useRef, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  XMarkIcon,
  DocumentIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { appServices } from "@/services/AppService";

interface AttachmentProps {
  companyId: string;
  docType: string;
  docNo: string;
  status?: "Open" | "Closed";
  tableId: number;
}

interface Attachment {
  FileName: string;
  FileExtension: string;
  FileContentsBase64: string;
  SystemId: string;
  fileContentType: string;
}

const Attachments = ({
  companyId,
  docType,
  docNo,
  status = "Open",
  tableId,
}: AttachmentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFiles(Array.from(e.target.files));
    }
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement("a");
    link.href = `data:${attachment.fileContentType};base64,${attachment.FileContentsBase64}`;
    link.download = `${attachment.FileName}.${attachment.FileExtension}`;
    link.click();
  };

  const fetchAttachments = async () => {
    try {
      setIsLoading(true);
      const filterQuery = `$filter=No eq '${docNo}' and TableID eq ${tableId}`;
      const response = await appServices.getAttachments(companyId, filterQuery);
      if (response && response.value) {
        setAttachments(response.value);
      }
    } catch (error) {
      console.error("Error fetching attachments:", error);
      toast.error("Failed to load attachments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAttachments();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (newFiles.length === 0) return;

    setIsLoading(true);
    try {
      for (const file of newFiles) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64Data = reader.result as string;
              const fileName = file.name.substring(
                0,
                file.name.lastIndexOf(".")
              );
              const fileExtension = file.name.split(".").pop() || "";

              const fileData = {
                No: docNo,
                TableID: tableId,
                DocumentType: docType,
                FileName: fileName,
                FileExtension: fileExtension,
                fileContentType: file.type,
                FileContentsBase64: base64Data.split(",")[1],
              };

              await appServices.uploadAttachment(companyId, fileData);
              resolve(true);
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = reject;
        });
      }

      toast.success("Attachments saved successfully");
      await fetchAttachments();
      setNewFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to save attachments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (systemId: string) => {
    if (confirm("Are you sure you want to delete this attachment?")) {
      try {
        setIsLoading(true);
        await appServices.deleteAttachment(companyId, systemId);
        setAttachments(attachments.filter((att) => att.SystemId !== systemId));
        toast.success("Attachment deleted successfully");
      } catch (error) {
        toast.error("Failed to delete attachment");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Attachments
      </button>

      <Dialog
        open={isOpen}
        onClose={() => {
          if (newFiles.length > 0) {
            if (confirm("Are you sure you want to close without saving?")) {
              setIsOpen(false);
            }
          } else {
            setIsOpen(false);
          }
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className=" text-gray-900 fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <Dialog.Title className="text-lg font-semibold">
                  Document Attachments
                </Dialog.Title>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {status === "Open" && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={newFiles.length === 0}
                    className="px-4 py-2 bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 disabled:opacity-50"
                  >
                    Save Attachment
                  </button>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D55A3]"></div>
                </div>
              ) : attachments.length === 0 && newFiles.length === 0 ? (
                <div className="text-center py-8">
                  <DocumentIcon className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">No attachments yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          File
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* New Files */}
                      {newFiles.map((file, index) => (
                        <tr key={`new-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">{file.name}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setNewFiles((files) =>
                                  files.filter((_, i) => i !== index)
                                );
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* Existing Attachments */}
                      {attachments.map((attachment, index) => (
                        <tr key={attachment.SystemId}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {newFiles.length + index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDownload(attachment)}
                              className="text-blue-600 hover:text-blue-800 underline flex items-center"
                            >
                              {`${attachment.FileName}.${attachment.FileExtension}`}
                              <ArrowDownTrayIcon className="w-4 h-4 ml-1" />
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            {status === "Open" && (
                              <button
                                onClick={() =>
                                  handleDelete(attachment.SystemId)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Attachments;
