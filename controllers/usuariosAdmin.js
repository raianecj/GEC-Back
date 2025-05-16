//scontrollers/usuariosAdmin.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UsuariosAdmin } = require('../models');

// Função para validar CNPJ simples
function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;
  return true;
}

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

    return res.status(200).json({
  token,
  admin: {
    id: admin.id,
    nomeCompleto: admin.nomeCompleto,
    email: admin.email
  }
});


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
      id:usuario.id,
      nomeCompleto: usuario.nomeCompleto,
      email: usuario.email,
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao obter perfil', erro: erro.message });
  }
};

const editarPerfilAdmin = async (req, res) => {
  const {
    nomeCompleto,
    telefone,
    email,
    cnpj,
    regiao,
    empresa
  } = req.body;

  try {
    const admin = await UsuariosAdmin.findByPk(req.usuario.id);
    if (!admin) return res.status(404).json({ mensagem: 'Administrador não encontrado' });

    if (email && email !== admin.email) {
      const emailExistente = await UsuariosAdmin.findOne({ where: { email } });
      if (emailExistente) return res.status(400).json({ mensagem: 'E-mail já está em uso' });
    }

    if (cnpj && cnpj !== admin.cnpj) {
      if (!validarCNPJ(cnpj)) return res.status(400).json({ mensagem: 'CNPJ inválido' });

      const cnpjExistente = await UsuariosAdmin.findOne({ where: { cnpj } });
      if (cnpjExistente) return res.status(400).json({ mensagem: 'CNPJ já está em uso' });
    }

    admin.nomeCompleto = nomeCompleto || admin.nomeCompleto;
    admin.telefone = telefone || admin.telefone;
    admin.email = email || admin.email;
    admin.cnpj = cnpj || admin.cnpj;
    admin.regiao = regiao || admin.regiao;
    admin.empresa = empresa || admin.empresa;

    await admin.save();

    return res.status(200).json({ mensagem: 'Perfil atualizado com sucesso',
      admin: {
        id: admin.id,
        nomeCompleto: admin.nomeCompleto,
        telefone: admin.telefone,
        email: admin.email,
        cnpj: admin.cnpj,
        regiao: admin.regiao,
        empresa: admin.empresa
      },
     });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao editar perfil', erro: erro.message });
  }
};

const excluirPerfilAdmin = async (req, res) => {
  try {
    const admin = await UsuariosAdmin.findByPk(req.usuario.id);
    if (!admin) return res.status(404).json({ mensagem: 'Administrador não encontrado' });

    await admin.destroy();
    return res.status(200).json({ mensagem: 'Perfil excluído com sucesso' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao excluir perfil', erro: erro.message });
  }
};

module.exports = { loginAdmin, registrarAdmin, perfilAdmin, editarPerfilAdmin, excluirPerfilAdmin };
