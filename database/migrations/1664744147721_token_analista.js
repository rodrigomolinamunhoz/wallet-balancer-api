"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TokenAnalistaSchema extends Schema {
  up() {
    this.create("tokens_analista", (table) => {
      table.increments();
      table
        .integer("analista_id")
        .unsigned()
        .references("id")
        .inTable("analista");
      table.string("token", 255).notNullable().unique().index();
      table.string("type", 80).notNullable();
      table.boolean("is_revoked").defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("tokens_analista");
  }
}

module.exports = TokenAnalistaSchema;
