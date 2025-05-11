const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsuariosAdmin } = require('../models');

const loginAdmin = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios' });
  }

  try {
    const admin = await UsuariosAdmin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ mensagem: 'Administrador não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, admin.senha);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, tipo: 'admin' },
      process.env.JWT_SECRET || 'seu_segredo_admin',
      { expiresIn: '2h' }
    );

    return res.status(200).json({ token });

  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao fazer login', erro: erro.message });
  }
};

const registrarAdmin = async (req, res) => {
  const {
    nomeCompleto,
    email,
    cnpj,
    regiao,
    telefone,
    empresa,
    senha,
    confirmarSenha,
  } = req.body;

  if (
    !nomeCompleto || !email || !cnpj || !regiao ||
    !telefone || !empresa || !senha || !confirmarSenha
  ) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  if (senha !== confirmarSenha) {
    return res.status(400).json({ mensagem: 'As senhas não coincidem' });
  }

  try {
    const existente = await UsuariosAdmin.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ mensagem: 'Usuário já cadastrado' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await UsuariosAdmin.create({
       nomeCompleto,
    email,
    cnpj,
    regiao,
    telefone,
    empresa,
    senha: senhaCriptografada,
    });

    return res.status(201).json({ id: novoUsuario.id, nomeCompleto, email });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: erro.message });
  }
};

const perfilAdmin = async (req, res) => {
  try {
    const usuario = await UsuariosAdmin.findByPk(req.usuario.id);
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    return res.json({
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao obter perfil', erro: erro.message });
  }
};


module.exports = { loginAdmin, registrarAdmin, perfilAdmin };
