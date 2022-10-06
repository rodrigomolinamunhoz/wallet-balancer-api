"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Convite extends Model {
  static get table() {
    return "convite";
  }
}

module.exports = Convite;
