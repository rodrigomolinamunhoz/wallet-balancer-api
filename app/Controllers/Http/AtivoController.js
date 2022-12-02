"use strict";
const Ativo = use("App/Models/Ativo");
const Acao = use("App/Models/Acao");
const HistoricoAtivo = use("App/Models/HistoricoAtivo");
const Database = use("Database");

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

  async buysale({ request, response }) {
    const trx = await Database.beginTransaction();
    try {
      var data = request.input("ativos");
      var erroQuantidade = { erro: false, acao: 0 };

      if (data.length === 0) {
        return response.status(500).send({
          error: { message: "Ativo(s) obrigatório(s)!" },
        });
      }

      for (let i = 0; i < data.length; i++) {
        var ativo = await Ativo.find(data[i].ativo_id, trx);
        if (data[i].tipo_compra === 2) {
          if (data[i].quantidade > ativo.quantidade) {
            erroQuantidade = { erro: true, acao_id: ativo.acao_id };
            break;
          }
        }
      }

      if (erroQuantidade.erro) {
        var acao = await Acao.find(erroQuantidade.acao_id, trx);
        return response.status(500).send({
          error: {
            message: `Não é permitido vender uma quantidade maior que a existente na ação ${acao.codigo}!`,
          },
        });
      }

      for (let i = 0; i < data.length; i++) {
        var ativo = await Ativo.find(data[i].ativo_id, trx);
        if (data[i].tipo_compra === 1) {
          ativo.merge({ quantidade: ativo.quantidade + data[i].quantidade });
          await ativo.save();
        } else {
          ativo.merge({ quantidade: ativo.quantidade - data[i].quantidade });
          await ativo.save();
        }
      }

      data.forEach(async (a) => {
        await HistoricoAtivo.create({
          acao_id: a.acao_id,
          tipo_compra: a.tipo_compra,
          quantidade: a.quantidade,
          carteira_id: a.carteira_id,
          cliente_id: a.cliente_id,
        });
      });

      trx.commit();
    } catch (error) {
      await trx.rollback();
      return response.status(500).send({
        error: error,
      });
    }
  }

  async listBalancer({ params }) {
    const ativos = await Database.select(
      "ativo.id",
      "ativo.acao_id",
      "acao.codigo as codigo_acao",
      "setor.id as setor_id",
      "setor.descricao as descricao_setor",
      "ativo.quantidade",
      "ativo.cotacao_atual",
      "ativo.objetivo",
      "ativo.cliente_id",
      "ativo.carteira_id"
    )
      .table("ativo")
      .innerJoin("acao", "acao.id", "ativo.acao_id")
      .innerJoin("segmento", "segmento.id", "acao.segmento_id")
      .innerJoin("subsetor", "subsetor.id", "segmento.subsetor_id")
      .innerJoin("setor", "setor.id", "subsetor.setor_id")
      .where("ativo.carteira_id", params.carteira_id)
      .where("ativo.cliente_id", params.cliente_id)
      .orderBy("ativo.id");

    const soma = ativos
      .map((a) => a.quantidade * a.cotacao_atual)
      .reduce((accumulator, value) => {
        return accumulator + value;
      }, 0);

    ativos.map((element) => {
      element.patrimonio = element.quantidade * element.cotacao_atual;
      element.participacao_atual = (100 * element.patrimonio) / soma;
      element.distancia_objetivo =
        element.objetivo - element.participacao_atual;
      return ativos;
    });

    return { patrimonio: soma, ativos: ativos };
  }
}

module.exports = AtivoController;
