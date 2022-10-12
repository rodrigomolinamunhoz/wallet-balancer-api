"use strict";
const Analista = use("App/Models/Analista");
const Cliente = use("App/Models/Cliente");
const Convite = use("App/Models/Convite");
const Mail = use("Mail");
const Database = use("Database");

class ConviteController {
  async convidar({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      const { email, idAnalista } = request.all();

      const analista = await Analista.find(idAnalista, trx);
      if (analista == null) {
        return response
          .status(500)
          .send({ error: { message: "Analista não encontrado!" } });
      }

      const cliente = await Cliente.findBy("email_primario", email, trx);
      if (cliente != null) {
        return response
          .status(500)
          .send({ error: { message: "Cliente já cadastrado!" } });
      }

      const convite = await Convite.findBy("email", email, "ativo", 1, trx);
      if (convite != null) {
        return response.status(500).send({
          error: { message: "Já existe um convite ativo para este e-mail!" },
        });
      }

      const codigo = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
      await Convite.create(
        {
          codigo: codigo,
          email: email,
          id_analista: idAnalista,
          ativo: 1,
        },
        trx
      );

      await Mail.send(
        ["emails.template-convite"],
        { codigo, nomeAnalista: analista.nome },
        (message) => {
          message
            .to(email)
            .from("contato@walletbalancer.com.br", "Contato | Wallet Balancer")
            .subject("Convite | Wallet Balancer");
        }
      );
      trx.commit();
    } catch (error) {
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

module.exports = ConviteController;
