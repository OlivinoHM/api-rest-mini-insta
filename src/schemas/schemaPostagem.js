const joi = require("joi")

const novaPostagemSchema = joi.object({
  texto: joi.string().required().messages({
    "any.required": "O campo texto é obrigatório",
    "string.empty": "O campo texto é obrigatório",
    "string.base": "O campo texto deve ser uma string",
  }),
  imagens: joi.array().min(1).required().messages({
    "any.required": "O campo imagens é obrigatório",
    "array.min": "Pelo menos uma imagem deve ser fornecida",
  }),
})

module.exports = novaPostagemSchema
