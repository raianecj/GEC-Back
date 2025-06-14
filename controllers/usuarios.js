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
      { id: usuario.id, nome: usuario.nomeCompleto, tipo: 'usuario' },
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
      cpf: usuario.cpf,
      dataNascimento: usuario.dataNascimento,
      telefone: usuario.telefone,
      genero: usuario.genero,
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao obter perfil', erro: erro.message });
  }
};


const editarPerfil = async (req, res) => {
  const {
    nomeCompleto,
    telefone,
    email,
    cpf,
    dataNascimento,
    genero
  } = req.body;

  // Validar formato de CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
  }

  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Verifica se o novo e-mail já está em uso por outro usuário
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ mensagem: 'E-mail já está em uso por outro usuário' });
      }
    }

    // Verifica se o novo CPF é válido e único
    if (cpf && cpf !== usuario.cpf) {
      if (!validarCPF(cpf)) {
        return res.status(400).json({ mensagem: 'CPF inválido' });
      }

      const cpfExistente = await Usuario.findOne({ where: { cpf } });
      if (cpfExistente) {
        return res.status(400).json({ mensagem: 'CPF já está em uso por outro usuário' });
      }
    }

    // Atualizações
    usuario.nomeCompleto = nomeCompleto || usuario.nomeCompleto;
    usuario.telefone = telefone || usuario.telefone;
    usuario.email = email || usuario.email;
    usuario.cpf = cpf || usuario.cpf;
    usuario.dataNascimento = dataNascimento || usuario.dataNascimento;
    usuario.genero = genero || usuario.genero;

    await usuario.save();

    return res.status(200).json({
      mensagem: 'Perfil atualizado com sucesso',
      usuario: {
        id: usuario.id,
        nomeCompleto: usuario.nomeCompleto,
        telefone: usuario.telefone,
        email: usuario.email,
        cpf: usuario.cpf,
        dataNascimento: usuario.dataNascimento,
        genero: usuario.genero
      },
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao atualizar perfil', erro: erro.message });
  }
};


// Excluir perfil do usuário autenticado
const excluirPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    await usuario.destroy();

    return res.status(200).json({ mensagem: 'Conta excluída com sucesso' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao excluir conta', erro: erro.message });
  }
};


module.exports = { registrar, login, perfil, editarPerfil, excluirPerfil };
