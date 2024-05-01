import ModelError from "/model/ModelError.js";

export default class Paciente {
    
  //-----------------------------------------------------------------------------------------//

  constructor(cpf, nome, email, telefone) {
    this.setCpf(cpf);
    this.setNome(nome);
    this.setEmail(email);
    this.setTelefone(telefone);    
  }
  
  //-----------------------------------------------------------------------------------------//

  getCpf() {
    return this.cpf;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCpf(cpf) {
    if(!Paciente.validarCpf(cpf))
      throw new ModelError("CPF Inválido: " + cpf);
    this.cpf = cpf;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Paciente.validarNome(nome))
      throw new ModelError("Nome Inválido: " + nome);
    this.nome = nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getEmail() {
    return this.email;
  }
  
  //-----------------------------------------------------------------------------------------//

  setEmail(email) {
    if(!Paciente.validarEmail(email))
      throw new ModelError("Email inválido: " + email);
    this.email = email;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTelefone() {
    return this.telefone;
  }
  
  //-----------------------------------------------------------------------------------------//

  setTelefone(telefone) {
    if(!Paciente.validarTelefone(telefone))
      throw new ModelError("Telefone inválido: " + telefone);
    this.telefone = telefone;
  }

  //-----------------------------------------------------------------------------------------//

  static validarCpf(strCpf) {
    let soma;
    let resto;
    let i;

    soma = 0;
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace(".", "");
    strCpf = strCpf.replace("-", "");

    if (strCpf == "00000000000") return false;

    for (i = 1; i <= 9; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(9, 10))) return false;

    soma = 0;
    for (i = 1; i <= 10; i++)
      soma = soma + parseInt(strCpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if (resto == 10 || resto == 11) resto = 0;
    if (resto != parseInt(strCpf.substring(10, 11))) return false;
    return true;
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

  static validarEmail(email) {
    if(email == null || email == "" || email == undefined)
      return false;

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email)) 
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

  mostrar() {
    let texto = "CPF: " + this.cpf + "\n";
    texto += "Nome: " + this.nome + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}