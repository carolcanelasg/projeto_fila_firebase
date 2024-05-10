import ModelError from "../ModelError.js";
import Paciente from "../paciente/Paciente.js";

export default class PacienteDTO {

  // Atributos privados
  #cpf;
  #nome;
  #email;
  #telefone;

  constructor(paciente) {
    this.#cpf = paciente.getCpf();
    this.#nome = paciente.getNome();
    this.#email = paciente.getEmail();
    this.#telefone = paciente.getTelefone();
  }

  getCpf() {
    return this.#cpf;
  }

  getNome() {
    return this.#nome;
  }

  getEmail() {
    return this.#email;
  }

  getTelefone() {
    return this.#telefone;
  }

  mostrar() {
    let texto = "CPF: " + this.#cpf + "\n";
    texto += "Nome: " + this.#nome + "\n";
    texto += "Email: " + this.#email + "\n";
    texto += "Telefone: " + this.#telefone + "\n";

    alert(texto);
    alert(JSON.stringify(this));
  }
}