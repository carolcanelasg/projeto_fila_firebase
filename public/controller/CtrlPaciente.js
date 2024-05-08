"use strict";

import Paciente from "../model/paciente/Paciente.js";
import DaoPaciente from "../model/paciente/DaoPaciente.js";
import viewerPaciente from "../viewer/viewerPacientes.js";

export default class CtrlPaciente {
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #daoPaciente; // Referência para o Data Access Object para o Store de pacientes
  #daoReserva; // Referência para o Data Access Object para o Store de Cursos
  #viewerPaciente; // Referência para o gerenciador do viewerPaciente
  #posAtual; // Indica a posição do objeto paciente que estiver sendo apresentado
  #status; // Indica o que o controlador está fazendo

  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#daoPaciente = new DaoPaciente();
    this.#viewerPaciente = new viewerPaciente(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async obterReservaDTOs() {
    return await this.#daoReserva.obterReservas(true);
  }

  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewerPaciente que ele está apresentando dos dados
    this.#viewerPaciente.statusApresentacao();

    // Solicita ao DAO que dê a lista de todos os pacientes presentes na base
    let conjpacientes = await this.#daoPaciente.obterPacientes();

    // Se a lista de pacientes estiver vazia
    if (conjpacientes.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;

      // Informo ao viewerPaciente que não deve apresentar nada
      this.#viewerPaciente.apresentar(0, 0, null);
    } else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if (this.#posAtual == 0 || this.#posAtual > conjpacientes.length)
        this.#posAtual = 1;
      // Peço ao viewerPaciente que apresente o objeto da posição atual
      this.#viewerPaciente.apresentar(
        this.#posAtual,
        conjpacientes.length,
        new pacienteDTO(conjpacientes[this.#posAtual - 1])
      );
    }
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    if (conjpacientes.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    if (this.#posAtual < conjpacientes.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    this.#posAtual = conjpacientes.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  iniciarIncluir() {
    console.log("chamei aqui");
    this.#status = Status.INCLUINDO;
    this.#viewerPaciente.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir (ou seja,
    // a CALLBACK da ação é o método incluir. Preciso disso, pois o viewerPaciente mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerPaciente.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método alterar (ou seja,
    // a CALLBACK da ação é o método alterar. Preciso disso, pois o viewerPaciente mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//

  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerPaciente.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método excluir (ou seja,
    // a CALLBACK da ação é o método excluir. Preciso disso, pois o viewerPaciente mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(cpf, nome, email, telefone) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let paciente = new paciente(cpf, nome, email, telefone);
        await this.#daoPaciente.incluir(paciente);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(cpf, nome, email, telefone) {
    if (this.#status == Status.ALTERANDO) {
      try {
        let paciente = await this.#daoPaciente.obterPacientePeloCpf(cpf);
        if (paciente == null) {
          alert("paciente com o cpf " + cpf + " não encontrado.");
        } else {
          paciente.setCpf(cpf);
          paciente.setNome(nome);
          paciente.setEmail(email);
          paciente.setTelefone(telefone);
          await this.#daoPaciente.alterar(paciente);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(cpf) {
    if (this.#status == Status.EXCLUINDO) {
      try {
        let paciente = await this.#daoPaciente.obterPacientePeloCpf(cpf);
        if (paciente == null) {
          alert("paciente com a cpf " + cpf + " não encontrado.");
        } else {
          await this.#daoPaciente.excluir(paciente);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//
