import ModelError from "/model/ModelError.js";
import Servico from "/model/Servico.js";

export default class ReservaDTO {

  // Atributos privados 
  #nome_servico;
  #quantidade_atendimento;
  #id_servico;
  
  constructor(reserva) {
    this.#nome_servico = reserva.getNomeServico();
    this.#quantidade_atendimento = reserva.getQuantidadeAtendimento();
    this.#id_servico = reserva.getIdServico();
  }

  getNomeServico() {
    return this.#nome_servico;
  }

  getQuantidadeAtendimento() {
    return this.#quantidade_atendimento;
  }

  getIdServico() {
    return this.#id_servico;
  } 
   
  mostrar() {
    let texto = "Nome do Serviço: " + this.#nome_servico + "\n";
    texto += "Quantidade de atendimento: " + this.#quantidade_atendimento + "\n";
    texto += "Id do Serviço: " + this.#id_servico +"\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}