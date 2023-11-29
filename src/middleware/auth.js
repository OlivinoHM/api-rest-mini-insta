const jwt = require("jsonwebtoken");
const knex = require("../database/connection");
const senhaHash = require("../passwordHash");

const verificarLogin = async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) return res.status(401).json({ menssagem: "Não autorizado." });

	const token = authorization.split(" ")[1];

	try {
		const { id } = jwt.verify(token, senhaHash);

		const usuarioExiste = await knex("usuarios").where({ id }).first();

		if (!usuarioExiste) return res.suatus(404).json("Token inválido");

		const { senha, ...usuario } = usuarioExiste;

		req.usuario = usuario;

		next();
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

module.exports = verificarLogin;
