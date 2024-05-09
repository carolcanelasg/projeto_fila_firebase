import ModelError from "/model/ModelError.js";

export default class Reserva {
  
  //-----------------------------------------------------------------------------------------//
  
  constructor(nome_paciente, tipo_servico, tipo_fila, hospital, id_reserva, data) {
    this.setNomePaciente(nome_paciente);
    this.setTipoServico(tipo_servico);
    this.setTipoFila(tipo_fila);
    this,setHospital(hospital);
    this.setIdReserva(id_reserva);
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

  getTipoServico(){
    return this.tipo_servico;
  }

  //-----------------------------------------------------------------------------------------//

  setTipoServico(tipo_servico) {
    if(!Reserva.validarTipoServico(tipo_servico))
      throw new ModelError("Serviço inválido: " + tipo_servico);
    this.tipo_servico = tipo_servico;
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

  getHospital() {
    return this.hospital;
  }

  //-----------------------------------------------------------------------------------------//

  setHospital(hospital) {
    if(!Reserva.validarHospital(hospital))
      throw new ModelError("Hospital inválido: " + hospital);
    this.hospital = hospital;
  }

  //-----------------------------------------------------------------------------------------//

  getIdReserva() {
    return this.id_reserva;
  }

  //-----------------------------------------------------------------------------------------//

  setIdReserva(id_reserva) {
    if(!Reserva.validarIdReserva(id_reserva))
      throw new ModelError("ID inválido: " + id_reserva);
    this.id_reserva = id_reserva;
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

  static validarNome(nome_paciente) {
    if(nome_paciente == null || nome_paciente == undefined)
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarTipoServico(tipo_servico) {
    if(tipo_servico == null || tipo_servico == undefined)
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarTipoFila(tipo_fila) {
    if(tipo_fila == null || tipo_fila == undefined)
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarId(id_reserva) {
    if (id_reserva == null || id_reserva == "" || id_reserva == undefined)
      return false;
    const padraoID = /[0-5]/;
    if (!padraoID.test(id_reserva)) return false;
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
    texto += "ID Reserva: " + this.id_reserva + "\n";
    texto += "Data: " + this.data+ "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}