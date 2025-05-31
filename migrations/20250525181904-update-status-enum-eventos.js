'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Eventos_status"
      ADD VALUE IF NOT EXISTS 'Esgotado';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Eventos_status"
      ADD VALUE IF NOT EXISTS 'Em Breve';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
