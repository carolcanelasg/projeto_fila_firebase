import ModelError from "/model/ModelError.js";

export default class Hospitais {
    
  //-----------------------------------------------------------------------------------------//

  constructor(nome, endereco, telefone, id_hospital) {
    this.setNome(nome);
    this.setEndereco(endereco);
    this.setTelefone(telefone);
    this.setId(id_hospital);
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.nome;
  }

  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Hospitais.validarNome(nome))
      throw new ModelError("Nome Inválido: " + nome);
    this.nome = nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getEndereco() {
    return this.endereco;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  setEndereco(endereco) {
    if(!Hospitais.validarEndereco(endereco))
      throw new ModelError("Endereço inválido: " + endereco);
    this.endereco = endereco;
  }

  //-----------------------------------------------------------------------------------------//

  getTelefone() {
    return this.telefone;
  }

  //-----------------------------------------------------------------------------------------//

  setTelefone(telefone) {
    if(!Hospitais.validarTelefone(telefone))
      throw new ModelError("Telefone inválido: " + telefone);
    this.telefone = telefone;
  }
  
  //-----------------------------------------------------------------------------------------//

  getId() {
    return this.id_hospital;
  }
  
  //-----------------------------------------------------------------------------------------//

  setId(idHospital) {
    if(!Hospitais.validarId(idHospital))
      throw new ModelError("ID Inválido: " + idHospital);
    this.id_hospital = idHospital;
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
   
  static validarEndereco(endereco) {
    if(endereco == null || endereco == undefined)
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarTelefone(telefone) {
    if(telefone == null || telefone == "" || telefone == undefined)
      return false;

    const padraoTelefone = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
    if (!padraoTelefone.test(telefone)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarId(idHospital) {
    if(idHospital == null || idHospital == "" || idHospital == undefined)
      return false;
    const padraoID = /[0-5]/;
    if (!padraoID.test(idHospital))
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  mostrar() {
    let texto = "ID: " + this.id_hospital + "\n";
    texto += "Nome: " + this.nome + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}