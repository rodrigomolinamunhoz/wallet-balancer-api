"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Carteira extends Model {
  static get table() {
    return "carteira";
  }
}

module.exports = Carteira;
