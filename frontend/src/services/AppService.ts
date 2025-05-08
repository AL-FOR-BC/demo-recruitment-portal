import {
  Applicant,
  ApplicantResponse,
  JobPosition,
  AcademicCourse,
  AcademicQualificationSubmission,
  AcademicQualification,
  Skill,
  SkillsOptions,
  CreateAcademicQualificationRequest,
} from "@/@types/app";
import { BaseApiService } from "./BcApiSerivce";
import { ODataResponse } from "@/@types/api";



class AppServices extends BaseApiService {
  protected endpoint = "HRMLeaveRequests";
  protected version = "v2.0";
  protected module = "hrpsolutions/hrmis";

  /**
   * Fetches jobs from the API
   * @async
   * @param {string} companyId - Company identifier
   * @param {string} [filterQuery] - Optional OData filter query
   * @param {string} [customEndpoint] - Optional custom endpoint
   * @returns {Promise<ODataResponse<JobPosition>>} Jobs API response
   */
  async getJobs(
    companyId: string,
    filterQuery?: string,
    customEndpoint?: string
  ): Promise<ODataResponse<JobPosition>> {
    const response = await this.get<JobPosition>({
      companyId,
      filterQuery,
      customEndpoint,
    });

    return {
      "@odata.context": "",
      value: response,
    };
  }

  async createProflieInBC(
    companyId: string,
    filterQuery?: string,
    customEndpoint?: string,
    data?: any
  ): Promise<{ value: { data: any } }> {
    const response = await this.create<any>({
      companyId,
      filterQuery,
      customEndpoint,
      data,
    });
    return {
      value: response,
    };
  }

  // Get applicant by ID
  async getApplicant(
    companyId: string,
    filterQuery?: string,
    customEndpoint?: string
  ): Promise<ApplicantResponse[]> {
    try {
      const response = await this.get<ApplicantResponse>({
        companyId,
        filterQuery,
        customEndpoint,
      });
      return response;
    } catch (error) {
      console.error("Error fetching applicant:", error);
      throw error;
    }
  }

  // Get all applicants
  // async getApplicants(): Promise<Applicant[]> {
  //   try {
  //     const response = await this.get<ODataApplicantResponse>({
  //       customEndpoint: "APIHRMApplicants",
  //     });
  //     return response.value;
  //   } catch (error) {
  //     console.error("Error fetching applicants:", error);
  //     throw error;
  //   }
  // }

  // Create new applicant
  async createApplicant(
    companyId: string,
    data: Partial<Applicant>,
    filterQuery?: string,
    customEndpoint?: string
  ): Promise<Applicant> {
    try {
      const response = await this.create<Applicant>({
        companyId,
        filterQuery,
        customEndpoint,
        data,
      });
      return response as any;
    } catch (error) {
      console.error("Error creating applicant:", error);
      throw error;
    }
  }

  async getJobDetails(
    companyId: string,
    jobId: string,
    customEndpoint: string
  ): Promise<JobPosition | undefined> {
    try {
      const response = await this.getById({
        companyId: companyId,
        systemId: jobId,
        customEndpoint,
      });
      return response as any;
    } catch (error) {
      throw error;
    }
  }

  async getPostionDescription(
    companyId: string,
    customEndpoint: string,
    filterQuery?: string
  ): Promise<any> {
    return this.get({
      companyId,
      customEndpoint,
      filterQuery,
    });
  }

  async getPostionEducation(
    companyId: string,
    customEndpoint: string,
    filterQuery?: string
  ): Promise<any> {
    return this.get({
      companyId,
      customEndpoint,
      filterQuery,
    });
  }

