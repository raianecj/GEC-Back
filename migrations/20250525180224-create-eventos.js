'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Eventos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dataEvento: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      horaEvento: {
        type: Sequelize.TIME,
        allowNull: false
      },
      inicioInscricoes: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      fimInscricoes: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      local: {
        type: Sequelize.STRING,
        allowNull: false
      },
      maxParticipantes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      categorias: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      kits: {
        type: Sequelize.JSONB, // para armazenar [{nome: 'Kit Básico', valor: 50}, ...]
        allowNull: false
      },
      bannerPrincipal: {
        type: Sequelize.STRING, // URL ou caminho do arquivo
        allowNull: true
      },
      bannerMiniatura: {
        type: Sequelize.STRING,
        allowNull: true
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('Concluído', 'Em Andamento', 'Cancelado', 'Inativo'),
        allowNull: false,
        defaultValue: 'Inativo'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Eventos');
  }
};
