"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Setor extends Model {
  static get table() {
    return "setor";
  }

  static get hidden() {
    return ["created_at", "updated_at"];
  }
}

module.exports = Setor;
