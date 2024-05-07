import Status from "/model/Status.js";
import Reserva from "/model/Reserva.js";
import ViewerError from "/viewer/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerReserva {
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
    this.tfNomePaciente = this.obterElemento("servicoReserva");
    this.tfTipoFila = this.obterElemento("nomeHospital");
    this.tfData = this.obterElemento("idReserva");

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

  async #opcoesPacientes(tfNomePaciente) {
    while (this.tfNomePaciente.length > 0) {
      this.tfNomePaciente.remove(0);
    }

    let listaPacientesDTOs = await this.#ctrl.obterPacientesDTOs();
    for (let i = 0; i < listaPacientesDTOs.length; i++) {
      var opt = document.createElement("option");
      opt.value = listaPacientesDTOs[i].getCpf();
      if (opt.value === tfNomePaciente.getCpf()) opt.selected = true;
      opt.text = listaPacientesDTOs[i].getNomePaciente();
      this.tfNomePaciente.add(opt);
    }
  }

  async #opcoesFila(tfTipoFila) {
    while (this.tfTipoFila.length > 0) {
      this.tfTipoFila.remove(0);
    }

    let listaFilasDTOs = await this.#ctrl.obterFilasDTOs();
    for (let i = 0; i < listaFilasDTOs.length; i++) {
      var opt = document.createElement("option");
      opt.value = listaFilasDTOs[i].getIdFila();
      if (opt.value === tfTipoFila.getIdFila()) opt.selected = true;
      opt.text = listaFilasDTOs[i].getTipoFila();
      this.tfTipoFila.add(opt);
    }
  }

  async #opcoesServicos(servicoDaFila) {
    while (this.servicoDaFila.length > 0) {
      this.servicoDaFila.remove(0);
    }

    let listaServicosDTOs = await this.#ctrl.obterServicosDTOs();
    for (let i = 0; i < listaServicosDTOs.length; i++) {
      var opt = document.createElement("option");
      opt.value = listaServicosDTOs[i].getIdServico();
      if (opt.value === servicoDaFila.getIdServico()) opt.selected = true;
      opt.text = listaServicosDTOs[i].getNomeServico();
      this.servicoDaFila.add(opt);
    }
  }

  async #opcoesHospital(nomeHospital) {
    while (this.nomeHospital.length > 0) {
      this.nomeHospital.remove(0);
    }

    let listaHospitaisDTOs = await this.#ctrl.obterHospitaisDTOs();
    for (let i = 0; i < listaHospitaisDTOs.length; i++) {
      var opt = document.createElement("option");
      opt.value = listaHospitaisDTOs[i].getIdHospital();
      if (opt.value === nomeHospital.getIdHospital()) opt.selected = true;
      opt.text = listaHospitaisDTOs[i].getNomeHospital();
      this.nomeHospital.add(opt);
    }
  }

  async apresentar(pos, qtde, reserva) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (reserva == null) {
      this.tfNomePaciente.value = "";
      this.tfTipoFila.value = "";
      this.tfData.value = "";
      this.servicoDaFila.value = "";
      this.nomeHospital.value = "";
      this.idReserva.value = "";
      this.divAviso.innerHTML = " Número de Reservas: 0";
    } else {
      this.tfNomePaciente.value = reserva.getNomePaciente();
      this.tfTipoFila.value = reserva.getTipoFila();
      this.tfData.value = reserva.getData();
      this.servicoDaFila.value = reserva.getServicoFila();
      this.nomeHospital.value = reserva.getNomeHospital();
      this.idReserva.value = reserva.getIdReserva();

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
      this.servicoDaFila.disabled = false;
      this.idReserva.disabled = false;
      this.nomeHospital.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfNomePaciente.value = "";
      this.tfTipoFila.value = "";
      this.tfData.value = "";
      this.servicoDaFila.value = "";
      this.idReserva.value = "";
      this.nomeHospital.value = "";
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
    this.servicoDaFila.disabled = true;
    this.tfData.disabled = true;
    this.idReserva.disabled = true;
    this.nomeHospital.disabled = true;
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
  const nomeHospital = this.viewer.nomeHospital.value;
  const idReserva = this.viewer.servicoDaFila.value;
  const servicoFila = this.viewer.idReserva.value;
  this.viewer
    .getCtrl()
    .efetivar(
      nomePaciente,
      tipoFila,
      data,
      nomeHospital,
      idReserva,
      servicoFila
    );

  if (this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
    this.viewer
      .getCtrl()
      .fnEfetivar(
        nomePaciente,
        tipoFila,
        data,
        nomeHospital,
        idReserva,
        servicoFila
      );
  } else if (this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
    this.viewer
      .getCtrl()
      .alterar(
        nomePaciente,
        tipoFila,
        data,
        nomeHospital,
        idReserva,
        servicoFila
      );
  } else if (this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
    this.viewer
      .getCtrl()
      .excluir(
        nomePaciente,
        tipoFila,
        data,
        nomeHospital,
        idReserva,
        servicoFila
      );
  }
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}

//------------------------------------------------------------------------//
