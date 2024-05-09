import ModelError from "/model/ModelError.js";
import Fila from "/model/fila/Fila.js";

export default class FilaDTO {
  //-----------------------------------------------------------------------------------------//

  // Atributos privados
  #tipo_fila;
  #id_fila;
  #tempo_medio;
  #servico;

  constructor(fila) {
    this.#tipo_fila = fila.getTipoFila();
    this.#id_fila = fila.getIdFila();
    this.#tempo_medio = fila.getTempoMedio();
    this.#servico=fila.getServico()
  }

  //-----------------------------------------------------------------------------------------//

  getTipoFila() {
    return this.#tipo_fila;
  }

  //-----------------------------------------------------------------------------------------//

  getIdFila() {
    return this.#id_fila;
  }

  //-----------------------------------------------------------------------------------------//

  getTempoMedio() {
    return this.#tempo_medio;
  }

  //-----------------------------------------------------------------------------------------//

  async getServico() {
    return await this.#servico;
  }

  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{ ' +
      '"Tipo de Fila" : "' + this.#tipo_fila + '",' 
      '"ID da Fila" : "' + this.#id_fila + '",' 
      '"Tempo Médio" : "' + this.#tempo_medio + '",' 
      '"Serviço" : "' + this.#servico.getNomeServico() + '"' 
      '}';
  }
}
