"use strict";
const Carteira = use("App/Models/Carteira");
const Ativo = use("App/Models/Ativo");
const HistoricoAtivo = use("App/Models/HistoricoAtivo");

class CarteiraController {
  async create({ request }) {
    const data = request.only(["nome", "id_cliente"]);

    const carteira = await Carteira.create(data);

    return carteira;
  }

  async show({ params }) {
    const carteira = await Carteira.find(params.id);

    return carteira;
  }

  async update({ params, request }) {
    const carteira = await Carteira.findOrFail(params.id);
    const data = request.only(["nome", "id_cliente"]);

    carteira.merge(data);
    await carteira.save();

    return carteira;
  }

  async delete({ params }) {
    await Ativo.query().where("carteira_id", params.id).delete();
    await HistoricoAtivo.query().where("carteira_id", params.id).delete();
    await Carteira.query().where("id", params.id).delete();
  }

  async list({ params, request }) {
    const { page } = request.get();

    const carteiras = await Carteira.query()
      .where("id_cliente", params.id)
      .paginate(page);

    return carteiras;
  }
}

module.exports = CarteiraController;
