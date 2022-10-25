"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SetorSchema extends Schema {
  up() {
    this.create("setor", (table) => {
      table.increments();
      table.string("descricao", 100).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("setor");
  }
}

module.exports = SetorSchema;
