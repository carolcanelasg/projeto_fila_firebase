"use strict";

import Fila from "../model/fila/Fila.js";

export default class CtrlFila {

  // Atributos do Controlador

  #daoFila; 
  #daoReserva; 
  #viewerFila; 
  #posAtual; 
  #status;

  constructor() {
    this.#daoFila = new DaoFila();
    this.#viewerFila = new viewerFila(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async obterReservaDTOs() {
    return await this.#daoReserva.obterReservas(true);
  }

  async #atualizarContextoNavegacao() {
    this.#status = Status.NAVEGANDO;
    this.#viewerFila.statusApresentacao();

    let conjFila = await this.#daoFila.obterFilas();

    if (conjFila.length == 0) {
      this.#posAtual = 0;
      this.#viewerFila.apresentar(0, 0, null);
    } else {
      if (this.#posAtual == 0 || this.#posAtual > conjFila.length)
        this.#posAtual = 1;
      this.#viewerFila.apresentar(
        this.#posAtual,
        conjFila.length,
        new filaDTO(conjFila[this.#posAtual - 1])
      );
    }
  }


  async apresentarPrimeiro() {
    let conjFila = await this.#daoFila.obterFilas(); 
    if (conjFila.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async apresentarProximo() {
    let conjFila = await this.#daoFila.obterFilas(); 
    if (this.#posAtual < conjFila.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  async apresentarAnterior() {
    let conjFila = await this.#daoFila.obterFilas(); 
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  async apresentarUltimo() {
    let conjFila = await this.#daoFila.obterFilas(); 
    this.#posAtual = conjFila.length;
    this.#atualizarContextoNavegacao();
  }


  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewerFila.statusEdicao(Status.INCLUINDO);
    this.efetivar = this.incluir;
  }


  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerFila.statusEdicao(Status.ALTERANDO);

    this.efetivar = this.alterar;
  }

  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerFila.statusEdicao(Status.EXCLUINDO);
    this.efetivar = this.excluir;
  }

  async incluir(ntipo_fila, id_fila, tempo_medio) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let fila = new Fila(ntipo_fila, id_fila, tempo_medio);
        await this.#daoFila.incluir(fila);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }


  async alterar(ntipo_fila, id_fila, tempo_medio) {
    if (this.#status == Status.ALTERANDO) {
      try {
        let fila = await this.#daoFila.obterFilaPeloId(id_fila);
        if (fila == null) {
          alert("fila com o id_fila " + id_fila + " não encontrada.");
        } else {
          fila.setTipoFila(ntipo_fila);
          fila.setIdFila(id_fila);
          fila.setTempoMedio(tempo_medio);
          await this.#daoFila.alterar(fila);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  async excluir(id_fila) {
    if (this.#status == Status.EXCLUINDO) {
      try {
        let fila = await this.#daoFila.obterFilaPeloId(id_fila);
        if (fila == null) {
          alert("fila com a id_fila " + id_fila + " não encontrado.");
        } else {
          await this.#daoFila.excluir(fila);
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