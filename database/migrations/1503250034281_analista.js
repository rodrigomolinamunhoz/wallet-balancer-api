"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AnalistaSchema extends Schema {
  up() {
    this.create("analista", (table) => {
      table.increments();
      table.string("nome", 254).notNullable();
      table.string("email", 254).notNullable().unique();
      table.string("senha", 60).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("analista");
  }
}

module.exports = AnalistaSchema;
