"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SegmentoSchema extends Schema {
  up() {
    this.create("segmento", (table) => {
      table.increments();
      table.string("descricao", 100).notNullable();
      table
        .integer("subsetor_id")
        .unsigned()
        .references("id")
        .inTable("subsetor");
      table.timestamps();
    });
  }

  down() {
    this.drop("segmento");
  }
}

module.exports = SegmentoSchema;
