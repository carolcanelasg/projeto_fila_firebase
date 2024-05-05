"use strict";


export default class CtrlReserva {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #daoReserva;      // Referência para o Data Access Object para o Store de Alunos
  #daoFila; // Referência para o Data Access Object para o Store de Cursos
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Aluno que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#daoReserva = new daoReserva();
    this.#daoFila = new daoFila();
    this.#viewer = new ViewerAluno(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  /*async obterCursosDTOs() {
    return await this.#daoFila.obterCursos(true);
  }*/
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conjReservas = await this.#daoReserva.obterReservas();
    
    // Se a lista de alunos estiver vazia
    if(conjReservas.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjReservas.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjReservas.length, new ReservaDTO(conjReservas[this.#posAtual - 1]));
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjReservas = await this.#daoReserva.obterReservas();
    if(conjReservas.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjReservas = await this.#daoReserva.obterReservas();
    if(this.#posAtual < conjReservas.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjReservas = await this.#daoReserva.obterReservas();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjReservas = await this.#daoReserva.obterReservas();
    this.#posAtual = conjReservas.length;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir (ou seja,
    // a CALLBACK da ação é o método incluir. Preciso disso, pois o viewer mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método alterar (ou seja,
    // a CALLBACK da ação é o método alterar. Preciso disso, pois o viewer mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método excluir (ou seja,
    // a CALLBACK da ação é o método excluir. Preciso disso, pois o viewer mandará a mensagem
    // "efetivar" (polimórfica) ao invés de "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(nome_paciente, tipo_fila, data) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let fila = await this.#daoFila.obterFilaPeloId(tipo_fila);
        let reserva = new reserva(nome_paciente, tipo_fila, data);
        await this.#daoReserva.incluir(reserva); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(nome_paciente, tipo_fila, data) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let fila = await this.#daoFila.obterFilaPeloId(tipo_fila);
        let reserva = await this.#daoReserva.obterReservaPelaData(data); 
        if(reserva == null) {
          alert("reserva com a data " + data + " não encontrada.");
        } else {
          reserva.setNomePaciente(nome_paciente);
          reserva.setTipoFila(tipo_fila);
          reserva.setData(data);
          await this.#daoReserva.alterar(reserva); 
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
 
  async excluir(data_reserva) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let reserva = await this.#daoReserva.obterReservaPelaData(data_reserva); 
        if(reserva == null) {
          alert("reserva com a data_reserva" + data_reserva + " não encontrado.");
        } else {
          await this.#daoReserva.excluir(reserva); 
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























