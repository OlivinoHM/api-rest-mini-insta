const joi = require("joi")
const { regex } = require("./schemaLogin")

const registerUserSchema = joi.object({
  nome: joi.string().required().messages({
    "any.required": "O campo nome é obrigatório",
    "string.empty": "O campo nome é obrigatório",
    "string.base": "O campo nome de ser uma string",
  }),
  username: joi.string().required().min(5).messages({
    "any.required": "O campo username é obrigatório",
    "string.empty": "O campo username é obrigatório",
    "string.base": "O campo username deve ser uma string",
    "string.min": "O campo username deve no mínimo 5 caracteres",
  }),
  email: joi.string().email().required().messages({
    "string.email": "O campo e-mail precisa ter um formato válido",
    "any.required": "O campo e-mail é obrigatório",
    "string.empty": "O campo e-mail é obrigatório",
  }),
  senha: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .messages({
      "any.required": "O campo senha é obrigatório",
      "string.pattern.base": "A senha precisa ter um formato valído",
      "string.min": "A senha precisa ter 5 caracteres",
    }),
})

const updateUserSchema = joi.object({
  nome: joi.string().messages({
    "string.base": "O campo nome de ser uma string",
  }),
  username: joi.string().min(5).messages({
    "string.base": "O campo username deve ser uma string",
    "string.min": "O campo username deve no mínimo 5 caracteres",
  }),
  email: joi.string().email().messages({
    "string.email": "O campo e-mail precisa ter um formato válido",
  }),
  senha: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).messages({
    "string.pattern.base": "A senha precisa ter um formato valído",
  }),
  imagem: joi.string().messages({
    "string.base": "O campo imagem deve ser uma string",
  }),
  site: joi.string().messages({
    "string.base": "O campo site deve ser uma string",
  }),
  bio: joi.string().messages({
    "string.base": "O campo bio deve ser uma string",
  }),
  telefone: joi.string().messages({
    "string.base": "O campo telefone deve ser uma string",
  }),
  genero: joi.string().messages({
    "string.base": "O campo genero deve ser uma string",
  }),
})
module.exports = {
  registerUserSchema,
  updateUserSchema,
}
