"use strict";

import Hospitais from "../model/hospitais/Hospitais.js";

export default class CtrlHospitais {

  // Atributos do Controlador
  #daoHospitais; 
  #daoReserva; 
  #viewerHospitais; 
  #posAtual; 
  #status; 

  constructor() {
    this.#daoHospitais = new daoHospitais();
    this.#viewerHospitais = new viewerHospitais(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }


  async obterReservaDTOs() {
    return await this.#daoReserva.obterReservas(true);
  }

  async #atualizarContextoNavegacao() {
    this.#status = Status.NAVEGANDO;
    this.#viewerHospitais.statusApresentacao();

    let conjHospitais = await this.#daoHospitais.obterPacientes();

    if (conjHospitais.length == 0) {
      this.#posAtual = 0;
      this.#viewerHospitais.apresentar(0, 0, null);
    } else {
      if (this.#posAtual == 0 || this.#posAtual > conjHospitais.length)
        this.#posAtual = 1;
      this.#viewerHospitais.apresentar(
        this.#posAtual,
        conjHospitais.length,
        new hospitaisDTO(conjHospitais[this.#posAtual - 1])
      );
    }
  }

  async apresentarPrimeiro() {
    let conjHospitais = await this.#daoHospitais.obterPacientes(); ///
    if (conjHospitais.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }


  async apresentarProximo() {
    let conjHospitais = await this.#daoHospitais.obterPacientes(); 
    if (this.#posAtual < conjHospitais.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }


  async apresentarAnterior() {
    let conjHospitais = await this.#daoHospitais.obterPacientes(); 
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }


  async apresentarUltimo() {
    let conjHospitais = await this.#daoHospitais.obterPacientes(); 
    this.#posAtual = conjHospitais.length;
    this.#atualizarContextoNavegacao();
  }


  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewerHospitais.statusEdicao(Status.INCLUINDO);
    this.efetivar = this.incluir;
  }


  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerHospitais.statusEdicao(Status.ALTERANDO);
    this.efetivar = this.alterar;
  }


  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerHospitais.statusEdicao(Status.EXCLUINDO);
    this.efetivar = this.excluir;
  }

  async incluir(nome, endereco, telefone, id_hospital) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let hospital = new Hospitais(nome, endereco, telefone, id_hospital);
        await this.#daoHospitais.incluir(hospital);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  async alterar(nome, endereco, telefone, id_hospital) {
    if (this.#status == Status.ALTERANDO) {
      try {
        let hospital = await this.#daoHospitais.obterPacientePeloCpf(cpf);
        if (hospital == null) {
          alert("hospital com o cpf " + cpf + " não encontrado.");
        } else {
          hospital.setNome(nome);
          hospital.setEndereco(endereco);
          hospital.setTelefone(telefone);
          hospital.setId(id_hospital);
          await this.#daoHospitais.alterar(hospital);
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
        let hospital = await this.#daoHospitais.obterPacientePeloCpf(cpf);
        if (hospital == null) {
          alert("hospital com a cpf " + cpf + " não encontrado.");
        } else {
          await this.#daoHospitais.excluir(hospital);
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