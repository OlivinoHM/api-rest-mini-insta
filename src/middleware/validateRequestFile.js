const validateRequestFile = (joiSchema) => async (req, res, next) => {
  try {
    await joiSchema.validateAsync(req.files)
    next()
  } catch (error) {
    return res.status(400).json({ mensagem: error.message })
  }
}

module.exports = validateRequestFile
