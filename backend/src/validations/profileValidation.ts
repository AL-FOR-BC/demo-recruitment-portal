import Joi from "joi";

export const profileValidation = {
  create: Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    middle_name: Joi.string().allow("", null),
    mobile_no: Joi.string().required(),
    birth_date: Joi.date().required(),
    birth_district: Joi.string().required(),
    district_of_origin: Joi.string().required(),
    marital_status: Joi.string().required(),
    nationality: Joi.string().required(),
    passport_number: Joi.string().allow("", null),
    national_id_number: Joi.string().required(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
    applicant_address: Joi.string().required(),
    relative_in_organisation: Joi.boolean().required(),
  }),

  update: Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    middle_name: Joi.string().allow("", null),
    mobile_no: Joi.string(),
    birth_date: Joi.date(),
    birth_district: Joi.string(),
    district_of_origin: Joi.string(),
    marital_status: Joi.string(),
    nationality: Joi.string(),
    passport_number: Joi.string().allow("", null),
    national_id_number: Joi.string(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER'),
    applicant_address: Joi.string(),
    relative_in_organisation: Joi.boolean(),
  }),
}; 