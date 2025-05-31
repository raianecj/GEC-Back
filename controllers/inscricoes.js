// controllers/inscricoes.js
const { Inscricao, Eventos, Usuario } = require('../models');

const inscreverUsuario = async (req, res) => {
  try {
    const { eventoId, categoria, kit } = req.body;
    const usuarioId = req.usuario.id; // PEGANDO O ID DO TOKEN

    if (!eventoId || !categoria || !kit) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const evento = await Eventos.findByPk(eventoId);
    const usuario = await Usuario.findByPk(usuarioId);

    if (!evento || !usuario) {
      return res.status(404).json({ mensagem: 'Evento ou usuário não encontrado' });
    }

    const inscricaoExistente = await Inscricao.findOne({
      where: { eventoId, usuarioId }
    });

    if (inscricaoExistente) {
      return res.status(409).json({ mensagem: 'Usuário já está inscrito neste evento' });
    }

    const inscricao = await Inscricao.create({
      eventoId,
      usuarioId,
      categoria,
      kit,
      status: 'Pendente',
      dataInscricao: new Date(),
    });

    return res.status(201).json({ mensagem: 'Inscrição realizada com sucesso', inscricao });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao realizar inscrição', erro: erro.message });
  }
};

// ===== Nova função: listar todas as inscrições do usuário =====
const listarInscricoes = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    const inscricoes = await Inscricao.findAll({
      where: { usuarioId },
      include: [
        {
          model: Eventos,
          attributes: ['nome', 'dataEvento', 'horaEvento'],
        }
      ],
      order: [['dataInscricao', 'DESC']],
    });

    const inscricoesFormatadas = inscricoes.map((inscricao) => {
      const dataInscricao = new Date(inscricao.dataInscricao);
      const dataEvento = new Date(inscricao.Evento.dataEvento);

      return {
        id: inscricao.id,
        dataInscricao: dataInscricao.toLocaleDateString('pt-BR'),
        horarioInscricao: dataInscricao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        eventoNome: inscricao.Evento.nome,
        dataEvento: dataEvento.toLocaleDateString('pt-BR'),
        horarioEvento: inscricao.Evento.horaEvento?.slice(0, 5),
        status: inscricao.status,
        valor: inscricao.valor ? inscricao.valor.toFixed(2).replace('.', ',') : '89,90', // valor mock
        formaPagamento: inscricao.formaPagamento || 'Pix' // forma mock
      };
    });

    return res.json(inscricoesFormatadas);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao listar inscrições', erro: erro.message });
  }
};


// ===== Nova função: ver detalhes de uma inscrição específica =====
const verInscricao = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const inscricaoId = req.params.id;

    const inscricao = await Inscricao.findOne({
      where: { id: inscricaoId, usuarioId },
      include: [
        {
          model: Eventos,
          attributes: ['nome', 'dataEvento', 'horaEvento'],
        }
      ],
    });

    if (!inscricao) {
      return res.status(404).json({ mensagem: 'Inscrição não encontrada' });
    }

    const dataInscricao = new Date(inscricao.dataInscricao);
    const dataEvento = new Date(inscricao.Evento.dataEvento);

    const inscricaoFormatada = {
      id: inscricao.id,
      dataInscricao: dataInscricao.toLocaleDateString('pt-BR'),
      horarioInscricao: dataInscricao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      eventoNome: inscricao.Evento.nome,
      dataEvento: dataEvento.toLocaleDateString('pt-BR'),
      horarioEvento: inscricao.Evento.horaEvento?.slice(0, 5),
      status: inscricao.status,
      valor: inscricao.valor ? inscricao.valor.toFixed(2).replace('.', ',') : '89,90', // mock
      formaPagamento: inscricao.formaPagamento || 'Pix' // mock
    };

    return res.json(inscricaoFormatada);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar inscrição', erro: erro.message });
  }
};


module.exports = {
  inscreverUsuario,
  listarInscricoes,
  verInscricao,
};
