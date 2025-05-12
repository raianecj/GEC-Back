// controllers/eventos.js
const { Eventos } = require('../models');

// Criar novo evento
const criarEvento = async (req, res) => {
  try {
    console.log(req.body)
    const { nome, descricao, dataEvento, horaEvento, inicioInscricoes, fimInscricoes, local, maxParticipantes, categorias, kits, bannerPrincipal, bannerMiniatura, status, organizadorId } = req.body;

    // Logando individualmente cada campo para ver se algum está errado
    console.log("nome:", nome);
    console.log("descricao:", descricao);
    console.log("dataEvento:", dataEvento);
    console.log("horaEvento:", horaEvento);
    console.log("inicioInscricoes:", inicioInscricoes);
    console.log("fimInscricoes:", fimInscricoes);
    console.log("local:", local);
    console.log("maxParticipantes:", maxParticipantes);
    console.log("categorias:", categorias);
    console.log("kits:", kits);
    console.log("bannerPrincipal:", bannerPrincipal);
    console.log("bannerMiniatura:", bannerMiniatura);
    console.log("status:", status);
    console.log("organizadorId:", organizadorId);

    // Verificando os campos obrigatórios
    if (!nome || !descricao || !dataEvento || !horaEvento || !inicioInscricoes || !fimInscricoes || !local || !maxParticipantes || !categorias || !kits || !bannerPrincipal || !bannerMiniatura || !status || !organizadorId) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const evento = await Eventos.create({ nome, descricao, dataEvento, horaEvento, inicioInscricoes, fimInscricoes, local, maxParticipantes, categorias, kits, bannerPrincipal, bannerMiniatura, status, organizadorId });
    return res.status(201).json(evento);
  } catch (erro) {
    console.error(erro); // Logando o erro para ver mais detalhes
    return res.status(500).json({ mensagem: 'Erro ao criar evento', erro: erro.message });
  }
};

// Listar todos os eventos
const listarEventos = async (req, res) => {
  try {
    const eventos = await Eventos.findAll();
    return res.status(200).json(eventos);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao listar eventos', erro: erro.message });
  }
};

// Obter evento por ID
const obterEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Eventos.findByPk(id);

    if (!evento) {
      return res.status(404).json({ mensagem: 'Evento não encontrado' });
    }

    return res.status(200).json(evento);
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao buscar evento', erro: erro.message });
  }
};

// Atualizar evento
const atualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const [quantidadeAtualizada] = await Eventos.update(req.body, { where: { id } });

    if (quantidadeAtualizada === 0) {
      return res.status(404).json({ mensagem: 'Evento não encontrado para atualização' });
    }

    const eventoAtualizado = await Eventos.findByPk(id);
    return res.status(200).json({
      mensagem: 'Evento atualizado com sucesso',
      evento: eventoAtualizado,
    });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao atualizar evento', erro: erro.message });
  }
};

// Excluir evento
const excluirEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const deletado = await Eventos.destroy({ where: { id } });

    if (!deletado) {
      return res.status(404).json({ mensagem: 'Evento não encontrado para exclusão' });
    }

    return res.status(200).json({ mensagem: 'Evento excluído com sucesso' });
  } catch (erro) {
    return res.status(500).json({ mensagem: 'Erro ao excluir evento', erro: erro.message });
  }
};

module.exports = { criarEvento, listarEventos, obterEvento, atualizarEvento, excluirEvento };
