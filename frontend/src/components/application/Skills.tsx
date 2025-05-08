import { useEffect, useState } from "react";
import { TrashIcon, PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Modal from "../common/Modal";
import { toast } from "react-hot-toast";
import { appServices } from "@/services/AppService";
import { useAppSelector, useAppDispatch } from "@/store";
import { SkillsOptions } from "@/@types/app";
import { getSkills } from "@/store/slices/app/applicationSlice";

interface SkillData {
  systemId: string;
  description: string;
  skillLevel: string;
  type?: string;
  typeCode?: string;
  applicantNo?: string | null;
  trainer?: string;
  status?: SkillStatus;
}

// Add this enum for status options
enum SkillStatus {
  ACTUAL = "Actual",
  PLANNED = "Planned",
}

const Skills = () => {
  const dispatch = useAppDispatch();
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [currentSkill, setCurrentSkill] = useState<SkillData>({
    systemId: "",
    description: "",
    skillLevel: "",
    type: "Skill",
    typeCode: "",
    applicantNo: null,
    trainer: "",
    status: SkillStatus.ACTUAL,
  });
  const [skillsOptions, setSkillsOptions] = useState<SkillsOptions[]>([]);
  const { companyId } = useAppSelector((state) => state.auth.session);
  const { applicationNo } = useAppSelector((state) => state.app.application);
  const { skillsLastFetched } = useAppSelector(
    (state) => state.app.application
  );
  const skillLevels = [
    "None",
    "Minimum",
    "Average",
    "Good",
    "V Good",
    "Exceptional",
  ];
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (field: keyof SkillData, value: string) => {
    if (field === "skillLevel") {
      setCurrentSkill((prev) => ({
        ...prev,
        [field]: value.toLowerCase(),
      }));
    } else {
      setCurrentSkill((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  useEffect(() => {
    const populateSkills = async () => {
      try {
        setIsLoading(true);
        if (companyId) {
          const skillsOptionsData = await appServices.getSkills(companyId);
          const skillsData = await appServices.getSkillsAndCertifications(
            companyId,
            `$filter=applicantNo eq '${applicationNo}'`
          );
          setSkillsOptions(skillsOptionsData);
          const formattedSkills: SkillData[] = skillsData.map((skill: any) => ({
            systemId: skill.systemId || "",
            description: skill.description || "",
            skillLevel: skill.skillLevel || "",
            type: skill.type || "Skill",
            typeCode: skill.typeCode || "",
            applicantNo: skill.applicantNo || null,
            trainer: skill.trainer || "",
            status: skill.status || SkillStatus.ACTUAL,
          }));
          setSkills(formattedSkills);
        }
      } catch (error) {
        toast.error("Failed to load skills");
      } finally {
        setIsLoading(false);
      }
    };
    populateSkills();
  }, []);

  useEffect(() => {
    if (!skillsLastFetched && companyId && applicationNo) {
      dispatch(
        getSkills({
          companyId,
          filterQuery: `$filter=applicantNo eq '${applicationNo}'`,
        })
      );
    }
  }, [dispatch, companyId, applicationNo, skillsLastFetched]);

  const handleEdit = (skill: SkillData) => {
    const formattedDescription = skill.typeCode
      ? `${skill.typeCode}::${skill.description}`
      : skill.description;

    setEditingSkill(skill);
    setCurrentSkill({
      ...skill,
      description: formattedDescription,
      skillLevel: skill.skillLevel.toLowerCase(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (systemId: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        const row = document.querySelector(`tr[data-id="${systemId}"]`);
        if (row) {
          row.classList.add("opacity-50");
        }

        if (companyId) {
          const response = await appServices.deleteSkillsAndCertifications(
            companyId,
            systemId
          );
          console.log(response);
          setSkills(skills.filter((s) => s.systemId !== systemId));
          toast.success("Skill deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete skill");
        const row = document.querySelector(`tr[data-id="${systemId}"]`);
        if (row) {
          row.classList.remove("opacity-50");
        }
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setCurrentSkill({
      systemId: "",
      description: "",
      skillLevel: "",
      type: "Skill",
      typeCode: "",
      applicantNo: null,
      trainer: "",
      status: SkillStatus.ACTUAL,
    });
  };

  const handleAddOrUpdateSkill = async () => {
    if (!currentSkill.description || !currentSkill.skillLevel) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsModalSubmitting(true);
      if (!companyId) {
        toast.error("Company ID is required");
        return;
      }

      // Get the code and clean description
      const [code, cleanDescription] = currentSkill.description.split("::");

      const skillsData = {
        ...(editingSkill && {
          systemId: editingSkill.systemId,
        }),
        skillId: code || "",
        skillName: cleanDescription || currentSkill.description,
        description: cleanDescription || currentSkill.description,
        skillLevel: currentSkill.skillLevel,
        type: "Skill",
        typeCode: code || "",
        applicantNo: applicationNo,
        trainer: "",
        status: SkillStatus.ACTUAL,
      };

      if (editingSkill) {
        await appServices.updateSkillsAndCertifications(companyId, skillsData as any);
      } else {
        await appServices.addSkillsAndCertifications(companyId, skillsData as any);
      }

      // Refresh the skills list
      const updatedSkills = await appServices.getSkillsAndCertifications(
        companyId,
        `$filter=applicantNo eq '${applicationNo}'`
      );

      const formattedSkills: SkillData[] = updatedSkills.map((skill: any) => ({
        systemId: skill.systemId || "",
        description: skill.description || "",
        skillLevel: skill.skillLevel || "",
        type: skill.type || "Skill",
        typeCode: skill.typeCode || "",
        applicantNo: skill.applicantNo || null,
        trainer: skill.trainer || "",
        status: skill.status || SkillStatus.ACTUAL,
      }));

      setSkills(formattedSkills);

      toast.success(
        editingSkill ? "Skill updated successfully" : "Skill added successfully"
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error in handleAddOrUpdateSkill:", error);
      toast.error(
        editingSkill ? "Failed to update skill" : "Failed to add skill"
      );
    } finally {
      setIsModalSubmitting(false);
    }
  };

  // Format the skill number with leading zeros

  // Add this helper function to get clean description
  const getCleanDescription = (description: string) => {
    return description.split("::")[1] || description;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm bg-[#0D55A3] text-white rounded-lg hover:bg-[#0D55A3]/90 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Table View with Loading State */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0D55A3]"></div>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No skills added yet
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-gray-900">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DESCRIPTION
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKILL LEVEL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-900 divide-y divide-gray-200">
              {skills.map((skill) => (
                <tr
                  key={skill.systemId}
                  data-id={skill.systemId}
                  className="border-b border-gray-100"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {getCleanDescription(skill.description)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {skill.skillLevel}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(skill)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.systemId)}
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
        title={editingSkill ? "Edit Skill" : "Add Skill"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <select
              value={currentSkill.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full p-3 border text-gray-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            >
              <option value="">Select Skill</option>
              {skillsOptions.map((option) => (
                <option
                  className="text-gray-900"
                  key={option.systemId}
                  value={`${option.code}::${option.description}`}
                >
                  {option.description}
                </option>
              ))}
            </select>
          </div>

          <div className="text-gray-900">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skill Level <span className="text-red-500">*</span>
            </label>
            <select
              value={currentSkill.skillLevel}
              onChange={(e) => handleChange("skillLevel", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D55A3]/50 focus:border-[#0D55A3]"
            >
              <option value="">Select Skill Level</option>
              {skillLevels.map((level) => (
                <option
                  key={level}
                  value={level.toLowerCase()}
                  className="text-gray-900"
                >
                  {level}
                </option>
              ))}
            </select>
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
            onClick={handleAddOrUpdateSkill}
            disabled={
              isModalSubmitting ||
              !currentSkill.description ||
              !currentSkill.skillLevel
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
                <span>{editingSkill ? "Updating..." : "Adding..."}</span>
              </>
            ) : (
              <>{editingSkill ? "Update" : "Add"} Skill</>
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Skills;
