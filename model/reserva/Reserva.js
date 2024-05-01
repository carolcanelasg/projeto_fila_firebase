import ModelError from "/model/ModelError.js";

export default class Reserva {
  
  //-----------------------------------------------------------------------------------------//
  
  constructor(nome_paciente, tipo_fila, data) {
    this.setNomePaciente(nome_paciente);
    this.setTipoFila(tipo_fila);
    this.setData(data)
  }

  //-----------------------------------------------------------------------------------------//

  getNomePaciente() {
    return this.nome_paciente;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNomePaciente(nome) {
    if(!Reserva.validarNome(nome))
      throw new ModelError("Nome Inválido: " + nome);
    this.nome_paciente = nome;
  }

  //-----------------------------------------------------------------------------------------//

  getTipoFila() {
    return this.tipo_fila;
  }

  //-----------------------------------------------------------------------------------------//

  setTipoFila(tipoFila) {
    if(!Reserva.validarTipoFila(tipoFila))
      throw new ModelError("Tipo Inválido: " + tipoFila);
    this.tipo_fila = tipoFila;
  }
  
  //-----------------------------------------------------------------------------------------//

  getData() {
    return this.data;
  }

  //-----------------------------------------------------------------------------------------//

  setData(data) {
    if(!Reserva.validarData(data))
      throw new ModelError("Data inválida: " + data);
    this.data = data;
  }
  
  //-----------------------------------------------------------------------------------------//

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      return false;
    if (nome.length > 40) 
      return false;
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome)) 
      return false;
    return true;
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

  static validarData(data) {
    if(data == null || data == "" || data == undefined)
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Nome do Paciente: " + this.nome_paciente + "\n";
    texto += "Tipo de Fila: " + this.tipo_fila + "\n";
    texto += "Data: " + this.data+ "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}