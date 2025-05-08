import { EducationType } from "@/components/application/AcademicQualifications";

export interface JobPosition {
  "@odata.etag": string;
  SystemId: string;
  PositionCode: string;
  PositionDescription: string;
  RecrProjNo: string;
  QuantityRequested: number;
  MinYearsExperience: number;
  RecruitmentMethod: string;
  ContractType: string;
  applicationSubmissionDeadline: string;
  positionSummary?: string;
}

export interface JobsApiResponse {
  "@odata.context": string;
  value: JobPosition[];
}
export interface Applicant {
  SystemId: string;
  ApplicantNo: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Sex: string;
  CountryCode: string;
  Address2: string;
  DesiredPosition: string;
  PositionDescription: string;
  NationalIdNumber: string;
  MobilePhoneNo: string;
  EMail: string;
  DateOfBirth: string;
  DistrictOfBirth: string;
  DistrictOfOrigin: string;
  Nationality: string;
  PassportNo: string;
  MaritalStatus: string;
  FriendsEmailAddress: string;
  LastDateModifiedDate: string;
  ApplicationSubmitted: boolean;
  RecruitmentProjectNo: string;
}

export interface ODataApplicantResponse {
  "@odata.context": string;
  value: Applicant[];
}

export interface ProfileData {
  first_name: string;
  middle_name: string;
  last_name: string;
  mobile_no: string;
  birth_date: string;
  birth_district: string;
  district_of_origin: string;
  marital_status: string;
  nationality: string;
  passport_number: string;
  national_id_number: string;
  gender: string;
  applicant_address: string;
  relative_in_organisation: boolean;
  email: string;
}

export interface ProfileData {
  first_name: string;
  middle_name: string;
  last_name: string;
  mobile_no: string;
  birth_date: string;
  birth_district: string;
  district_of_origin: string;
  marital_status: string;
  nationality: string;
  passport_number: string;
  national_id_number: string;
  gender: string;
  applicant_address: string;
  relative_in_organisation: boolean;
  email: string;
}

// Define the response type based on the actual API response
export interface ApplicantResponse {
  "@odata.context": string;
  "@odata.etag": string;
  SystemId: string;
  ApplicantNo: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Sex: string;
  CountryCode: string;
  Address2: string;
  DesiredPosition: string;
  PositionDescription: string;
  NationalIdNumber: string;
  MobilePhoneNo: string;
  EMail: string;
  DateOfBirth: string;
  DistrictOfBirth: string;
  DistrictOfOrigin: string;
  Nationality: string;
  PassportNo: string;
  MaritalStatus: string;
  FriendsEmailAddress: string;
  LastDateModifiedDate: string;
  ApplicationSubmitted: boolean;
  RecruitmentProjectNo: string;
}

// Add new interface for application data
export interface CreateApplicationParams {
  companyId: string;
  applicationData: {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Address2: string;
    DateOfBirth: string;
    DesiredPosition: string;
    DistrictOfBirth: string;
    DistrictOfOrigin: string;
    EMail: string;
    MaritalStatus: string;
    MobilePhoneNo: string;
    NationalIdNumber: string;
    Nationality: string;
    PassportNo: string;
    Sex: string;
  };
}

export interface AcademicCourse {
  SystemId: string;
  ProgramCategoryCode: string;
  EducationTypeCode: string;
  ProgramName: string;
  CourseNo: number;
}

export interface AcademicCoursesResponse {
  "@odata.context": string;
  value: AcademicCourse[];
}

// Add these interfaces
export interface AcademicQualificationSubmission {
  typeCode: string;
  type: string;
  courseNo: string;
  programName: string;
  applicantNo?: string;
  startDate: string;
  attainmentDate: string;
  description: string;
  institute: string;
  educationCertificateStatus: "ONGOING" | "COMPLETED" | "";
  academicLevel: string;
  certificate: File | null;
}

export interface SubmitAcademicQualificationsParams {
  companyId: string;
  applicantId: string;
  qualifications: AcademicQualificationSubmission[];
}

export interface AcademicQualification {
  systemId: string;
  educationType: EducationType | string;
  educationTypeCode?: string;
  programName: string;
  description: string;
  institute: string;
  startDate: string;
  attainmentDate: string;
  certificate: File | null;
}

export interface SkillsOptions {
  systemId: string;
  code: string;
  description: string;
}

// Add the WorkExperience interface
export interface WorkExperience {
  systemId?: string; // Optional since it's only needed for updates
  applicantNo: string;
  type: string;
  typeCode: string;
  experienceFrom: string;
  experienceTo: string;
  experienceOrganization: string;
  experiencePosition: string;
  experienceDuties: string;
}

export interface Certificate {
  systemId?: string;
  typeCode: string;
  type: string;
  applicantNo: string;
  startDate: string;
  attainmentDate: string;
  description: string;
  academicLevel: string;
  institute: string;
  educationCertificateStatus: "ONGOING" | "COMPLETED" | ""; // Changed from status
}

// Add this interface
export interface PositionDescription {
  systemId: string;
  positionNo: string;
  type: string;
  subType: string;
  description: string;
}

// Add a new interface for the API request
export interface CreateAcademicQualificationRequest {
  programName: string;
  applicantNo: string;
  type: string;
  startDate: string;
  attainmentDate: string;
  description: string;
  institute: string;
  educationTypeCode: string;
}

export interface Skill {
  skillId: string;
  skillName: string;
  skillLevel: string;
  systemId: string;
  description: string;
  type: string;
  typeCode: string;
  applicantNo: string;
  trainer: string;
}

export interface Referee {
  systemId?: string;
  name: string;
  position: string;
  organization: string;
  email: string;
  phone: string;
}
