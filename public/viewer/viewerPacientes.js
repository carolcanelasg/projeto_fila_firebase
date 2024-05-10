import Status from "../model/status.js";
import Paciente from "../model/paciente/pacienteDTO.js";
import ViewerError from "../viewer/viewerError.js";

export default class ViewerPaciente {
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

    this.tfCpf = this.obterElemento("tfCpf");
    this.tfNome = this.obterElemento("tfNome");
    this.tfEmail = this.obterElemento("tfEmail");
    this.tfTelefone = this.obterElemento("tfTelefone");

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
  
  apresentar(pos, qtde, paciente) {
    this.configurarNavegacao(pos <= 1, pos == qtde);

    if (paciente == null) {
      this.tfCpf.value = "";
      this.tfNome.value = "";
      this.tfEmail.value = "";
      this.tfTelefone.value = "";
      this.divAviso.innerHTML = " Número de Pacientes: 0";
    } else {
      this.tfCpf.value = paciente.getCPF();
      this.tfNome.value = paciente.getNome();
      this.tfEmail.value = paciente.getEmail();
      this.tfTelefone.value = paciente.getTelefone();
      this.divAviso.innerHTML =
        "Posição: " + pos + " | Número de Pacientes: " + qtde;
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
      this.tfCpf.disabled = false;
      this.tfNome.disabled = false;
      this.tfEmail.disabled = false;
      this.tfTelefone.disabled = false;
      this.divAviso.innerHTML = "";
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";
    }
    if (operacao == Status.INCLUINDO) {
      this.tfCpf.value = "";
      this.tfNome.value = "";
      this.tfTelefone.value = "";
      this.tfEmail.value = "";
    }
  }
  
  statusApresentacao() {
    this.tfCpf.disabled = true;
    this.tfNome.disabled = true;
    this.tfTelefone.disabled = true;
    this.tfEmail.disabled = true;
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
  console.log("entrei aqui");
}

function fnBtAlterar() {
  this.viewer.getCtrl().iniciarAlterar();
}

function fnBtExcluir() {
  this.viewer.getCtrl().iniciarExcluir();
}

function fnBtOk() {
  const nome = this.viewer.tfNome.value;
  const email = this.viewer.tfEmail.value;
  const cpf = this.viewer.tfCpf.value;
  const telefone = this.viewer.tfTelefone.value;

  this.viewer.getCtrl().efetivar(email, nome, cpf, telefone);

  if (this.viewer.getCtrl().getStatus() == Status.INCLUINDO) {
    this.viewer.getCtrl().fnEfetivar(email, nome, telefone, cpf);
  } else if (this.viewer.getCtrl().getStatus() == Status.ALTERANDO) {
    this.viewer.getCtrl().alterar(email, nome, telefone, cpf);
  } else if (this.viewer.getCtrl().getStatus() == Status.EXCLUINDO) {
    this.viewer.getCtrl().excluir(email, nome, telefone, cpf);
  }
}

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar();
}