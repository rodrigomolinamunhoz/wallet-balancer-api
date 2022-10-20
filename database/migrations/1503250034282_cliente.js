"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ClienteSchema extends Schema {
  up() {
    this.create("cliente", (table) => {
      table.increments();
      table.string("nome", 254).notNullable();
      table.string("email_primario", 254).notNullable();
      table.string("email_secundario", 254).notNullable();
      table.string("senha", 60).notNullable();
      table
        .integer("id_analista")
        .unsigned()
        .references("id")
        .inTable("analista");
      table.timestamps();
    });
  }

  down() {
    this.drop("analista");
  }
}

module.exports = ClienteSchema;
