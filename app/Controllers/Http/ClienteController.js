"use strict";
const Cliente = use("App/Models/Cliente");
const Convite = use("App/Models/Convite");
const Database = use("Database");

class ClienteController {
  async store({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const { codigo, nome, emailPrimario, emailSecundario, senha } =
        request.all();

      const cliente = await Cliente.findBy(
        "email_primario",
        emailPrimario,
        trx
      );
      if (cliente != null) {
        return response
          .status(500)
          .send({ error: { message: "Cliente já cadastrado!" } });
      }

      const convite = await Convite.findBy({ codigo, ativo: 1 }, trx);
      if (convite == null) {
        return response
          .status(500)
          .send({ error: { message: "Código do convite inválido!" } });
      } else {
        convite.merge({ ativo: 0 });
        await convite.save(trx);
      }
      await Cliente.create(
        {
          nome: nome,
          email_primario: emailPrimario,
          email_secundario: emailSecundario,
          senha: senha,
          id_analista: convite.id_analista,
        },
        trx
      );

      trx.commit();
    } catch {
      await trx.rollback();
      return response.status(500).send({
        error: {
          message:
            "Ocorreu algum erro inesperado! Por favor, tente novamente mais tarde.",
        },
      });
    }
  }
}

module.exports = ClienteController;
