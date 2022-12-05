"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class HistoricoAtivo extends Model {
  static get table() {
    return "historico_ativo";
  }

  acao() {
    return this.hasOne("App/Models/Acao", "acao_id", "id");
  }

  static get hidden() {
    return ["created_at"];
  }
}

module.exports = HistoricoAtivo;
