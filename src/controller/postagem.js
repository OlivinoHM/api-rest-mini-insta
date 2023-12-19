const knex = require("../database/connection")
const storage = require("../services/storage")

const novaPostagem = async (req, res) => {
  const { texto } = req.body
  const { files } = req
  const { id: idUsuario } = req.usuario

  // if (!texto) {
  //   return res.status(404).json({ message: "Campo texto é obrigatório." })
  // }
  // if (!files || files.length === 0) {
  //   return res
  //     .status(404)
  //     .json({ message: "É necessário ao menos uma imagem para postagem." })
  // }

  try {
    // const postagem = await knex("postagens")
    //   .insert({ texto, usuario_id: idUsuario })
    //   .returning("*")

    // if (!postagem) {
    //   return res
    //     .status(400)
    //     .json({ message: "Não foi possivel concluir a postagem." })
    // }

    // for (const file of files) {
    //   const imagem = await storage.uploadImagem(
    //     `postagens/${postagem[0].id}/${file.originalname}`,
    //     file.buffer,
    //     file.mimetype
    //   )
    //   imagem.postagem_id = postagem[0].id

    //   const imagensCadastradas = await knex("postagem_imagens")
    //     .insert({
    //       imagens: imagem.path,
    //       url_imagem: imagem.url,
    //       postagem_id: imagem.postagem_id,
    //     })
    //     .returning("*")

    //   if (!imagensCadastradas) {
    //     await knex("postagens").where({ id: postagem[0].id }).del()
    //     await storage.deletarArquivo(file)
    //     return res
    //       .status(400)
    //       .json({ message: "Não foi possivel concluir a postagem." })
    //   }
    // }

    return res.status(201).json({ message: "Postagem cadastrada com sucesso!" })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const curtir = async (req, res) => {
  const { id } = req.usuario
  const { postagemId } = req.params

  try {
    const postagemExiste = await knex("postagens")
      .where({
        id: postagemId,
      })
      .first()

    if (!postagemExiste) {
      return res.status(404).json({ message: "Postagem não encontrada." })
    }

    const jaCurtiu = await knex("postagem_curtidas").where({
      usuario_id: id,
      postagem_id: postagemId,
    })

    if (jaCurtiu.length > 0) {
      return res
        .status(404)
        .json({ message: "O usuário já curtiu essa postagem." })
    }

    const postagemCurtida = await knex("postagem_curtidas").insert({
      usuario_id: id,
      postagem_id: postagemId,
    })

    if (!postagemCurtida) {
      return res
        .status(400)
        .json({ message: "Não foi possível curtir essa postagem." })
    }

    return res.status(200).json({ message: "Postagem curtida com sucesso!" })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const comentar = async (req, res) => {
  const { id } = req.usuario
  const { postagemId } = req.params
  const { texto } = req.body

  if (!texto) {
    return res.status(404).json({ message: "o campo texto é obrigatório." })
  }

  try {
    const postagemExiste = await knex("postagens")
      .where({
        id: postagemId,
      })
      .first()

    if (!postagemExiste) {
      return res.status(404).json({ message: "Postagem não encontrada." })
    }

    const postagemComentada = await knex("postagem_comentarios").insert({
      usuario_id: id,
      postagem_id: postagemId,
      texto,
    })

    if (!postagemComentada) {
      return res
        .status(400)
        .json({ message: "Não foi possível comentar nessa postagem." })
    }

    return res.status(201).json({ message: "Postagem comentada com sucesso!" })
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

const feed = async (req, res) => {
  const { id } = req.usuario
  const { offset } = req.query

  const pg = offset ? offset : 0

  try {
    const postagens = await knex("postagens")
      .where("usuario_id", "!=", id)
      .limit(10)
      .offset(pg)

    if (postagens.length === 0) {
      return res.status(404).json({ message: "Não existe postagens." })
    }

    for (const postagem of postagens) {
      const usuario = await knex("usuarios")
        .where({ id: postagem.usuario_id })
        .select("imagem", "username")
        .first()
      postagem.usuario = usuario

      const fotos = await knex("postagem_imagens")
        .where({ postagem_id: postagem.id })
        .select("url_imagem")
      postagem.fotos = fotos

      const curtidas = await knex("postagem_curtidas")
        .where({ postagem_id: postagem.id })
        .select("usuario_id")
      postagem.curtidas = curtidas.length

      postagem.curtidasPorMim = curtidas.find(
        (curtida) => curtida.usuario_id === id
      )
        ? true
        : false

      const comentarios = await knex("postagem_comentarios")
        .join("usuarios", "postagem_comentarios.usuario_id", "=", "usuarios.id")
        .where("postagem_comentarios.postagem_id", postagem.id)
        .select("usuarios.username", "postagem_comentarios.texto")
      postagem.comentarios = comentarios
    }

    return res.status(200).json(postagens)
  } catch (error) {
    return res.status(400).json(error.message)
  }
}

module.exports = {
  novaPostagem,
  curtir,
  comentar,
  feed,
}
