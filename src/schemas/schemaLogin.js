const joi = require("joi")

const loginSchema = joi.object({
  username: joi.string().required().min(5).messages({
    "any.required": "O campo username é obrigatório",
    "string.empty": "O campo username é obrigatório",
    "string.base": "O campo username deve ser uma string",
    "string.min": "O campo username deve no mínimo 5 caracteres",
  }),
  senha: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "any.required": "O campo senha é obrigatório",
      "string.empty": "O campo senha é obrigatório",
      "string.pattern.base": "A senha precisa ter um formato valído",
    }),
})

module.exports = loginSchema
