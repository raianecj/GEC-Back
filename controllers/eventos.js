const path = require('path');
const { Eventos, Inscricao, Pagamento } = require('../models');


const criarEvento = async (req, res) => {
  try {
    const {
      nome, descricao, dataEvento, horaEvento,
      inicioInscricoes, fimInscricoes, local,
      maxParticipantes, categorias, kits,
      status, organizadorId
    } = req.body;

    const bannerPrincipal = req.files?.bannerPrincipal?.[0]?.path;
    const bannerMiniatura = req.files?.bannerMiniatura?.[0]?.path;

    if (!nome || !descricao || !dataEvento || !horaEvento || !inicioInscricoes ||
        !fimInscricoes || !local || !maxParticipantes || !categorias ||
        !kits || !bannerPrincipal || !bannerMiniatura || !status || !organizadorId) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }
    const kitsValue = typeof kits === 'string' ? JSON.parse(kits) : kits;

    const evento = await Eventos.create({
  nome, descricao, dataEvento, horaEvento,
  inicioInscricoes, fimInscricoes, local,
  maxParticipantes,
  categorias: categorias.split(','),
  kits: kitsValue, 
  bannerPrincipal, bannerMiniatura,
  status, organizadorId
});


    return res.status(201).json(evento);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao criar evento', erro: erro.message });
  }
};


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


const atualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    //  Busca o evento existente
    const eventoExistente = await Eventos.findByPk(id);
    if (!eventoExistente) {
      return res.status(404).json({ mensagem: 'Evento não encontrado para atualização' });
    }


    let {
      nome,
      descricao,
      dataEvento,
      horaEvento,
      inicioInscricoes,
      fimInscricoes,
      local,
      maxParticipantes,
      categorias,
      kits,
      status,
      organizadorId
    } = req.body;

    //  Processa arquivos, se enviados
    const bannerPrincipal = req.files?.bannerPrincipal?.[0]?.path;
    const bannerMiniatura = req.files?.bannerMiniatura?.[0]?.path;

    //  Monta objeto com apenas os campos que vieram
    const dadosParaAtualizar = {};

    if (nome !== undefined) dadosParaAtualizar.nome = nome;
    if (descricao !== undefined) dadosParaAtualizar.descricao = descricao;
    if (dataEvento !== undefined) dadosParaAtualizar.dataEvento = dataEvento;
    if (horaEvento !== undefined) dadosParaAtualizar.horaEvento = horaEvento;
    if (inicioInscricoes !== undefined) dadosParaAtualizar.inicioInscricoes = inicioInscricoes;
    if (fimInscricoes !== undefined) dadosParaAtualizar.fimInscricoes = fimInscricoes;
    if (local !== undefined) dadosParaAtualizar.local = local;
    if (maxParticipantes !== undefined) dadosParaAtualizar.maxParticipantes = maxParticipantes;
    if (status !== undefined) dadosParaAtualizar.status = status;
    if (organizadorId !== undefined) dadosParaAtualizar.organizadorId = organizadorId;

    //  Se vier categoria, converte de string para array se necessário
    if (categorias !== undefined) {
      let categoriasArr = categorias;
      if (typeof categorias === 'string') {
        categoriasArr = categorias.split(',').map(s => s.trim());
      }
      dadosParaAtualizar.categorias = categoriasArr;
    }

    //  Se vier kits, converte de JSON string para array se necessário
    if (kits !== undefined) {
      dadosParaAtualizar.kits = typeof kits === 'string' ? JSON.parse(kits) : kits;
    }

    //  Se vierem novos arquivos, sobrescreve
    if (bannerPrincipal) dadosParaAtualizar.bannerPrincipal = bannerPrincipal;
    if (bannerMiniatura) dadosParaAtualizar.bannerMiniatura = bannerMiniatura;

    //  Executa a atualização parcial
    await eventoExistente.update(dadosParaAtualizar);

    return res.status(200).json({
      mensagem: 'Evento atualizado com sucesso',
      evento: eventoExistente,
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao atualizar evento', erro: erro.message });
  }
};


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

const obterResumoEvento = async (req, res) => {
  try {
    const { id: idEvento } = req.params; 

    const inscricoes = await Inscricao.findAll({
      where: { eventoId: idEvento },
      include: [
        {
          model: Pagamento,
          as: 'pagamento' 
        }
      ]
    });

    const totalInscritos = inscricoes.length;
    let totalPagos = 0;
    let totalPendentes = 0;
    let valorArrecadado = 0;
    let valorPendente = 0;

    inscricoes.forEach(inscricao => {
      const pagamento = inscricao.pagamento; 

      if (pagamento?.status === 'pago') {
        totalPagos++;
        valorArrecadado += parseFloat(pagamento.valor || 0);
      } else {
        totalPendentes++;
        valorPendente += parseFloat(pagamento?.valor || 0);
      }
    });

    return res.status(200).json({
      totalInscritos,
      totalPagos,
      totalPendentes,
      valorArrecadado,
      valorPendente,
    });

  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao obter resumo do evento', erro: erro.message });
  }
};


module.exports = { criarEvento, listarEventos, obterEvento, atualizarEvento, excluirEvento, obterResumoEvento };
