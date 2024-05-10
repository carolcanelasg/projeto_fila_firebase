"use strict";

import Servico from "../model/servico/Servico.js";

export default class CtrlServico {

  // Atributos do Controlador
  #daoServico; 
  #daoReserva;
  #viewerServico; 
  #posAtual; 
  #status;

  constructor() {
    this.#daoServico = new daoServico();
    this.#viewerServico = new viewerServico(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async obterReservaDTOs() {
    return await this.#daoReserva.obterReservas(true);
  }

  async #atualizarContextoNavegacao() {
    this.#status = Status.NAVEGANDO;
    this.#viewerServico.statusApresentacao();

    let conjServicos = await this.#daoServico.obterServicos();

    if (conjServicos.length == 0) {
      this.#posAtual = 0;

      this.#viewerServico.apresentar(0, 0, null);
    } else {
      if (this.#posAtual == 0 || this.#posAtual > conjServicos.length)
        this.#posAtual = 1;
      this.#viewerServico.apresentar(
        this.#posAtual,
        conjServicos.length,
        new ServicoDTO(conjServicos[this.#posAtual - 1])
      );
    }
  }

  async apresentarPrimeiro() {
    let conjServicos = await this.#daoServico.obterServicos(); 
    if (conjServicos.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async apresentarProximo() {
    let conjServicos = await this.#daoServico.obterServicos(); 
    if (this.#posAtual < conjServicos.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  async apresentarAnterior() {
    let conjServicos = await this.#daoServico.obterServicos(); 
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  async apresentarUltimo() {
    let conjServicos = await this.#daoServico.obterServicos(); 
    this.#posAtual = conjServicos.length;
    this.#atualizarContextoNavegacao();
  }

  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewerServico.statusEdicao(Status.INCLUINDO);
    this.efetivar = this.incluir;
  }

  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerServico.statusEdicao(Status.ALTERANDO);
    this.efetivar = this.alterar;
  }

  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerServico.statusEdicao(Status.EXCLUINDO);
    this.efetivar = this.excluir;
  }

  async incluir(nome_servico, quantidade_atendimento, id_servico) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let servico = new servico(
          nome_servico,
          quantidade_atendimento,
          id_servico
        );
        await this.#daoServico.incluir(servico);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  async alterar(nome_servico, quantidade_atendimento, id_servico) {
    if (this.#status == Status.ALTERANDO) {
      try {
        let servico = await this.#daoServico.obterServicoPeloId(id_servico);
        if (servico == null) {
          alert("servico com o id " + id_servico + " não encontrado.");
        } else {
          servico.setNomeServico(nome_servico);
          servico.setQuantidadeAtendimento(quantidade_atendimento);
          servico.id_servico(id_servico);
          await this.#daoServico.alterar(servico);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  async excluir(id_servico) {
    if (this.#status == Status.EXCLUINDO) {
      try {
        let servico = await this.#daoServico.obterServicoPeloId(id_servico);
        if (servico == null) {
          alert("servico com a id_servico " + id_servico + " não encontrado.");
        } else {
          await this.#daoServico.excluir(servico);
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