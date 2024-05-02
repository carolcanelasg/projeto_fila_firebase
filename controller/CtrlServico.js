"use strict";

import Servico from "../model/servico/Servico"


export default class CtrlServico {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #daoServico;      // Referência para o Data Access Object para o Store de pacientes
  #daoReserva; // Referência para o Data Access Object para o Store de Cursos
  #viewerServico;   // Referência para o gerenciador do viewerServico 
  #posAtual; // Indica a posição do objeto paciente que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#daoServico = new daoServico();
    this.#viewerServico = new viewerServico(this);
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

    // Determina ao viewerServico que ele está apresentando dos dados 
    this.#viewerServico.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os pacientes presentes na base
    let conjServicos = await this.#daoServico.obterServicos();
    
    // Se a lista de pacientes estiver vazia
    if(conjServicos.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewerServico que não deve apresentar nada
      this.#viewerServico.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjServicos.length)
        this.#posAtual = 1;
      // Peço ao viewerServico que apresente o objeto da posição atual
      this.#viewerServico.apresentar(this.#posAtual, conjServicos.length, new ServicoDTO(conjServicos[this.#posAtual - 1]));
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjServicos = await this.#daoServico.obterServicos(); ///////////////////////////
    if(conjServicos.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjServicos = await this.#daoServico.obterServicos(); ////////////////////////
    if(this.#posAtual < conjServicos.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjServicos = await this.#daoServico.obterServicos();  ////////////////////////
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjServicos = await this.#daoServico.obterServicos();  ////////////////////////
    this.#posAtual = conjServicos.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewerServico.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir (ou seja,
    // a CALLBACK da ação é o método incluir. Preciso disso, pois o viewerServico mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerServico.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método alterar (ou seja,
    // a CALLBACK da ação é o método alterar. Preciso disso, pois o viewerServico mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerServico.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método excluir (ou seja,
    // a CALLBACK da ação é o método excluir. Preciso disso, pois o viewerServico mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(nome_servico, quantidade_atendimento, id_servico) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let servico = new servico(nome_servico, quantidade_atendimento, id_servico);
        await this.#daoServico.incluir(servico); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(nome_servico, quantidade_atendimento, id_servico) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let servico = await this.#daoServico.obterServicoPeloId(id_servico); 
        if(servico == null) {
          alert("servico com o id " + id_servico + " não encontrado.");
        } else {
          servico.setNomeServico(nome_servico);
          servico.setQuantidadeAtendimento(quantidade_atendimento)
          servico.id_servico(id_servico);
          await this.#daoServico.alterar(servico); 
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
 
  async excluir(id_servico) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let servico = await this.#daoServico.obterServicoPeloId(id_servico); 
        if(servico == null) {
          alert("servico com a id_servico " + id_servico + " não encontrado.");
        } else {
          await this.#daoServico.excluir(servico); 
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























