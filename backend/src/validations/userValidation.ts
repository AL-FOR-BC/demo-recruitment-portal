import Joi from "joi";

export const userValidation = {
  signup: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    fullName: Joi.string().required().min(3).messages({
      "string.min": "Full name must be at least 3 characters long",
      "any.required": "Full name is required",
    }),
    password: Joi.string().required().min(6).messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }),

  signin: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  verify: Joi.object({
    otp: Joi.string().required().length(6).messages({
      "string.length": "OTP must be 6 characters long",
      "any.required": "OTP is required",
    }),
  }),

  resendOtp: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  }),
};
