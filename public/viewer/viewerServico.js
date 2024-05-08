import Status from "/model/Status.js";
import Servico from "/model/servicoDTO.js";
import ViewerError from "/viewer/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerServico {
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

    this.tfNomeServico = this.obterElemento("tfNomeServico");
    this.tfQntAtend = this.obterElemento("tfQntAtend");
    this.tfIdServ = this.obterElemento("tfIdServ");

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

  //------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if (elemento == null)
      throw new ViewerError(
        "Não encontrei um elemento com id '" + idElemento + "'"
      );
    elemento.viewer = this;
    return elemento;
  }

  //------------------------------------------------------------------------//

  getCtrl() {
    return this.#ctrl;
  }

  //------------------------------------------------------------------------//

  async apresentar(pos, qtde, servico) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (servico == null) {
      this.tfNomeServico.value = "";
      this.tfQntAtend.value = "";
      this.tfIdServ.value = "";
      this.divAviso.innerHTML = " Número de Serviços: 0";
    } else {
      this.tfNomeServico.value = servico.getNomeServico();
      this.tfQntAtend.value = servico.getQntAtend();
      this.tfIdServ.value = servico.getIDServico();

      this.divAviso.innerHTML =
        "Posição: " + pos + " | Número de Serviços: " + qtde;
    }
  }

  //------------------------------------------------------------------------//

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled = flagFim;
    this.btProximo.disabled = flagFim;
    this.btAnterior.disabled = flagInicio;
  }

  //------------------------------------------------------------------------//

  statusEdicao(operacao) {
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false;

    if (operacao != Status.EXCLUINDO) {
      this.tfNomeServico.disabled = false;
      this.tfQntAtend.disabled = false;
      this.tfIdServ.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfNomeServico.value = "";
      this.tfQntAtend.value = "";
      this.tfIdServ.value = "";
    }
  }

  //------------------------------------------------------------------------//

  statusApresentacao() {
    this.tfNomeServico.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
    this.tfQntAtend.disabled = true;
    this.tfNomeServico.disabled = true;
    this.tfIdServ.disabled = true;
  }
}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  this.viewer.getCtrl().apresentarPrimeiro();
}

//------------------------------------------------------------------------//

function fnBtProximo() {
  this.viewer.getCtrl().apresentarProximo();
}

//------------------------------------------------------------------------//

function fnBtAnterior() {
  this.viewer.getCtrl().apresentarAnterior();
}

//------------------------------------------------------------------------//

function fnBtUltimo() {
  this.viewer.getCtrl().apresentarUltimo();
}
//------------------------------------------------------------------------//

function fnBtIncluir() {
  this.viewer.getCtrl().iniciarIncluir();
}

//------------------------------------------------------------------------//

function fnBtAlterar() {
  this.viewer.getCtrl().iniciarAlterar();
}

//------------------------------------------------------------------------//

function fnBtExcluir() {
  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const nomeServico = this.viewer.tfNomeServico.value;
  const qntAtend = this.viewer.tfQntAtend.value;
  const idServico = this.viewer.tfIdServ.value;

  this.viewer.getCtrl().efetivar(nomeServico, qntAtend, idServico);

  if (this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
    this.viewer.getCtrl().fnEfetivar(nomeServico, qntAtend, idServico);
  } else if (this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
    this.viewer.getCtrl().alterar(nomeServico, qntAtend, idServico);
  } else if (this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
    this.viewer.getCtrl().excluir(nomeServico, qntAtend, idServico);
  }
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}

//------------------------------------------------------------------------//