  async getPostionCertification(
    companyId: string,
    customEndpoint: string,
    filterQuery?: string
  ): Promise<any> {
    return this.get({
      companyId,
      customEndpoint,
      filterQuery,
    });
  }
  async getPostionSkills(
    companyId: string,
    customEndpoint: string,
    filterQuery?: string
  ): Promise<any> {
    return this.get({
      companyId,
      customEndpoint,
      filterQuery,
    });
  }
  // Update applicant
  // async updateApplicant(
  //   applicantId: string,
  //   applicantData: Partial<Applicant>
  // ): Promise<Applicant> {
  //   try {
  //     const response = await this.update<Applicant>({
  //       customEndpoint: "APIHRMApplicants",
  //       id: applicantId,
  //       data: {
  //         ...applicantData,
  //         LastDateModifiedDate: new Date().toISOString(),
  //       },
  //     });
  //     return response;
  //   } catch (error) {
  //     console.error("Error updating applicant:", error);
  //     throw error;
  //   }
  // }

  // // Submit application
  // async submitApplication(
  //   applicantId: string,
  //   applicationData: any
  // ): Promise<void> {
  //   try {
  //     await this.update<Applicant>({
  //       customEndpoint: "APIHRMApplicants",
  //       id: applicantId,
  //       data: {
  //         ApplicationSubmitted: true,
  //         LastDateModifiedDate: new Date().toISOString(),
  //         ...applicationData,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error submitting application:", error);
  //     throw error;
  //   }
  // }

