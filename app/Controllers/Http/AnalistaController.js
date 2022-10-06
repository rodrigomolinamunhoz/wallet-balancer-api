"use strict";

const Analista = use("App/Models/Analista");

class AnalistaController {
  async store({ request }) {
    const data = request.only(["nome", "email", "senha"]);
    const analista = await Analista.create(data);
    return analista;
  }
}

module.exports = AnalistaController;
