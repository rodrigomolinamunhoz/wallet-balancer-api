"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class HistoricoAtivoSchema extends Schema {
  up() {
    this.create("historico_ativo", (table) => {
      table.increments();
      table.integer("acao_id").unsigned().references("id").inTable("acao");
      table.integer("tipo_compra").notNullable();
      table.integer("quantidade").notNullable();
      table
        .integer("carteira_id")
        .unsigned()
        .references("id")
        .inTable("carteira");
      table
        .integer("cliente_id")
        .unsigned()
        .references("id")
        .inTable("cliente");
      table.timestamps();
    });
  }

  down() {
    this.drop("historico_ativo");
  }
}

module.exports = HistoricoAtivoSchema;
