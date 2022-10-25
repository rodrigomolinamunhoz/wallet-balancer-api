"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SubsetorSchema extends Schema {
  up() {
    this.create("subsetor", (table) => {
      table.increments();
      table.string("descricao", 100).notNullable();
      table.integer("setor_id").unsigned().references("id").inTable("setor");
      table.timestamps();
    });
  }

  down() {
    this.drop("subsetor");
  }
}

module.exports = SubsetorSchema;
