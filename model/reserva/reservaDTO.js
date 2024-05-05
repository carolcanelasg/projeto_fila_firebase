import ModelError from "/model/ModelError.js";
import Reserva from "/model/Reserva.js";

export default class ReservaDTO {
    
  //-----------------------------------------------------------------------------------------//

  // Atributos privados 
  #nome_paciente;
  #tipo_fila;
  #data;
  
  constructor(reserva) {
    this.#nome_paciente = reserva.getNome();
    this.#tipo_fila = reserva.getTipoFila();
    this.#data = reserva.getData();           
  }
  
  //-----------------------------------------------------------------------------------------//

  getNomePaciente() {
    return this.#nome_paciente;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTipoFila() {
    return this.#tipo_fila;
  }
  
  //-----------------------------------------------------------------------------------------//

  getData() {
    return this.#data;
  }
    
  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Nome do Paciente: " + this.#nome_paciente + "\n";
    texto += "Tipo de Fila: " + this.#tipo_fila + "\n";
    texto += "Data: " + this.#data +"\n";
      
    alert(texto);
    alert(JSON.stringify(this));
    }
}
