"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CarteiraSchema extends Schema {
  up() {
    this.create("carteira", (table) => {
      table.increments();
      table.string("nome", 100).notNullable();
      table
        .integer("id_cliente")
        .unsigned()
        .references("id")
        .inTable("cliente");
      table.timestamps();
    });
  }

  down() {
    this.drop("carteira");
  }
}

module.exports = CarteiraSchema;
