"use strict";

import Status from "../model/status.js";
import Usuario from "../model/usuario/usuario.js";
import UsuarioDTO from "../model/usuario/usuarioDTO.js";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import ViewerUsuario from "../viewer/viewerUsuario.js";

export default class CtrlManterUsuarios {

  // Atributos do Controlador
  #dao; 
  #viewer; 
  #posAtual; 
  #status; 

  constructor() {
    this.#dao = new DaoUsuario();
    this.#viewer = new ViewerUsuario(this);
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async #atualizarContextoNavegacao() {
    this.#status = Status.NAVEGANDO;
    this.#viewer.statusApresentacao();

    let conjUsuarios = await this.#dao.obterUsuarios();

    if (conjUsuarios.length == 0) {
      this.#posAtual = 0;
      this.#viewer.apresentar(0, 0, null);
    } else {
      if (this.#posAtual == 0 || this.#posAtual > conjUsuarios.length)
        this.#posAtual = 1;
      this.#viewer.apresentar(
        this.#posAtual,
        conjUsuarios.length,
        new UsuarioDTO(conjUsuarios[this.#posAtual - 1])
      );
    }
  }

  async apresentarPrimeiro() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    if (conjUsuarios.length > 0) this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  async apresentarProximo() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    if (this.#posAtual < conjUsuarios.length) this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  async apresentarAnterior() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    if (this.#posAtual > 1) this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  async apresentarUltimo() {
    let conjUsuarios = await this.#dao.obterUsuarios();
    this.#posAtual = conjUsuarios.length;
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

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  getStatus() {
    return this.#status;
  }

}