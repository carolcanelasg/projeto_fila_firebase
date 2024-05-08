"use strict";

import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com";


import Hospital from "/model/Hospital.js";
import Hospital from "/model/HospitalDTO.js";
import ModelError from "/model/ModelError.js";

export default class DaoHospital {
  
  //-----------------------------------------------------------------------------------------//

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  async obterConexao() {

    if(DaoHospital.promessaConexao == null) {
      DaoHospital.promessaConexao = new Promise(function(resolve, reject) {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoHospital.promessaConexao;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  async obterFilaPeloId(id_hospital) {
    let connectionDB = await this.obterConexao();              
    return new Promise((resolve) => {
      let dbRefHospital = ref(connectionDB,'hospitais/' + hospital);
      let consulta = query(dbRefHospital);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let hospital = dataSnapshot.val();
        if(hospital != null) 
          resolve(new Fila(hospital.nome,hospital.endereco,hospital.telefone,hospital.id_hospital));
        else
          resolve(null);
      });
    });
  }

  //-----------------------------------------------------------------------------------------//

  async obterFilas(gerarDTOs) {
    let connectionDB = await this.obterConexao();      
    
    return new Promise((resolve) => {
      let conjFilas = [];      
      let dbRefFilas = ref(connectionDB,'filas');
      let paramConsulta = orderByChild('id_fila');
      let consulta = query(dbRefFilas, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        dataSnapshot.forEach( (dataSnapshotObj) => {
            let elem = dataSnapshotObj.val();
            if(gerarDTOs === undefined)
              conjFilas.push(new Fila(elem.tipo_fila,elem.id_fila,elem.tempo_medio));
            else
              conjFilas.push(new FilaDTO(new Fila(elem.tipo_fila,elem.id_fila,elem.tempo_medio)));
            });
        });
    });
}

  //-----------------------------------------------------------------------------------------//

  async incluir(hospital) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {
      let dbRefHospitais = ref(connectionDB,'hospitais');
      runTransaction(dbRefHospitais, (hospitais) => {       
        let dbRefNovoHospital = child(dbRefHospitais,hospital.getSigla());
        let setPromise = set(dbRefNovoHospital,hospital);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(hospital) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefHospitais = ref(connectionDB,'hospitais');
      runTransaction(dbRefHospitais, (hospitais) => {       
        let dbRefAlterarHospital = child(dbRefHospitais, hospital.getSigla());
        let setPromise = set(dbRefAlterarHospital, hospital);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(hospital) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefHospital = ref(connectionDB,'hospitais');
      runTransaction(dbRefHospital, (hospitais) => {       
        let dbRefExcluirHospital = child(dbRefHospital,hospital.getSigla());
        let setPromise = remove(dbRefExcluirHospital, hospital);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  //-----------------------------------------------------------------------------------------//
}