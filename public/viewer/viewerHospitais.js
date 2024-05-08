import Status from "/model/Status.js";
import Hospital from "/model/hospitais/hospitaisDTO.js";
import ViewerError from "/viewer/ViewerError.js";

export default class ViewerHospital {
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

    this.tfNome = this.obterElemento("tfNome");
    this.tfEndereco = this.obterElemento("tfEndereco");
    this.tfTelefone = this.obterElemento("tfTelefone");
    this.tfIdHospital = this.obterElemento("tfIdHospital");

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

  async apresentar(pos, qtde, hospital) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (hospital == null) {
      this.tfNome.value = "";
      this.tfEndereco.value = "";
      this.tfTelefone.value = "";
      this.tfIdHospital.value = "";
      this.divAviso.innerHTML = " Número de Hospitais: 0";
    } else {
      this.tfNome.value = hospital.getNome();
      this.tfEndereco.value = hospital.getEndereco();
      this.tfTelefone.value = hospital.getTelefone();
      this.tfIdHospital.value = hospital.getIDHospital();

      this.divAviso.innerHTML =
        "Posição: " + pos + " | Número de Hospitais: " + qtde;
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
      this.tfNome.disabled = false;
      this.tfEndereco.disabled = false;
      this.tfTelefone.disabled = false;
      this.tfIdHospital.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfNome.disabled = false;
      this.tfEndereco.value = "";
      this.tfTelefone.value = "";
      this.tfIdHospital.value = "";
    }
  }

  statusApresentacao() {
    this.tfNome.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true;
    this.tfEndereco.disabled = true;
    this.tfNome.disabled = true;
    this.tfTelefone.disabled = true;
    this.tfIdHospital.disabled = true;
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
  const endereco = this.viewer.tfEndereco.value;
  const idHospital = this.viewer.tfIdHospital.value;
  const nome = this.viewer.tfNome.value;
  const telefone = this.viewer.tfTelefone.value;

  this.viewer.getCtrl().efetivar(endereco, idHospital, nome, telefone);

  if (this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
    this.viewer.getCtrl().fnEfetivar(idHospital, nome, telefone, endereco);
  } else if (this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
    this.viewer.getCtrl().alterar(idHospital, nome, telefone, endereco);
  } else if (this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
    this.viewer.getCtrl().excluir(idHospital, nome, telefone, endereco);
  }
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}

//------------------------------------------------------------------------//
