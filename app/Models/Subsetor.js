"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Subsetor extends Model {
  static get table() {
    return "subsetor";
  }

  static get hidden() {
    return ["created_at", "updated_at"];
  }
}

module.exports = Subsetor;
