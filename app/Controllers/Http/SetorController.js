"use strict";
const Setor = use("App/Models/Setor");

class SetorController {
  async list() {
    return await Setor.all();
  }
}

module.exports = SetorController;
