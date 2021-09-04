import Joi from "joi";

const signupSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[a-z0-9]+$/)
    .min(4)
    .max(16)
    .required(),
  password: Joi.string()
    .pattern(/(?=.*[0-9])(?=.*[a-z])(?=.*[^0-9a-zA-Z])/)
    .required(),
  nickname: Joi.string().min(1).max(30).required(),
});

export { signupSchema };
