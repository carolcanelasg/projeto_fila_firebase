"use strict";

import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com";


import Paciente from "/model/paciente/Paciente.js";
import pacienteDTO from "/model/paciente/pacienteDTO.js";
import ModelError from "/model/ModelError.js";

export default class DaoPaciente {
  
  //-----------------------------------------------------------------------------------------//

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  async obterConexao() {

    if(DaoPaciente.promessaConexao == null) {
      DaoPaciente.promessaConexao = new Promise(function(resolve, reject) {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoPaciente.promessaConexao;
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterPacientePeloCpf(cpf) {
    let connectionDB = await this.obterConexao();              
    return new Promise((resolve) => {
      let dbRefPaciente = ref(connectionDB,'paciente/' + cpf);
      let consulta = query(dbRefPaciente);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let paciente = dataSnapshot.val();
        if(paciente != null) 
          resolve(new Paciente(paciente.cpf, paciente.nome,paciente.email,paciente.telefone));
        else
          resolve(null);
      });
    });
  }

  //-----------------------------------------------------------------------------------------//

  async obterPacientes(gerarDTOs) {
    let connectionDB = await this.obterConexao();      
    
    return new Promise((resolve) => {
      let conjPacientes = [];      
      let dbRefPacientes = ref(connectionDB,'pacientes');
      let paramConsulta = orderByChild('cpf');
      let consulta = query(dbRefPacientes, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        dataSnapshot.forEach( (dataSnapshotObj) => {
            let elem = dataSnapshotObj.val();
            if(gerarDTOs === undefined)
              conjPacientes.push(new Paciente(elem.cpf,elem.nome,elem.email,elem,telefone));
            else
              conjPacientes.push(new pacienteDTO(new Paciente(elem.cpf,elem.nome,elem.email,elem,telefone)));
          });
          resolve(conjPacientes);
        },(e) => console.log("#" + e));
      });
    }

  //-----------------------------------------------------------------------------------------//

  async incluir(paciente) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {
      let dbRefPacientes = ref(connectionDB,'pacientes');
      runTransaction(dbRefPacientes, (pacientes) => {       
        let dbRefNovoPaciente = child(dbRefPacientes,paciente.getCpf());
        let setPromise = set(dbRefNovoPaciente,paciente);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(paciente) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefPacientes = ref(connectionDB,'pacientes');
      runTransaction(dbRefCursos, (pacientes) => {       
        let dbRefAlterarPaciente = child(dbRefPacientes, paciente.getCpf());
        let setPromise = set(dbRefAlterarPaciente, paciente);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(paciente) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefPaciente = ref(connectionDB,'pacientes');
      runTransaction(dbRefPaciente, (pacientes) => {       
        let dbRefExcluirPaciente = child(dbRefPaciente,paciente.getCpf());
        let setPromise = remove(dbRefExcluirPaciente, paciente);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  //-----------------------------------------------------------------------------------------//
}