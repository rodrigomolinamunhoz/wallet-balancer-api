"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TokenClienteSchema extends Schema {
  up() {
    this.create("tokens_cliente", (table) => {
      table.increments();
      table
        .integer("cliente_id")
        .unsigned()
        .references("id")
        .inTable("cliente");
      table.string("token", 255).notNullable().unique().index();
      table.string("type", 80).notNullable();
      table.boolean("is_revoked").defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("tokens_cliente");
  }
}

module.exports = TokenClienteSchema;
