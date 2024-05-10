import ModelError from "../ModelError.js";

export default class Servico {

  constructor(nome_servico, quantidade_atendimento, id_servico) {
    this.setNomeServico(nome_servico);
    this.setQuantidadeAtendimento(quantidade_atendimento);
    this.setIdServico(id_servico);
  }

  getNomeServico() {
    return this.nome_servico;
  }

  setNomeServico(nome) {
    if (!Servico.validarNome(nome))
      throw new ModelError("Nome de Serviço Inválido: " + nome);
    this.nome_servico = nome;
  }

  getQuantidadeAtendimento() {
    return this.quantidade_atendimento;
  }

  setQuantidadeAtendimento(quantidade) {
    if (!Servico.validarQuantidadeAtendimento(quantidade))
      throw new ModelError("Quantidade de Atendimento inválida: " + quantidade);
    this.quantidade_atendimento = quantidade;
  }

  getIdServico() {
    return this.id_servico;
  }

  setIdServico(id) {
    if (!Servico.validarId(id))
      throw new ModelError("ID de Serviço Inválido: " + id);
    this.id_servico = id;
  }

  static validarNome(nome) {
    if (nome == null || nome == "" || nome == undefined) return false;
    if (nome.length > 40) return false;
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome)) return false;
    return true;
  }

  static validarQuantidadeAtendimento(quantidade) {
    if (quantidade == null || quantidade == "" || quantidade == undefined)
      return false;
    return true;
  }

  static validarId(idServico) {
    if (idServico == null || idServico == "" || idServico == undefined)
      return false;
    const padraoID = /[0-5]/;
    if (!padraoID.test(idServico)) return false;
    return true;
  }

  mostrar() {
    let texto = "Nome do Serviço: " + this.nome_servico + "\n";
    texto += "Quantidade de Atendimento: " + this.quantidade_atendimento + "\n";
    texto += "Id do Serviço: " + this.id_servico + "\n";

    alert(texto);
    alert(JSON.stringify(this));
  }
}