"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Ativo extends Model {
  static get table() {
    return "ativo";
  }

  acao() {
    return this.hasOne("App/Models/Acao", "acao_id", "id");
  }

  static get hidden() {
    return ["created_at", "updated_at"];
  }
}

module.exports = Ativo;
