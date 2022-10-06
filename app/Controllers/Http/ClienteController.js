"use strict";
const Cliente = use("App/Models/Cliente");

class ClienteController {
  async store({ request }) {
    const data = request.only([
      "nome",
      "email_primario",
      "email_secundario",
      "senha",
      "id_analista",
    ]);
    const cliente = await Cliente.create(data);
    return cliente;
  }
}

module.exports = ClienteController;
