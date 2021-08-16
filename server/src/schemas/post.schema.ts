import Joi from "joi";

const postSchema = Joi.object({
  title: Joi.string().min(1).max(30).required(),
  content: Joi.string().min(1).max(300).required(),
  rise: Joi.boolean().required(),
  fall: Joi.boolean().required(),
});

export { postSchema };
