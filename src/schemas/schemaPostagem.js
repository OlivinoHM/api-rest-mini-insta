const joi = require("joi")

const novaPostagemSchema = joi.object({
  texto: joi.string().required().messages({
    "any.required": "O campo texto é obrigatório",
    "string.empty": "O campo texto é obrigatório",
    "string.base": "O campo texto deve ser uma string",
  }),
})

const validateImage = joi.array().items(joi.object().required()).messages({
  "array.includesRequiredUnknowns": "Deve ser enviada pelo menos uma imagem.",
})

module.exports = { novaPostagemSchema, validateImage }
