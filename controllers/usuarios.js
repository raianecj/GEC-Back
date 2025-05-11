const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const registrar = async (req, res) => {
  const {
    nomeCompleto,
    email,
    cpf,
    dataNascimento,
    telefone,
    genero,
    senha,
    confirmarSenha,
  } = req.body;

  if (
    !nomeCompleto || !email || !cpf || !dataNascimento ||
    !telefone || !genero || !senha || !confirmarSenha
  ) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  if (senha !== confirmarSenha) {
    return res.status(400).json({ mensagem: 'As senhas não coincidem' });
  }

  try {
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ mensagem: 'Usuário já cadastrado' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await Usuario.create({
      nomeCompleto,
      email,
      cpf,
      dataNascimento,
      telefone,
      genero,
      senha: senhaCriptografada,
    });

    return res.status(201).json({ id: novoUsuario.id, nomeCompleto, email });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: erro.message });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Senha incorreta' });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nomeCompleto },
      process.env.JWT_SECRET || 'seu_segredo',
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao fazer login', erro: erro.message });
  }
};

const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    return res.json({
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao obter perfil', erro: erro.message });
  }
};

module.exports = { registrar, login, perfil };
