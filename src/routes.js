const express = require("express");
const userController = require("./controller/userController");
const login = require("./controller/loginController");
const auth = require("./middleware/auth");

const rotas = express();

rotas.post("/usuario", userController.registerUser);

rotas.post("/login", login.login);

rotas.get("/usuario", userController.getUser);
rotas.put("/usuario", userController.updateUser);

module.exports = rotas;
