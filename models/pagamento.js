'use strict';

module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define('Pagamento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    inscricaoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Inscricaos', // nome da tabela do model Inscricao
        key: 'id'
      }
    },
    pagamentoId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    metodo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Pagamentos'
  });

  Pagamento.associate = function(models) {
    Pagamento.belongsTo(models.Inscricao, {
      foreignKey: 'inscricaoId',
      as: 'inscricao'
    });
  };

  return Pagamento;
};
