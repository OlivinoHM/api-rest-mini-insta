const knex = require("../database/connection")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
  const { username, senha } = req.body

  if (!username || !senha)
    return res.status(400).json({ menssage: "É obrigatório username e senha" })

  try {
    const usuario = await knex("usuarios")
      .where({ username: username.trim() })
      .first()

    if (!usuario)
      return res
        .status(404)
        .json({ menssage: "Username e/ou senha não confere(m)." })

    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida)
      return res
        .status(400)
        .json({ menssage: "Username e/ou senha não confere(m)." })

    const dadosTokenUsuario = {
      id: usuario.id,
      username: usuario.username,
    }

    const token = jwt.sign(dadosTokenUsuario, process.env.PASS_HASH, {
      expiresIn: "8h",
    })

    const { senha: _, ...dadosUsuario } = usuario

    return res.status(200).json({ usuario: dadosUsuario, token })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  login,
}
