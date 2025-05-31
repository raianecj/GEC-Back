'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inscricaos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventoId: {
        type: Sequelize.INTEGER
      },
      usuarioId: {
        type: Sequelize.INTEGER
      },
      categoria: {
        type: Sequelize.STRING
      },
      kit: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('Pendente', 'Confirmada', 'Cancelada')
      },
      dataInscricao: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Inscricaos');
  }
};