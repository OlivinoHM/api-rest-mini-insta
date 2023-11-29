CREATE DATABASE pdv;

CREATE TABLE users (
	ID SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL
);

CREATE TABLE categorias (
	ID SERIAL PRIMARY KEY,
  descricao TEXT
);