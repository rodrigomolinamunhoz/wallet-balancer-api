"use strict";
const Database = use("Database");

class AcaoController {
  async list() {
    return await Database.select(
      "acao.id as idAcao",
      "acao.codigo as codigoAcao",
      "segmento.id as idSegmento",
      "segmento.descricao as descricaoSegmento",
      "subsetor.id as idSubsetor",
      "subsetor.descricao as descricaoSubsetor",
      "setor.id as idSetor",
      "setor.descricao as descricaoSetor"
    )
      .table("acao")
      .innerJoin("segmento", "segmento.id", "acao.segmento_id")
      .innerJoin("subsetor", "subsetor.id", "segmento.subsetor_id")
      .innerJoin("setor", "setor.id", "subsetor.setor_id")
      .orderBy("acao.id");
  }
}

module.exports = AcaoController;
