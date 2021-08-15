import Joi from "joi";

const postSchema = Joi.object({
  title: Joi.string().min(1).max(30).required(),
  content: Joi.string().min(1).max(300).required(),
  rise: Joi.string()
    .pattern(/true|false/)
    .required(),
  fall: Joi.string()
    .pattern(/true|false/)
    .required(),
});

export { postSchema };
