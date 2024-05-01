import ModelError from "/model/ModelError.js";

export default class Fila {
    
  //-----------------------------------------------------------------------------------------//

  constructor(tipo_fila, id_fila, tempo_medio) {
    this.setTipoFila(tipo_fila);
    this.setIdFila(id_fila);
    this.setTempoMedio(tempo_medio);
  }
  
  //-----------------------------------------------------------------------------------------//

  getTipoFila() {
    return this.tipo_fila;
  }

  //-----------------------------------------------------------------------------------------//

  setTipoFila(tipoFila) {
    if(!Fila.validarTipoFila(tipoFila))
      throw new ModelError("Tipo Inválido: " + tipoFila);
    this.tipo_fila = tipoFila;
  }
  
  //-----------------------------------------------------------------------------------------//

  getId() {
    return this.id;
  }

  //-----------------------------------------------------------------------------------------//

  setId(id) {
    if(!Fila.validarId(id))
      throw new ModelError("ID Inválido: " + id);
    this.id_fila = id;
  }

  //-----------------------------------------------------------------------------------------//

  getTempoMedio() {
    return this.tempo_medio;
  }

  //-----------------------------------------------------------------------------------------//

  setTempoMedio(tempoMedio) {
    if(!Fila.validarTempo(tempoMedio))
      throw new ModelError("Telefone inválido: " + tempoMedio);
    this.tempo_medio = tempoMedio;
  }
  
  //-----------------------------------------------------------------------------------------//

  static validarTipoFila(tipoFila) {
    if(tipoFila == null || tipoFila == "" || tipoFila == undefined)
      return false;
    if (tipoFila.length > 40) 
      return false;
    const padraoTipoFila = /[A-Z][a-z] */;
    if (!padraoTipoFila.test(tipoFila)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
   
  static validarTempo(tempoMedio) {
    if(tempoMedio == null || tempoMedio == "" || tempoMedio == undefined)
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarId(idFila) {
    if(idFila == null || idFila == "" || idFila == undefined)
      return false;
    const padraoID = /[0-5]/;
    if (!padraoID.test(idFila))
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Tipo de fila: " + this.tipo_fila + "\n";
    texto += "ID Fila: " + this.id_fila + "\n";
    texto += "Tempo Médio: " + this.tempo_medio + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}