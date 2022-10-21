"use strict";
const Database = use("Database");
const Analista = use("App/Models/Analista");
const Cliente = use("App/Models/Cliente");

class SessionController {
  async store({ request, response, auth }) {
    try {
      const { email, senha, tipoAcesso } = request.all();

      let token = null;
      let user = null;

      if (tipoAcesso == 1) {
        token = await auth.authenticator("analista").attempt(email, senha);
        if (token != null) {
          user = await Analista.findBy("email", email);
        }
      } else if (tipoAcesso == 2) {
        token = await auth.authenticator("cliente").attempt(email, senha);
        if (token != null) {
          user = await Cliente.findBy("email_primario", email);
        }
      }

      return { token, user: { id: user.id, nome: user.nome } };
    } catch {
      return response
        .status(401)
        .send({ error: { message: "Usuário ou senha incorretos!" } });
    }
  }
}

module.exports = SessionController;
