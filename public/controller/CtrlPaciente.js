"use strict";

import Paciente from "../model/paciente/Paciente.js";
import DaoPaciente from "../model/paciente/DaoPaciente.js";
import ViewerPaciente from "../viewer/viewerPacientes.js";
import Status from "../model/status.js";
import DtoPaciente from "../model/paciente/pacienteDTO.js";

export default class CtrlPaciente {

  // Atributos do Controlador
  #daoPaciente; 
  #daoReserva; 
  #viewerPaciente; 
  #posAtual; 
  #status;


  constructor() {
    this.#daoPaciente = new DaoPaciente();
    this.#viewerPaciente = new ViewerPaciente(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }


  async obterReservaDTOs() {
    return await this.#daoReserva.obterReservas(true);
  }


  async #atualizarContextoNavegacao() {
    this.#status = Status.NAVEGANDO;
    this.#viewerPaciente.statusApresentacao();

    let conjpacientes = await this.#daoPaciente.obterPacientes();

    if (conjpacientes.length == 0) {
      this.#posAtual = 0;
      this.#viewerPaciente.apresentar(0, 0, null);
    } else {
      if (this.#posAtual == 0 || this.#posAtual > conjpacientes.length)
        this.#posAtual = 1;
      this.#viewerPaciente.apresentar(
        this.#posAtual,
        conjpacientes.length,
        new DtoPaciente(conjpacientes[this.#posAtual - 1])
      );
    }
  }

  async apresentarPrimeiro() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    if (conjpacientes.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async apresentarProximo() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    if (this.#posAtual < conjpacientes.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  async apresentarAnterior() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  async apresentarUltimo() {
    let conjpacientes = await this.#daoPaciente.obterPacientes();
    this.#posAtual = conjpacientes.length;
    this.#atualizarContextoNavegacao();
  }

  iniciarIncluir() {
    console.log("chamei aqui");
    this.#status = Status.INCLUINDO;
    this.#viewerPaciente.statusEdicao(Status.INCLUINDO);
    this.efetivar = this.incluir;
  }


  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerPaciente.statusEdicao(Status.ALTERANDO);
    this.efetivar = this.alterar;
  }


  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerPaciente.statusEdicao(Status.EXCLUINDO);
    this.efetivar = this.excluir;
  }

  async incluir(cpf, nome, email, telefone) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let paciente = new Paciente(cpf, nome, email, telefone);
        await this.#daoPaciente.incluir(paciente);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

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


  cancelar() {
    this.#atualizarContextoNavegacao();
  }


  getStatus() {
    return this.#status;
  }

}