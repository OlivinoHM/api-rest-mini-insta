const knex = require("../database/connection");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
	const { username, email, senha } = req.body;

	if (!username) {
		return res.status(404).json("O campo username é obrigatório");
	}

	if (!senha) {
		return res.status(404).json("O campo senha é obrigatório");
	}

	if (senha.length < 5) return res.status(404).json("A senha deve conter no mínimo 5 caracteres.");

	try {
		const quantidadeUsuarios = await knex("usuarios").where({ username }).first();
		console.log(username, email, senha);

		if (quantidadeUsuarios) return res.status(400).json("O username informado já esxiste");

		const senhaCriptografada = await bcrypt.hash(senha, 10);

		const usuario = await knex("usuarios").insert({ username, senha: senhaCriptografada });

		if (!usuario) {
			return res.status(400).json("O usuário não foi cadastrado.");
		}

		return res.status(200).json("O usuario foi cadastrado com sucesso!");
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

const getUser = async (req, res) => {
	return res.status(200).json(req.usuario);
};

const updateUser = async (req, res) => {
	const { nome, email, senha, imagem, username, site, bio, telefone, genero } = req.body;

	const { id } = req.usuario;

	if (!nome && !email && !senha && !imagem && !username && !site && !bio && !telefone && !genero) {
		return res.status(404).json("É obrigatório informar ao menos um campo para atualização");
	}

	try {
		if (senha) {
			if (senha.length < 5) {
				return res.status(404).json("A senha deve conter no minimo 5 caracteres.");
			}
		}

		if (email != req.usuario.email) {
			const emailUsuarioExiste = await knex("usuarios").where({ email }).first();

			if (emailUsuarioExiste) {
				return res.status(404).json("O email já existe.");
			}
		}
		if (username == req.usuario.username) {
			const usernameUsuarioExistente = await knex("usuarios").where({ username }).first();

			if (usernameUsuarioExistente) {
				return res.status(404).json("O Username já existe.");
			}
		}

		const usuarioAtualizado = await knex("usuarios").where({ id }).update({ nome, email, senha, imagem, username, site, bio, telefone, genero });

		if (!usuarioAtualizado) return res.status(400).json("O usuario não foi atualizado.");

		return res.status(200).json("Usuario foi atualizado com sucesso.");
	} catch (error) {
		return res.status(400).json(error.message);
	}
};

module.exports = {
	registerUser,
	getUser,
	updateUser
};
