"use strict";
const Ativo = use("App/Models/Ativo");

class AtivoController {
  async createupdate({ params, request, response }) {
    try {
      var data = request.input("ativos");

      if (data.length === 0) {
        return response.status(500).send({
          error: { message: "Ativo(s) obrigatório(s)!" },
        });
      }

      const soma = data
        .filter((a) => a.tipo_cadastro !== "R")
        .map((a) => a.objetivo)
        .reduce((accumulator, value) => {
          return accumulator + value;
        }, 0);

      if (soma != 100) {
        return response.status(500).send({
          error: { message: "A soma dos objetivos da carteira deve ser 100%." },
        });
      }

      const ativosRemover = data.filter((d) => d.tipo_cadastro === "R");
      const ativosNovos = data.filter((d) => d.tipo_cadastro === "N");
      const ativosEditar = data.filter((d) => d.tipo_cadastro === "E");

      if (ativosRemover.length > 0) {
        ativosRemover.forEach(async (a) => {
          const ativo = await Ativo.find(a.id);
          if (ativo != null) {
            await ativo.delete();
          }
        });
      }

      if (ativosNovos.length > 0) {
        if (this.validarAtivoRepetido(ativosNovos)) {
          return response.status(500).send({
            error: { message: "Não é permitido cadastrar dois ativos iguais!" },
          });
        }

        // if (await this.validarAtivoExistente(params.id, ativosNovos)) {
        //   return response.status(500).send({
        //     error: { message: "Não é permitido cadastrar ativos iguais!" },
        //   });
        // }

        await this.create(ativosNovos);
      }

      if (ativosEditar.length > 0) {
        if (this.validarAtivoRepetido(ativosEditar)) {
          return response.status(500).send({
            error: { message: "Não é permitido cadastrar dois ativos iguais!" },
          });
        }

        await this.update(ativosEditar);
      }
    } catch (error) {
      return response.status(500).send({
        error: {
          message:
            "Ocorreu algum erro inesperado! Por favor, tente novamente mais tarde.",
        },
      });
    }
  }

  validarAtivoRepetido(ativos) {
    var valueArr = ativos.map(function (item) {
      return item.acao_id;
    });
    return valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) != idx;
    });
  }

  async validarAtivoExistente(carteira_id, ativos) {
    var ativosExistentes = await Ativo.query()
      .where("carteira_id", carteira_id)
      .fetch();
    ativosExistentes = ativosExistentes.toJSON();
    var encontrou = false;
    if (ativosExistentes.length > 0) {
      ativosExistentes.forEach((ae) => {
        ativos.forEach((d) => {
          if (ae.acao_id === d.acao_id) {
            encontrou = true;
          }
        });
      });
    }

    return encontrou;
  }

  async update(ativos) {
    ativos.forEach(async (a) => {
      var ativo = await Ativo.findOrFail(a.id);
      ativo.merge({ cotacao_atual: a.cotacao_atual, objetivo: a.objetivo });
      await ativo.save();
    });
  }

  async create(ativos) {
    ativos.forEach(async (a) => {
      await Ativo.create({
        acao_id: a.acao_id,
        objetivo: a.objetivo,
        cotacao_atual: a.cotacao_atual,
        carteira_id: a.carteira_id,
        cliente_id: a.cliente_id,
      });
    });
  }

  async list({ params }) {
    return await Ativo.query()
      .with("acao")
      .where("carteira_id", params.carteira_id)
      .where("cliente_id", params.cliente_id)
      .fetch();
  }

  async delete(ativos) {
    ativos.forEach(async (a) => {
      const ativo = await Ativo.find(a.id);
      if (ativo != null) {
        if (ativo.quantidade > 0) {
          return response.status(500).send({
            error: {
              message:
                "Você possui uma quantidade de ações para este ativo. Zere sua posição para poder excluí-lo!",
            },
          });
        }
        await ativo.delete();
      }
    });
  }
}

module.exports = AtivoController;
