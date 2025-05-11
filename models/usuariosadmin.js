'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuariosAdmin extends Model {
    static associate(models) {
      // define associações se necessário
    }
  }
  UsuariosAdmin.init({
    nomeCompleto: DataTypes.STRING,
    email: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    regiao: DataTypes.STRING,
    telefone: DataTypes.STRING,
    empresa: DataTypes.STRING,
    senha: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UsuariosAdmin',
    tableName: 'UsuariosAdmin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });
  return UsuariosAdmin;
};
