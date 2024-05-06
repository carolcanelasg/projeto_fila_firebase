import Status from "/model/Status.js";
import Reserva from "/model/Reserva.js";
import ViewerError from "/viewer/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerAluno {
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

    this.tfNomePaciente = this.obterElemento("tfNomePaciente");
    this.tfTipoFila = this.obterElemento("tfTipoFila");
    this.tfData = this.obterElemento("tfData");

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

  async apresentar(pos, qtde, reserva) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (reserva == null) {
      this.tfNomePaciente.value = "";
      this.tfTipoFila.value = "";
      this.tfData.value = "";
      this.divAviso.innerHTML = " Número de Reservas: 0";
    } else {
      this.tfNomePaciente.value = reserva.getNomePaciente();
      this.tfTipoFila.value = reserva.getTipoFila();
      this.tfData.value = reserva.getData();

      this.divAviso.innerHTML =
        "Posição: " + pos + " | Número de Reservas: " + qtde;
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
      this.tfNomePaciente.disabled = false;
      this.tfTipoFila.disabled = false;
      this.tfData.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfNomePaciente.value = "";
      this.tfTipoFila.value = "";
      this.tfData.value = "";
    }
  }

  //------------------------------------------------------------------------//

  statusApresentacao() {
    this.tfNomePaciente.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
    this.tfTipoFila.disabled = true;
    this.tfNomePaciente.disabled = true;
    this.tfData.disabled = true;
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
  const nomePaciente = this.viewer.tfNomePaciente.value;
  const tipoFila = this.viewer.tfTipoFila.value;
  const data = this.viewer.tfData.value;
  this.viewer.getCtrl().efetivar(nomePaciente, tipoFila, data);

  if (this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
    this.viewer.getCtrl().fnEfetivar(nomePaciente, tipoFila, data);
  } else if (this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
    this.viewer.getCtrl().alterar(nomePaciente, tipoFila, data);
  } else if (this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
    this.viewer.getCtrl().excluir(nomePaciente, tipoFila, data);
  }
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}

//------------------------------------------------------------------------//
