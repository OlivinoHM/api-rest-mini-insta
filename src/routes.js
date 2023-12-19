const express = require("express")
const userController = require("./controller/userController")
const login = require("./controller/loginController")
const postagem = require("./controller/postagem")
const verificarLogin = require("./middleware/auth")
const validateRequestBody = require("./middleware/validateRequestBody")
const { registerUserSchema, updateUserSchema } = require("./schemas/userSchema")
const loginSchema = require("./schemas/schemaLogin")
const multer = require("./services/multer")
const novaPostagemSchema = require("./schemas/schemaPostagem")

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
  multer.array("file"),
  validateRequestBody(novaPostagemSchema),
  postagem.novaPostagem
)
rotas.get("/postagem", postagem.feed)
rotas.post("/postagem/:postagemId/curtir", postagem.curtir)
rotas.post("/postagem/:postagemId/comentar", postagem.comentar)

module.exports = rotas
