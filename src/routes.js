const express = require("express")
const userController = require("./controller/userController")
const login = require("./controller/loginController")
const postagem = require("./controller/postagem")
const verificarLogin = require("./middleware/auth")
const validateRequestBody = require("./middleware/validateRequestBody")
const { registerUserSchema, updateUserSchema } = require("./schemas/userSchema")
const loginSchema = require("./schemas/schemaLogin")
const multer = require("./services/multer")
const {
  novaPostagemSchema,
  validateImage,
} = require("./schemas/schemaPostagem")
const validateRequestFile = require("./middleware/validateRequestFile")

const rotas = express()

rotas.post(
  "/usuario",
  validateRequestBody(registerUserSchema),
  userController.registerUser
)

rotas.post("/login", validateRequestBody(loginSchema), login.login)

rotas.use(verificarLogin)

rotas.get("/usuario", userController.getUser)
rotas.put(
  "/usuario",
  validateRequestBody(updateUserSchema),
  multer.single("imagem"),
  userController.updateUser
)

rotas.post(
  "/postagem",
  multer.array("imagens"),
  validateRequestBody(novaPostagemSchema),
  validateRequestFile(validateImage),
  postagem.novaPostagem
)
rotas.get("/postagem", postagem.feed)
rotas.delete("/postagem/:id", postagem.deletePost)
rotas.post("/postagem/:postagemId/curtir", postagem.curtir)
rotas.post("/postagem/:postagemId/comentar", postagem.comentar)

module.exports = rotas
