"use strict";

import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com";


import Hospitais from "/model/hospitais/Hospitais.js";
import hospitaisDTO from "/model/hospitais/hospitaisDTO.js";
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
  
  async obterHospitalPeloId(id_hospital) {
    let connectionDB = await this.obterConexao();              
    return new Promise((resolve) => {
      let dbRefHospital = ref(connectionDB,'hospital/' + id_hospital);
      let consulta = query(dbRefHospital);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let hospital = dataSnapshot.val();
        if(hospital != null) 
          resolve(new Hospitais(hospital.nome,hospital.endereco,hospital.telefone,hospital.id_hospital));
        else
          resolve(null);
      });
    });
  }

  //-----------------------------------------------------------------------------------------//


  async obterHospitais(gerarDTOs) {
    let connectionDB = await this.obterConexao();      
    
    return new Promise((resolve) => {
      let conjHospitais = [];      
      let dbRefHospitais = ref(connectionDB,'hospitais');
      let paramConsulta = orderByChild('nome');
      let consulta = query(dbRefHospitais, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        dataSnapshot.forEach(dataSnapshotObj => {
          let elem = dataSnapshotObj.val();
          if(gerarDTOs === undefined)
            conjHospitais.push(new Hospitais(elem.nome,elem.endereco,elem.telefone,elem.id_hospital));
          else
            conjHospitais.push(new hospitaisDTO(new Hospitais(elem.nome,elem.endereco,elem.telefone,elem.id_hospital)));
        });
        resolve(conjHospitais);
      },(e) => console.log("#" + e));
    });
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(hospital) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {
      let dbRefHospitais = ref(connectionDB,'hospitais');
      runTransaction(dbRefHospitais, (hospitais) => {       
        let dbRefNovoHospital = child(dbRefHospitais,hospital.getId());
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
        let dbRefAlterarHospital = child(dbRefHospitais, hospital.getId());
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
        let dbRefExcluirHospital = child(dbRefHospital,hospital.getId());
        let setPromise = remove(dbRefExcluirHospital, hospital);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  //-----------------------------------------------------------------------------------------//
}