import ModelError from "/model/ModelError.js";
import Reserva from "/model/reserva/Reserva.js";

export default class ReservaDTO {
    
  //-----------------------------------------------------------------------------------------//

  // Atributos privados 
  #nome_paciente;
  #tipo_servico;
  #tipo_fila;
  #id_reserva;
  #data;
  
  constructor(reserva) {
    this.#nome_paciente = reserva.getNome();
    this.#tipo_servico = reserva.getTipoServico();
    this.#tipo_fila = reserva.getTipoFila();
    this.#id_reserva = reserva.getIdReserva();
    this.#data = reserva.getData();           
  }
  
  //-----------------------------------------------------------------------------------------//

  async getNomePaciente() {
    return await this.#nome_paciente;
  }

  //-----------------------------------------------------------------------------------------//

  async getTipoServico() {
    return this.#tipo_servico;
  }
  
  //-----------------------------------------------------------------------------------------//

  async getTipoFila() {
    return this.#tipo_fila;
  }

  //-----------------------------------------------------------------------------------------//

  getIdReserva() {
    return this.#id_reserva;
  }
  
  //-----------------------------------------------------------------------------------------//

  getData() {
    return this.#data;
  }
    
  //-----------------------------------------------------------------------------------------//
   
  toJSON() {
    return '{ ' +
      '"Paciente" : "' + this.#nome_paciente.getNome() + '",' 
      '"Serviço" : "' + this.#tipo_servico.getIdServico() + '",' 
      '"Fila" : "' + this.#tipo_fila.getTipoFila() + '",' 
      '"ID Reserva" : "' + this.#id_reserva + '",' 
      '"Data" : "' + this.#data + '"' 
      '}';
  }
}
