'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable('Events', 'Eventos');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable('Eventos', 'Events');
  }
};
