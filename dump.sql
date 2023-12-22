CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  username TEXT NOT NULL,
  imagem TEXT,
  site TEXT,
  bio TEXT,
  telefone TEXT,
  genero TEXT,
  url_imagem TEXT
);

CREATE TABLE postagens (
	id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  texto TEXT
);

CREATE TABLE postagem_imagens (
	id SERIAL PRIMARY KEY,
  postagem_id INTEGER REFERENCES postagens(id),
  imagens TEXT NOT NULL,
  url_imagem TEXT
);

CREATE TABLE postagem_curtidas (
	usuario_id INTEGER REFERENCES usuarios(id),
  postagem_id INTEGER REFERENCES postagens(id),
  data TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE postagem_comentarios (
	usuario_id INTEGER REFERENCES usuarios(id),
  postagem_id INTEGER REFERENCES postagens(id),
  texto TEXT,
  data TIMESTAMPTZ DEFAULT NOW()
);