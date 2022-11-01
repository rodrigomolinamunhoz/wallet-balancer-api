"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AtivoSchema extends Schema {
  up() {
    this.create("ativo", (table) => {
      table.increments();
      table.integer("quantidade").notNullable().defaultTo(0);
      table.integer("objetivo").notNullable();
      table.decimal("cotacao_atual").notNullable();
      table
        .integer("carteira_id")
        .unsigned()
        .references("id")
        .inTable("carteira");
      table.integer("acao_id").unsigned().references("id").inTable("acao");
      table
        .integer("cliente_id")
        .unsigned()
        .references("id")
        .inTable("cliente");
      table.timestamps();
    });
  }

  down() {
    this.drop("ativo");
  }
}

module.exports = AtivoSchema;
