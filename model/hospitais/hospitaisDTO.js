import ModelError from "/model/ModelError.js";
import Hospitais from "/model/Hospitais.js";

export default class HospitalDTO {
    
  //-----------------------------------------------------------------------------------------//

  // Atributos privados 
  #id_hospital;
  #nome;
  #endereco;
  #telefone;  
  
  constructor(hospital) {
    this.#id_hospital = hospital.getIdHospital();
    this.#nome = hospital.getNome();
    this.#endereco = hospital.getEndereco();
    this.#telefone = hospital.getTelefone();           
  }
  
  //-----------------------------------------------------------------------------------------//

  getIdHospital() {
    return this.#id_hospital;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.#nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getEndereco() {
    return this.#endereco;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTelefone() {
    return this.#telefone;
  }
    
  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Nome: " + this.#nome + "\n";
    texto += "Endereço: " + this.#endereco + "\n";
    texto += "Telefone: " + this.#telefone + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}

