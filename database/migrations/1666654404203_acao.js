"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AcaoSchema extends Schema {
  up() {
    this.create("acao", (table) => {
      table.increments();
      table.string("codigo", 6).notNullable();
      table
        .integer("segmento_id")
        .unsigned()
        .references("id")
        .inTable("segmento");
      table.timestamps();
    });
  }

  down() {
    this.drop("acao");
  }
}

module.exports = AcaoSchema;
