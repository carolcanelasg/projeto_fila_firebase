"use strict";

import Status from "/model/Status.js";
import Aluno from "/model/Aluno.js";
import AlunoDTO from "/model/AlunoDTO.js";
import daoReserva from "/model/daoReserva.js";
import DaoCurso from "/model/DaoCurso.js";
import ViewerAluno from "/viewer/ViewerAluno.js";

export default class CtrlReserva {
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #daoReserva;      // Referência para o Data Access Object para o Store de Alunos
  #daoCurso; // Referência para o Data Access Object para o Store de Cursos
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Aluno que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#daoReserva = new daoReserva();
    this.#daoCurso = new DaoCurso();
    this.#viewer = new ViewerAluno(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterCursosDTOs() {
    return await this.#daoCurso.obterCursos(true);
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conjAlunos = await this.#daoReserva.obterAlunos();
    
    // Se a lista de alunos estiver vazia
    if(conjAlunos.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjAlunos.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjAlunos.length, new AlunoDTO(conjAlunos[this.#posAtual - 1]));
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjAlunos = await this.#daoReserva.obterAlunos();
    if(conjAlunos.length > 0)
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjAlunos = await this.#daoReserva.obterAlunos();
    if(this.#posAtual < conjAlunos.length)
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjAlunos = await this.#daoReserva.obterAlunos();
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjAlunos = await this.#daoReserva.obterAlunos();
    this.#posAtual = conjAlunos.length;
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
 
  async incluir(matr, cpf, nome, email, telefone, siglaCurso) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let curso = await this.#daoCurso.obterCursoPelaSigla(siglaCurso);
        let aluno = new Aluno(matr, cpf, nome, email, telefone, curso);
        await this.#daoReserva.incluir(aluno); 
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(matr, cpf, nome, email, telefone, siglaCurso) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let curso = await this.#daoCurso.obterCursoPelaSigla(siglaCurso);
        let aluno = await this.#daoReserva.obterAlunoPelaMatricula(matr); 
        if(aluno == null) {
          alert("Aluno com a matrícula " + matr + " não encontrado.");
        } else {
          aluno.setCpf(cpf);
          aluno.setNome(nome);
          aluno.setEmail(email);
          aluno.setTelefone(telefone);
          aluno.setCurso(curso);
          await this.#daoReserva.alterar(aluno); 
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
 
  async excluir(matr) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let aluno = await this.#daoReserva.obterAlunoPelaMatricula(matr); 
        if(aluno == null) {
          alert("Aluno com a matrícula " + matr + " não encontrado.");
        } else {
          await this.#daoReserva.excluir(aluno); 
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























