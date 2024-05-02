"use strict";

import Hospitais from "../model/hospitais/Hospitais";



export default class CtrlHospitais {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #daoHospitais;      // Referência para o Data Access Object para o Store de pacientes
  #daoReserva; // Referência para o Data Access Object para o Store de Cursos
  #viewerHospitais;   // Referência para o gerenciador do viewerHospitais 
  #posAtual; // Indica a posição do objeto paciente que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#daoHospitais = new daoHospitais();
    this.#viewerHospitais = new viewerHospitais(this);
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

    // Determina ao viewerHospitais que ele está apresentando dos dados 
    this.#viewerHospitais.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os pacientes presentes na base
    let conjHospitais = await this.#daoHospitais.obterPacientes();
    
    // Se a lista de pacientes estiver vazia
    if(conjHospitais.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewerHospitais que não deve apresentar nada
      this.#viewerHospitais.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjHospitais.length)
        this.#posAtual = 1;
      // Peço ao viewerHospitais que apresente o objeto da posição atual
      this.#viewerHospitais.apresentar(this.#posAtual, conjHospitais.length, new hospitaisDTO(conjHospitais[this.#posAtual - 1]));
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjHospitais = await this.#daoHospitais.obterPacientes(); ///////////////////////////
    if(conjHospitais.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjHospitais = await this.#daoHospitais.obterPacientes(); ////////////////////////
    if(this.#posAtual < conjHospitais.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjHospitais = await this.#daoHospitais.obterPacientes();  ////////////////////////
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjHospitais = await this.#daoHospitais.obterPacientes();  ////////////////////////
    this.#posAtual = conjHospitais.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewerHospitais.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir (ou seja,
    // a CALLBACK da ação é o método incluir. Preciso disso, pois o viewerHospitais mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewerHospitais.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método alterar (ou seja,
    // a CALLBACK da ação é o método alterar. Preciso disso, pois o viewerHospitais mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewerHospitais.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método excluir (ou seja,
    // a CALLBACK da ação é o método excluir. Preciso disso, pois o viewerHospitais mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(nome, endereco, telefone, id_hospital) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let hospital = new Hospitais(nome, endereco, telefone, id_hospital);
        await this.#daoHospitais.incluir(hospital); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(nome, endereco, telefone, id_hospital) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let hospital = await this.#daoHospitais.obterPacientePeloCpf(cpf); 
        if(hospital == null) {
          alert("hospital com o cpf " + cpf + " não encontrado.");
        } else {
          hospital.setNome(nome);
          hospital.setEndereco(endereco)
          hospital.setTelefone(telefone);
          hospital.setId(id_hospital);
          await this.#daoHospitais.alterar(hospital); 
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
 
  async excluir(cpf) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let hospital = await this.#daoHospitais.obterPacientePeloCpf(cpf); 
        if(hospital == null) {
          alert("hospital com a cpf " + cpf + " não encontrado.");
        } else {
          await this.#daoHospitais.excluir(hospital); 
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























