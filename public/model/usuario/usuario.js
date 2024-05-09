import ModelError from "/model/ModelError.js";

//static get INABILITADO() { return "INABILITADO" };

export default class Usuario {
  //
  // Atributos privados da classe Usuario
  //
  #email;
  #uid;
  #funcao;

  //-----------------------------------------------------------------------------------------//

  constructor(email, uid, funcao) {
    this.setEmail(email);
    this.setUid(uid);
    if (funcao === undefined || funcao === null) this.setFuncao("INABILITADO");
    else this.setFuncao(funcao);
  }

  //-----------------------------------------------------------------------------------------//

  getEmail() {
    return this.#email;
  }

  //-----------------------------------------------------------------------------------------//

  setEmail(email) {
    if (!Usuario.validarEmail(email))
      throw new ModelError("Email inválido: " + email);
    this.#email = email;
  }

  //-----------------------------------------------------------------------------------------//

  getUid() {
    return this.#uid;
  }

  //-----------------------------------------------------------------------------------------//

  setUid(uid) {
    if (!Usuario.validarUid(uid)) throw new ModelError("UID inválido: " + uid);
    this.#uid = uid;
  }

  //-----------------------------------------------------------------------------------------//

  getFuncao() {
    return this.#funcao;
  }

  //-----------------------------------------------------------------------------------------//

  setFuncao(funcao) {
    if (!Usuario.validarFuncao(funcao))
      throw new ModelError("Função inválida: " + funcao);
    this.#funcao = funcao;
  }

  //-----------------------------------------------------------------------------------------//

  static validarEmail(email) {
    if (email == null || email == "" || email == undefined) return false;

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email)) return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarUid(uid) {
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarFuncao(funcao) {
    if (funcao != "ADMIN" && funcao != "PACIENTE" && funcao != "INABILITADO")
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  mostrar() {
    let texto = "Email: " + this.#email + "\n";
    texto += "UID: " + this.#uid + "\n";
    texto += "Função: " + this.#funcao + "\n";

    alert(texto);
    alert(JSON.stringify(this));
  }
}
