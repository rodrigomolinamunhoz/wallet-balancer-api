"use strict";
const Analista = use("App/Models/Analista");
const Cliente = use("App/Models/Cliente");
const Convite = use("App/Models/Convite");
const Mail = use("Mail");

class ConviteController {
  async convidar({ request, response }) {
    const { email, idAnalista } = request.all();

    const analista = await Analista.find(idAnalista);
    if (analista == null) {
      return response.status(500).send({ message: "Analista não encontrado!" });
    }

    const cliente = await Cliente.findBy("email_primario", email);
    if (cliente != null) {
      return response.status(500).send({ message: "Cliente já cadastrado!" });
    }

    const convite = await Convite.findBy("email", email, "ativo", 1);
    if (convite != null) {
      return response
        .status(500)
        .send({ message: "Já existe um convite ativo para este e-mail!" });
    }

    const codigo = Math.floor(Math.random() * 1000000);
    const conviteGerado = await Convite.create({
      codigo: codigo,
      email: email,
      id_analista: idAnalista,
      ativo: 1,
    });

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

    return { cliente, analista, convite, conviteGerado };
  }
}

module.exports = ConviteController;
