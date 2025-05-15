'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Eventos extends Model {
    static associate(models) {
     
    }
  }

  Eventos.init(
    {
      nome: DataTypes.STRING,
      dataEvento: DataTypes.DATEONLY,
      horaEvento: DataTypes.TIME,
      inicioInscricoes: DataTypes.DATEONLY,
      fimInscricoes: DataTypes.DATEONLY,
      local: DataTypes.STRING,
      maxParticipantes: DataTypes.INTEGER,
      categorias: DataTypes.ARRAY(DataTypes.STRING),
        kits: DataTypes.JSONB,
      bannerPrincipal: DataTypes.STRING,
      bannerMiniatura: DataTypes.STRING,
      descricao: DataTypes.TEXT,
      status: DataTypes.ENUM('Concluído', 'Em Andamento', 'Cancelado', 'Inativo'),
    },
    {
      sequelize,
      modelName: 'Eventos',
      tableName: 'Eventos'
    }
  );

  return Eventos;
};
