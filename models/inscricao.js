'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inscricao extends Model {
    static associate(models) {
      Inscricao.belongsTo(models.Eventos, { foreignKey: 'eventoId' });
      Inscricao.belongsTo(models.Usuario, { foreignKey: 'usuarioId' });
      Inscricao.hasOne(models.Pagamento, { foreignKey: 'inscricaoId', as: 'pagamento' });
    }
  }
  Inscricao.init(
    {
      eventoId: DataTypes.INTEGER,
      usuarioId: DataTypes.INTEGER,
      categoria: DataTypes.STRING,
      kit: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM,
        values: ['Pendente', 'Confirmada', 'Cancelada'],
        defaultValue: 'Pendente'
      },
      dataInscricao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: 'Inscricao',
    }
  );
  return Inscricao;
};
