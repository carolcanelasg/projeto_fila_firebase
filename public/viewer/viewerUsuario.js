import Status from "../model/status.js";
import Usuario from "../model/usuario/usuario.js";
import ViewerError from "../viewer/viewerError.js";


export default class ViewerUsuario {
  #ctrl;

  constructor(ctrl) {
    
    this.#ctrl = ctrl;
   
    this.divNavegar = this.obterElemento("divNavegar");
    this.divComandos = this.obterElemento("divComandos");
    this.divAviso = this.obterElemento("divAviso");
    this.divDialogo = this.obterElemento("divDialogo");

    this.btPrimeiro = this.obterElemento("btPrimeiro");
    this.btAnterior = this.obterElemento("btAnterior");
    this.btProximo = this.obterElemento("btProximo");
    this.btUltimo = this.obterElemento("btUltimo");

    this.btIncluir = this.obterElemento("btIncluir");
    this.btExcluir = this.obterElemento("btExcluir");
    this.btAlterar = this.obterElemento("btAlterar");
    this.btSair = this.obterElemento("btSair");

    this.btOk = this.obterElemento("btOk");
    this.btCancelar = this.obterElemento("btCancelar");

    this.tfEmail = this.obterElemento("tfEmail");
    this.tfUid = this.obterElemento("tfUid");
    this.cbFuncao = this.obterElemento("cbFuncao");

    this.btPrimeiro.onclick = fnBtPrimeiro;
    this.btProximo.onclick = fnBtProximo;
    this.btAnterior.onclick = fnBtAnterior;
    this.btUltimo.onclick = fnBtUltimo;

    this.btIncluir.onclick = fnBtIncluir;
    this.btAlterar.onclick = fnBtAlterar;
    this.btExcluir.onclick = fnBtExcluir;

    this.btOk.onclick = fnBtOk;
    this.btCancelar.onclick = fnBtCancelar;
  }

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      throw new ViewerError(
        "Não encontrei um elemento com id '" + idElemento + "'"
      );
    elemento.viewer = this;
    return elemento;
  }

  getCtrl() {
    return this.#ctrl;
  }

  apresentar(pos, qtde, usuario) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (usuario == null) {
      this.tfEmail.value = "";
      this.tfUid.value = "";
      this.cbFuncao.value = "INABILITADO";
      this.divAviso.innerHTML = " Número de Usuarios: 0";
    } else {
      this.tfEmail.value = usuario.getEmail();
      this.tfUid.value = usuario.getUid();
      this.cbFuncao.value = usuario.getFuncao();
      this.divAviso.innerHTML =
        "Posição: " + pos + " | Número de Usuarios: " + qtde;
    }
  }

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled = flagFim;
    this.btProximo.disabled = flagFim;
    this.btAnterior.disabled = flagInicio;
  }

  statusEdicao(operacao) {
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false;

    if (operacao != Status.EXCLUINDO) {
      this.tfEmail.disabled = false;
      this.tfUid.disabled = false;
      this.cbFuncao.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfEmail.value = "";
      this.tfUid.value = "";
      this.cbFuncao.value = "INABILITADO";
    }
  }

  statusApresentacao() {
    this.tfEmail.disabled = true;
    this.tfUid.disabled = true;
    this.cbFuncao.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
  }
}

function fnBtPrimeiro() {
  this.viewer.getCtrl().apresentarPrimeiro();
}

function fnBtProximo() {
  this.viewer.getCtrl().apresentarProximo();
}

function fnBtAnterior() {
  this.viewer.getCtrl().apresentarAnterior();
}

function fnBtUltimo() {
  this.viewer.getCtrl().apresentarUltimo();
}

function fnBtIncluir() {
  this.viewer.getCtrl().iniciarIncluir();
}

function fnBtAlterar() {
  this.viewer.getCtrl().iniciarAlterar();
}


function fnBtExcluir() {
  this.viewer.getCtrl().iniciarExcluir();
}

function fnBtOk() {
  const email = this.viewer.tfEmail.value;
  const uid = this.viewer.tfUid.value;
  const funcao = this.viewer.cbFuncao.value;

  this.viewer.getCtrl().efetivar(email, uid, funcao);
}

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}