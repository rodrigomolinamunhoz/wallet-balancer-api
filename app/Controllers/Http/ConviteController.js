"use strict";
const Analista = use("App/Models/Analista");
const Cliente = use("App/Models/Cliente");
const Convite = use("App/Models/Convite");
const Mail = use("Mail");

class ConviteController {
  async convidar({ request, response }) {
    const { email, idAnalista } = request.all();

    const analista = await Analista.find(idAnalista);
    console.log(analista);

    //regras:
    //cliente = pesquisar cliente na tabela cliente se existir, barrar.
    const cliente = await Cliente.findBy("email_primario", email);
    console.log(cliente);

    //convite = se existir alguma convite ativo para esse email, barrar
    const convite = await Convite.findBy("email", email, "ativo", 1);

    const codigo = Math.floor(Math.random() * 1000000);

    const conviteGerado = await Convite.create({
      codigo: codigo,
      email: email,
      id_analista: idAnalista,
      ativo: 1,
    });

    console.log(conviteGerado);

    await Mail.send(
      ["emails.template-convite"],
      { codigo, nomeAnalista: analista.nome },
      (message) => {
        message
          .to(email)
          .from("rodrigomunhoz1995@gmail.com", "Rodrigo Molina")
          .subject("Convite | Wallet Balancer");
      }
    );

    return { cliente, analista, convite, conviteGerado };
  }
}

module.exports = ConviteController;
