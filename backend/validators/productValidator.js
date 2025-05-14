import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(10).max(50).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required()
});
