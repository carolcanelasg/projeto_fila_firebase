"use strict";

import Fila from "../model/fila/Fila";



export default class CtrlFila {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #daoFila;      // Referência para o Data Access Object para o Store de pacientes
  #daoReserva; // Referência para o Data Access Object para o Store de Cursos
  #viewerFila;   // Referência para o gerenciador do viewerFila 
  #posAtual; // Indica a posição do objeto paciente que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#daoFila = new DaoFila();
    this.#viewerFila = new viewerFila(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterReservaDTOs() {
    return await this.#daoReserva.obterReservas(true);
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() { //////////////////////////////////
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewerFila que ele está apresentando dos dados 
    this.#viewerFila.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os pacientes presentes na base
    let conjFila = await this.#daoFila.obterFilas();
    
    // Se a lista de pacientes estiver vazia
    if(conjFila.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewerFila que não deve apresentar nada
      this.#viewerFila.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjFila.length)
        this.#posAtual = 1;
      // Peço ao viewerFila que apresente o objeto da posição atual
      this.#viewerFila.apresentar(this.#posAtual, conjFila.length, new filaDTO(conjFila[this.#posAtual - 1]));
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjFila = await this.#daoFila.obterFilas(); ///////////////////////////
    if(conjFila.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjFila = await this.#daoFila.obterFilas(); ////////////////////////
    if(this.#posAtual < conjFila.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjFila = await this.#daoFila.obterFilas();  ////////////////////////
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjFila = await this.#daoFila.obterFilas();  ////////////////////////
    this.#posAtual = conjFila.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewerFila.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir (ou seja,
    // a CALLBACK da ação é o método incluir. Preciso disso, pois o viewerFila mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerFila.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método alterar (ou seja,
    // a CALLBACK da ação é o método alterar. Preciso disso, pois o viewerFila mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerFila.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método excluir (ou seja,
    // a CALLBACK da ação é o método excluir. Preciso disso, pois o viewerFila mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(ntipo_fila, id_fila, tempo_medio) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let fila = new Fila(ntipo_fila, id_fila, tempo_medio);
        await this.#daoFila.incluir(fila); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(ntipo_fila, id_fila, tempo_medio) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let fila = await this.#daoFila.obterFilaPeloId(id_fila); 
        if(fila == null) {
          alert("fila com o id_fila " + id_fila + " não encontrada.");
        } else {
          fila.setTipoFila(ntipo_fila);
          fila.setIdFila(id_fila)
          fila.setTempoMedio(tempo_medio);
          await this.#daoFila.alterar(fila); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async excluir(id_fila) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let fila = await this.#daoFila.obterFilaPeloId(id_fila); 
        if(fila == null) {
          alert("fila com a id_fila " + id_fila + " não encontrado.");
        } else {
          await this.#daoFila.excluir(fila); 
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
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























