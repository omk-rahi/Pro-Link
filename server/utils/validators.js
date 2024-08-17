import Joi from "joi";

const validator = (schema) => (payload) => schema.validate(payload);

const signupSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({ "any.only": "{{#label}} does not match" }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "{{#label}} does not match" }),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({ "any.only": "{{#label}} does not match" }),
});

const createLinkSchema = Joi.object({
  originalUrl: Joi.string()
    .custom((value, helper) => {
      if (
        value.match(
          /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
        )
      )
        return value;
      else return helper.message("Please provide a valid URL");
    })
    .required(),

  title: Joi.string().required(),
});

const updateLinkSchema = Joi.object({
  title: Joi.string(),
});

export const validateSignup = validator(signupSchema);
export const validateLogin = validator(loginSchema);
export const validateChangePassword = validator(changePasswordSchema);
export const validateResetPassword = validator(resetPasswordSchema);
export const validateCreateLink = validator(createLinkSchema);
export const validateUpdateLink = validator(updateLinkSchema);
