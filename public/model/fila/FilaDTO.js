import ModelError from "/model/ModelError.js";
import Fila from "/model/Fila.js";

export default class FilaDTO {

  // Atributos privados
  #tipo_fila;
  #id_fila;
  #tempo_medio;

  constructor(fila) {
    this.#tipo_fila = fila.getTipoFila();
    this.#id_fila = fila.getIdFila();
    this.#tempo_medio = fila.getTempoMedio();
  }

  getTipoFila() {
    return this.#tipo_fila;
  }

  getIdFila() {
    return this.#id_fila;
  }

  getTempoMedio() {
    return this.#tempo_medio;
  }

  mostrar() {
    let texto = "Tipo de Fila: " + this.#tipo_fila + "\n";
    texto += "Tempo Médio: " + this.#tempo_medio + "\n";
    texto += "ID da Fila: " + this.#id_fila + "\n";

    alert(texto);
    alert(JSON.stringify(this));
  }
}
