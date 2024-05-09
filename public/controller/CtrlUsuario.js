"use strict";

import Status from "../model/status.js";
import Usuario from "../model/usuario/usuario.js";
import UsuarioDTO from "../model/usuario/usuarioDTO.js";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import ViewerUsuario from "../viewer/viewerUsuario.js";

export default class CtrlManterUsuarios {
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao; // Referência para o Data Access Object para o Store de Usuarios
  #viewer; // Referência para o gerenciador do viewer
  #posAtual; // Indica a posição do objeto Usuario que estiver sendo apresentado
  #status; // Indica o que o controlador está fazendo

  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoUsuario();
    this.#viewer = new ViewerUsuario(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados
    this.#viewer.statusApresentacao();

    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conjUsuarios = await this.#dao.obterUsuarios();

    // Se a lista de alunos estiver vazia
    if (conjUsuarios.length == 0) {
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;

      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    } else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if (this.#posAtual == 0 || this.#posAtual > conjUsuarios.length)
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(
        this.#posAtual,
        conjUsuarios.length,
        new UsuarioDTO(conjUsuarios[this.#posAtual - 1])
      );
    }
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    if (conjUsuarios.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    if (this.#posAtual < conjUsuarios.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    this.#posAtual = conjUsuarios.length;
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

  async incluir(email, uid, funcao) {
    if (this.#status == Status.INCLUINDO) {
      try {
        let usuario = new Usuario(email, uid);
        await this.#dao.incluir(usuario);
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(email, uid, funcao) {
    if (this.#status == Status.ALTERANDO) {
      try {
        let usuario = await this.#dao.obterUsuarioPeloUID(uid);
        if (usuario == null) {
          alert("Usuario com o email " + email + " não encontrado.");
        } else {
          usuario.setEmail(email);
          usuario.setUid(uid);
          usuario.setFuncao(funcao);
          await this.#dao.alterar(usuario);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
        alert(e);
      }
    }
  }

  //-----------------------------------------------------------------------------------------//

  async excluir(email) {
    if (this.#status == Status.EXCLUINDO) {
      try {
        let usuario = await this.#dao.obterUsuarioPeloEMail(emai);
        if (usuario == null) {
          alert("Usuario com o email " + email + " não encontrado.");
        } else {
          await this.#dao.excluir(usuario);
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      } catch (e) {
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