  async getAcademicCourses(companyId: string): Promise<AcademicCourse[]> {
    try {
      const response = await this.get<AcademicCourse>({
        companyId,
        customEndpoint: "AcademicCourses",
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  async createApplicantEducation(
    companyId: string,
    data: { qualifications: AcademicQualificationSubmission[] }
  ): Promise<any> {
    try {
      const response = await this.create<any>({
        companyId,
        customEndpoint: `ApplicantEducation`,
        data: {
          qualifications: data.qualifications.map((qual) => ({
            typeCode: qual.typeCode,
            type: qual.type,
            applicantNo: qual.applicantNo,
            startDate: qual.startDate,
            attainmentDate: qual.attainmentDate,
            description: qual.description,
            institute: qual.institute,
          })),
        },
      });
      return response;
    } catch (error) {
      console.error("Error submitting academic qualifications:", error);
      throw error;
    }
  }

  async createAcademicQualification(
    companyId: string,
    data: CreateAcademicQualificationRequest
  ): Promise<{ SystemId: string }> {
    try {
      const response = await this.create<any>({
        companyId,
        customEndpoint: "ApplicantEducation",
        data,
      });
      return response as any;
    } catch (error) {
      throw error;
    }
  }
  async getAcademicQualification(
    companyId: string,
    filterQuery?: string
  ): Promise<AcademicQualification[]> {
    try {
      const response = await this.get<AcademicQualification>({
        companyId,
        filterQuery,
        customEndpoint: "ApplicantEducation",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteAcademicQualification(
    companyId: string,
    systemId: string
  ): Promise<any> {
    return this.delete({
      companyId,
      systemId,
      customEndpoint: "ApplicantEducation",
    });
  }

  async getSkills(
    companyId: string,
    filterQuery?: string
  ): Promise<SkillsOptions[]> {
    try {
      const response = await this.get<SkillsOptions>({
        companyId,
        filterQuery,
        customEndpoint: "Skills",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getSkillsAndCertifications(
    companyId: string,
    filterQuery?: string
  ): Promise<SkillsOptions[]> {
    try {
      const response = await this.get<SkillsOptions>({
        companyId,
        filterQuery,
        customEndpoint: "PositionCertificateProfile",
      });
      return response;
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error;
    }
  }

  async addSkillsAndCertifications(
    companyId: string,
    data: Skill
  ): Promise<any> {
    try {
      const response = await this.create<any>({
        companyId,
        customEndpoint: "PositionCertificateProfile",
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async updateSkillsAndCertifications(
    companyId: string,
    data: Skill
  ): Promise<any> {
    try {
      const response = await this.update<any>({
        companyId,
        systemId: data.systemId,
        customEndpoint: "PositionCertificateProfile",
        data,
        etag: "*",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteSkillsAndCertifications(
    companyId: string,
    systemId: string
  ): Promise<any> {
    try {
      const response = await this.delete({
        companyId,
        systemId,
        customEndpoint: "PositionCertificateProfile",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  // APIApplicantWorkExperience
  async getApplicantWorkExperience(
    companyId: string,
    filterQuery?: string
  ): Promise<any> {
    try {
      const response = await this.get<any>({
        companyId,
        filterQuery,
        customEndpoint: "ApplicantWorkExperience",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async addApplicantWorkExperience(companyId: string, data: any): Promise<any> {
    try {
      const response = await this.create<any>({
        companyId,
        customEndpoint: "ApplicantWorkExperience",
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateApplicantWorkExperience(
    companyId: string,
    data: any
  ): Promise<any> {
    try {
      const response = await this.update<any>({
        companyId,
        systemId: data.systemId,
        customEndpoint: "ApplicantWorkExperience",
        data: {
          ...data,
          systemId: undefined,
        },
        etag: "*",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async deleteApplicantWorkExperience(
    companyId: string,
    systemId: string
  ): Promise<any> {
    try {
      const response = await this.delete({
        companyId,
        systemId,
        customEndpoint: "ApplicantWorkExperience",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get references
  async getApplicantReferences(
    companyId: string,
    filterQuery?: string
  ): Promise<any> {
    try {
      const response = await this.get<any>({
        companyId,
        filterQuery,
        customEndpoint: "ApplicantReferences",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add reference
  async addApplicantReference(companyId: string, data: any): Promise<any> {
    try {
      const response = await this.create<any>({
        companyId,
        customEndpoint: "ApplicantReferences",
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update reference
  async updateApplicantReference(companyId: string, data: any): Promise<any> {
    try {
      const response = await this.update<any>({
        companyId,
        systemId: data.systemId,
        customEndpoint: "ApplicantReferences",
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete reference
  async deleteApplicantReference(
    companyId: string,
    systemId: string
  ): Promise<any> {
    try {
      const response = await this.delete({
        companyId,
        systemId,
        customEndpoint: "ApplicantReferences",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getApplicantCertifications(
    companyId: string,
    filterQuery?: string
  ): Promise<any> {
    try {
      const response = await this.get<any>({
        companyId,
        filterQuery,
        customEndpoint: "ApplicantCertifications",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async addApplicantCertification(companyId: string, data: any): Promise<any> {
    try {
      const response = await this.create<any>({
        companyId,
        customEndpoint: "ApplicantCertifications",
        data,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateApplicantCertification(
    companyId: string,
    data: any
  ): Promise<any> {
    try {
      const response = await this.update<any>({
        companyId,
        systemId: data.systemId,
        customEndpoint: "ApplicantCertifications",
        data: {
          ...data,
          systemId: undefined,
        },
        etag: "*",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteApplicantCertification(
    companyId: string,
    systemId: string
  ): Promise<any> {
    try {
      const response = await this.delete({
        companyId,
        systemId,
        customEndpoint: "ApplicantCertifications",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getProfessionalCertificates(companyId: string): Promise<any> {
    try {
      const response = await this.get<any>({
        companyId,
        customEndpoint: "ProfessionalCertificates",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Add this new method for submitting application
  async submitApplication(
    companyId: string,
    applicantNo: string
  ): Promise<any> {
    try {
      const response = await this.create<any>({
        companyId,
        type: "submitApplication",

        customEndpoint: "HRMISActions_SubmitApplication",
        data: {
          no: applicantNo,
        },
      });
      return response;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  }
  async uploadAttachment(companyId: string, fileData: any): Promise<any> {
    try {
      const response = await this.create<any>({
        companyId,
        customEndpoint: "documentAttachments",
        data: fileData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAttachments(companyId: string, filterQuery?: string): Promise<any> {
    try {
      const response = await this.get<any>({
        companyId,
        filterQuery,
        customEndpoint: "documentAttachments",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteAttachment(companyId: string, systemId: string): Promise<any> {
    try {
      const response = await this.delete({
        companyId,
        systemId,
        customEndpoint: "documentAttachments",
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async saveAttachment(companyId: string, fileData: any): Promise<any> {
    try {
      const response = await this.create({
        companyId,
        customEndpoint: "documentAttachments",
        data: fileData,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const appServices = new AppServices();
