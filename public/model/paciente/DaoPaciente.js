"use strict";

import {
  getDatabase,
  ref,
  query,
  onValue,
  onChildAdded,
  orderByChild,
  child,
  orderByKey,
  equalTo,
  get,
  set,
  remove,
  push,
  runTransaction,
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

import Paciente from "../paciente/Paciente.js";
import PacienteDTO from "../paciente/pacienteDTO.js";
import ModelError from "../ModelError.js";

export default class DaoPaciente {

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    if (DaoPaciente.promessaConexao == null) {
      DaoPaciente.promessaConexao = new Promise(function (resolve, reject) {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoPaciente.promessaConexao;
  }

  async obterPacientePeloCpf(cpf) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let dbRefPaciente = ref(connectionDB, "pacientes/" + cpf);
      let consulta = query(dbRefPaciente);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let paciente = dataSnapshot.val();
        if (paciente != null)
          resolve(
            new Paciente(
              paciente.cpf,
              paciente.nome,
              paciente.email,
              paciente.telefone
            )
          );
        else resolve(null);
      });
    });
  }

  async obterPacientes(gerarDTOs) {
    let connectionDB = await this.obterConexao();

    return new Promise((resolve) => {
      let conjPacientes = [];
      let dbRefPacientes = ref(connectionDB, "pacientes");
      let paramConsulta = orderByChild("cpf");
      let consulta = query(dbRefPacientes, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then((dataSnapshot) => {
        dataSnapshot.forEach((dataSnapshotObj) => {
          let elem = dataSnapshotObj.val();
          if (gerarDTOs === undefined)
            conjPacientes.push(
              new Paciente(elem.cpf, elem.nome, elem.email, elem, telefone)
            );
          else
            conjPacientes.push(
              new PacienteDTO(
                new Paciente(elem.cpf, elem.nome, elem.email, elem, telefone)
              )
            );
        });
      });
    });
  }

  async incluir(paciente) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefPacientes = ref(connectionDB, "pacientes");
      runTransaction(dbRefPacientes, (paciente) => {
        let dbRefNovoPaciente = child(dbRefPacientes, paciente.getSigla());
        let setPromise = set(dbRefNovoPaciente, paciente);
        setPromise.then(
          (value) => {
            resolve(true);
          },
          (erro) => {
            reject(erro);
          }
        );
      });
    });
    return resultado;
  }

  async alterar(paciente) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefPacientes = ref(connectionDB, "pacientes");
      runTransaction(dbRefCursos, (pacientes) => {
        let dbRefAlterarPaciente = child(dbRefPacientes, paciente.getSigla());
        let setPromise = set(dbRefAlterarPaciente, paciente);
        setPromise.then(
          (value) => {
            resolve(true);
          },
          (erro) => {
            reject(erro);
          }
        );
      });
    });
    return resultado;
  }

  async excluir(paciente) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefPaciente = ref(connectionDB, "pacientes");
      runTransaction(dbRefPaciente, (pacientes) => {
        let dbRefExcluirPaciente = child(dbRefPaciente, paciente.getSigla());
        let setPromise = remove(dbRefExcluirPaciente, paciente);
        setPromise.then(
          (value) => {
            resolve(true);
          },
          (erro) => {
            reject(erro);
          }
        );
      });
    });
    return resultado;
  }
}