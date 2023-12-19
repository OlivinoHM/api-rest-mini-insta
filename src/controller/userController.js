const knex = require("../database/connection")
const bcrypt = require("bcrypt")
const storage = require("../services/storage")

const registerUser = async (req, res) => {
  const { nome, email, senha, username } = req.body

  try {
    const verificarUsuario = await knex("usuarios")
      .where({ email, username: username.trim() })
      .first()

    if (verificarUsuario)
      return res
        .status(400)
        .json({ message: "Email ou username informado já existe" })

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = await knex("usuarios")
      .insert({
        nome: nome.trim(),
        email,
        senha: senhaCriptografada,
        username: username.trim(),
      })
      .returning("*")

    return res.status(201).json(usuario[0])
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const getUser = async (req, res) => {
  return res.status(200).json(req.usuario)
}

const updateUser = async (req, res) => {
  const { nome, email, senha, imagem, username, site, bio, telefone, genero } =
    req.body
  const { originalname, mimetype, buffer } = req.file

  const { id } = req.usuario

  if (
    !nome &&
    !email &&
    !senha &&
    !imagem &&
    !username &&
    !site &&
    !bio &&
    !telefone &&
    !genero
  ) {
    return res
      .status(404)
      .json("É obrigatório informar ao menos um campo para atualização")
  }

  try {
    if (email != req.usuario.email) {
      const emailUsuarioExiste = await knex("usuarios").where({ email }).first()

      if (emailUsuarioExiste) {
        return res.status(404).json({ message: "O email já existe." })
      }
    }
    if (username != req.usuario.username) {
      const usernameUsuarioExistente = await knex("usuarios")
        .where({ username: username.trim() })
        .first()

      if (usernameUsuarioExistente) {
        return res.status(404).json({ message: "O Username já existe." })
      }
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    let usuarioAtualizado = await knex("usuarios")
      .where({ id })
      .update({
        nome: nome.trim(),
        email,
        senha: senhaCriptografada,
        username: username.trim(),
        site,
        bio,
        telefone,
        genero,
      })
      .returning("*")

    const imagem = await storage.uploadImagem(
      `perfil/${id}/${originalname}`,
      buffer,
      mimetype
    )

    usuarioAtualizado = await knex("usuarios")
      .update({
        imagem: imagem.path,
        url_imagem: imagem.url,
      })
      .where({ id })
      .returning("*")

    return res.status(200).json(usuarioAtualizado[0])
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  registerUser,
  getUser,
  updateUser,
}
