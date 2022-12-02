"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class HistoricoAtivo extends Model {
  static get table() {
    return "historico_ativo";
  }
}

module.exports = HistoricoAtivo;
