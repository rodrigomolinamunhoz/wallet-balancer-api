"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Acao extends Model {
  static get table() {
    return "acao";
  }

  static get hidden() {
    return ["created_at", "updated_at"];
  }
}

module.exports = Acao;
