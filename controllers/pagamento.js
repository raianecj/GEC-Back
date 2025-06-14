const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { Inscricao } = require('../models');
const { Pagamento } = require('../models');


const mercadopago = new MercadoPagoConfig({
  accessToken: 'APP_USR-8305709700848957-053108-d493354865938c5d0af68ffce00ba0ef-2471461120'
});

const criarPreferenciaPagamento = async (req, res) => {
  try {
    const { inscricaoId } = req.body;
    const usuarioId = req.usuario.id;

    const inscricao = await Inscricao.findOne({ where: { id: inscricaoId, usuarioId } });

    if (!inscricao) {
      return res.status(404).json({ mensagem: 'Inscrição não encontrada' });
    }

    const preference = {
      body: {
        items: [
          {
            title: `Inscrição Evento #${inscricao.eventoId}`,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: 89.90 
          }
        ],
        back_urls: {
          success: `https://0408-2804-8074-1203-7746-6d0d-7831-10cd-dfc1.ngrok-free.app/pagamento/sucesso?inscricaoId=${inscricao.id}`,
          failure: `https://0408-2804-8074-1203-7746-6d0d-7831-10cd-dfc1.ngrok-free.app/pagamento/erro?inscricaoId=${inscricao.id}`,
          pending: `https://0408-2804-8074-1203-7746-6d0d-7831-10cd-dfc1.ngrok-free.app/pagamento/pendente?inscricaoId=${inscricao.id}`
        },
        auto_return: "approved",
        notification_url: "https://0408-2804-8074-1203-7746-6d0d-7831-10cd-dfc1.ngrok-free.app/pagamento/webhook",
        metadata: {
          inscricao_id: inscricao.id
        }
      }
    };

    const response = await new Preference(mercadopago).create(preference);

    return res.status(200).json({ init_point: response.init_point });
  } catch (erro) {
    console.error('Erro ao criar preferência de pagamento:', erro);
    return res.status(500).json({ mensagem: 'Erro ao gerar preferência de pagamento' });
  }
};

const webhookPagamento = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      // Crie uma instância de Payment com a configuração
      const payment = new Payment(mercadopago);
      
      // Busca o pagamento pelo ID
      const response = await payment.get({ id: data.id });
      const pagamentoData = response;

      if (!pagamentoData) {
        console.error('Pagamento não encontrado ou resposta inválida do Mercado Pago');
        return res.sendStatus(400);
      }

      // Verifique se o metadata e inscricao_id existem
      const inscricaoId = pagamentoData.metadata?.inscricao_id || 
                         pagamentoData.additional_info?.items?.[0]?.id;

      if (pagamentoData.status === 'approved' && inscricaoId) {
        try {
          // Verifique se o modelo Pagamento está disponível
          if (!Pagamento) {
            throw new Error('Modelo Pagamento não foi carregado corretamente');
          }

          await Pagamento.create({
            inscricaoId,
            pagamentoId: pagamentoData.id,
            status: pagamentoData.status,
            valor: pagamentoData.transaction_amount,
            metodo: pagamentoData.payment_method_id
          });

          await Inscricao.update(
            { status: 'Confirmada' },
            { where: { id: inscricaoId } }
          );

          console.log(`Pagamento aprovado para inscrição ${inscricaoId}`);
        } catch (dbError) {
          console.error('Erro ao salvar no banco de dados:', dbError);
          throw dbError;
        }
      } else {
        console.warn('Pagamento recebido, mas status não é approved ou metadata ausente');
      }
    }

    return res.sendStatus(200);
  } catch (erro) {
    console.error('Erro no webhook de pagamento:', erro);
    return res.sendStatus(500);
  }
};

const listarPagamentos = async (req, res) => {
  try {
    const pagamentos = await Pagamento.findAll({
      include: {
        model: Inscricao,
        as: 'inscricao', // <-- esse alias precisa ser o mesmo definido na associação
        attributes: ['eventoId', 'usuarioId']
      }
    });

    return res.status(200).json(pagamentos);
  } catch (erro) {
    console.error('Erro ao listar pagamentos:', erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar pagamentos' });
  }
};



module.exports = { criarPreferenciaPagamento,webhookPagamento, listarPagamentos };
