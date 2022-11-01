"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Segmento extends Model {
  static get table() {
    return "segmento";
  }

  subsetor() {
    return this.hasOne("App/Models/Subsetor", "subsetor_id", "id");
  }

  static get hidden() {
    return ["created_at", "updated_at"];
  }
}

module.exports = Segmento;
