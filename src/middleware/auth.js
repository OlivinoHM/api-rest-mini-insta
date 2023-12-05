const jwt = require("jsonwebtoken")
const knex = require("../database/connection")

const verificarLogin = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization)
    return res.status(401).json({ message: "Não autorizado." })

  const token = authorization.split(" ")[1]

  try {
    const { id } = jwt.verify(token, process.env.PASS_HASH)

    const usuarioExiste = await knex("usuarios").where({ id }).first()

    if (!usuarioExiste)
      return res.suatus(404).json({ message: "Token inválido" })

    const { senha, ...usuario } = usuarioExiste

    req.usuario = usuario

    next()
  } catch (error) {
    console.log()
    return res.status(400).json(error.message)
  }
}

module.exports = verificarLogin
