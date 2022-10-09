"use strict";
const Database = use("Database");

class SessionController {
  async store({ request, response, auth }) {
    try {
      const { email, senha, tipoAcesso } = request.all();

      let token = null;
      let user = null;

      if (tipoAcesso == 1) {
        token = await auth.authenticator("analista").attempt(email, senha);
        if (token != null) {
          user = await Database.table("analista").select("id", "nome").first();
        }
      } else if (tipoAcesso == 2) {
        token = await auth.authenticator("cliente").attempt(email, senha);
        if (token != null) {
          user = await Database.table("cliente").select("id", "nome").first();
        }
      }

      return { token, user };
    } catch {
      return response
        .status(401)
        .send({ error: { message: "Usuário ou senha incorretos!" } });
    }
  }
}

module.exports = SessionController;
