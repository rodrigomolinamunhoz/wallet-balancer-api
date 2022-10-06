"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ConviteSchema extends Schema {
  up() {
    this.create("convite", (table) => {
      table.increments();
    });
  }
  up() {
    this.create("convite", (table) => {
      table.increments();
      table.integer("codigo").notNullable();
      table.string("email", 254).notNullable();
      table.boolean("ativo").notNullable();
      table
        .integer("id_analista")
        .unsigned()
        .references("id")
        .inTable("analista");
      table.timestamps();
    });
  }

  down() {
    this.drop("convite");
  }
}

module.exports = ConviteSchema;
