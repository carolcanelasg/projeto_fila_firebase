"use strict";


export default class CtrlReserva {
  
  // Atributos do Controlador
  #daoReserva;     
  #daoFila; 
  #viewer;   
  #posAtual; 
  #status;  
  

  constructor() {
    this.#daoReserva = new daoReserva();
    this.#daoFila = new daoFila();
    this.#viewer = new ViewerAluno(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }


  async #atualizarContextoNavegacao() {
    this.#status = Status.NAVEGANDO;
    this.#viewer.statusApresentacao();
    
    let conjReservas = await this.#daoReserva.obterReservas();
    
    if(conjReservas.length == 0) {
      this.#posAtual = 0;
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      if(this.#posAtual == 0 || this.#posAtual > conjReservas.length)
        this.#posAtual = 1;
      this.#viewer.apresentar(this.#posAtual, conjReservas.length, new ReservaDTO(conjReservas[this.#posAtual - 1]));
    }
  }
  
  async apresentarPrimeiro() {
    let conjReservas = await this.#daoReserva.obterReservas();
    if(conjReservas.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async apresentarProximo() {
    let conjReservas = await this.#daoReserva.obterReservas();
    if(this.#posAtual < conjReservas.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  async apresentarAnterior() {
    let conjReservas = await this.#daoReserva.obterReservas();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  async apresentarUltimo() {
    let conjReservas = await this.#daoReserva.obterReservas();
    this.#posAtual = conjReservas.length;
    this.#atualizarContextoNavegacao();
  }
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    this.efetivar = this.incluir;
  }
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    this.efetivar = this.alterar;
  }
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    this.efetivar = this.excluir;
  }
 
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

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  getStatus() {
    return this.#status;
  }

}