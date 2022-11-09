"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Carteira extends Model {
  static get table() {
    return "carteira";
  }

  ativos() {
    return this.hasMany("App/Models/Ativo", "id", "carteira_id");
  }
}

module.exports = Carteira;
