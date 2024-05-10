import Status from "/model/Status.js";
import Fila from "/model/fila/filaDTO.js";
import ViewerError from "/viewer/ViewerError.js";

export default class ViewerFila {
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

    this.tfTipoFila = this.obterElemento("tfTipoFila");
    this.tfIdFila = this.obterElemento("tfIdFila");
    this.tfTempoMedio = this.obterElemento("tfTempoMedio");
    this.opcoesServico = this.obterElemento("opcoesServico");

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

  async #opcoesServico(servicoDaFila) {
    while (this.opcoesServico.length > 0) {
      this.opcoesServico.remove(0);
    }

    let listaServicosDTOs = await this.#ctrl.obterServicosDTOs();
    for (let i = 0; i < listaServicosDTOs.length; i++) {
      var opt = document.createElement("option");
      opt.value = listaServicosDTOs[i].getIdServico();
      if (opt.value === servicoDaFila.getIdServico()) opt.selected = true;
      opt.text = listaServicosDTOs[i].getNomeServico();
      this.opcoesServico.add(opt);
    }
  }

  async apresentar(pos, qtde, fila) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (fila == null) {
      this.tfTipoFila.value = "";
      this.tfIdFila.value = "";
      this.tfTempoMedio.value = "";
      this.opcoesServico.value = "";
      this.divAviso.innerHTML = " Número de Filas: 0";
    } else {
      this.tfTipoFila.value = fila.getTipoFila();
      this.tfIdFila.value = fila.getIDFila();
      this.tfTempoMedio.value = fila.getTempoMedio();

      let servicoDaFila = await fila.getServicoFila();
      this.#opcoesServico(servicoDaFila);

      this.divAviso.innerHTML =
        "Posição: " + pos + " | Número de Filas: " + qtde;
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
      this.tfTipoFila.disabled = false;
      this.tfIdFila.disabled = false;
      this.tfTempoMedio.disabled = false;
      this.opcoesServico.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfIdFila.disabled = false;
      this.tfIdFila.value = "";
      this.tfTipoFila.value = "";
      this.tfTempoMedio.value = "";
      this.opcoesServico.value = "";
    }
  }

  statusApresentacao() {
    this.tfTipoFila.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
    this.tfIdFila.disabled = true;
    this.tfTipoFila.disabled = true;
    this.tfTempoMedio.disabled = true;
    this.opcoesServico.disabled = true;
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
  const tipoFila = this.viewer.tfTipoFila.value;
  const idFIla = this.viewer.tfIdFila.value;
  const tempoMedio = this.viewer.tfTempoMedio.value;
  const opcoesServico = this.viewer.opcoesServico.value;

  this.viewer.getCtrl().efetivar(tipoFila, idFIla, tempoMedio, opcoesServico);

  if (this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
    this.viewer
      .getCtrl()
      .fnEfetivar(tipoFila, idFIla, tempoMedio, opcoesServico);
  } else if (this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
    this.viewer.getCtrl().alterar(tipoFila, idFIla, tempoMedio, opcoesServico);
  } else if (this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
    this.viewer.getCtrl().excluir(tipoFila, idFIla, tempoMedio, opcoesServico);
  }
}

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}
