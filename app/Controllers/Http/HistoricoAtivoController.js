"use strict";
const HistoricoAtivo = use("App/Models/HistoricoAtivo");

class HistoricoAtivoController {
  async list({ params }) {
    return await HistoricoAtivo.query()
      .where("cliente_id", params.cliente_id)
      .where("carteira_id", params.carteira_id)
      .fetch();
  }
}

module.exports = HistoricoAtivoController;
