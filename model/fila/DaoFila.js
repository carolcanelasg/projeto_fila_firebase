"use strict";

import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com";


import Fila from "/model/Fila.js";
import Fila from "/model/FilaDTO.js";
import ModelError from "/model/ModelError.js";

export default class DaoFila {
  
  //-----------------------------------------------------------------------------------------//

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  async obterConexao() {

    if(DaoFila.promessaConexao == null) {
      DaoFila.promessaConexao = new Promise(function(resolve, reject) {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoFila.promessaConexao;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  async obterFilaPeloId(id_fila) {
    let connectionDB = await this.obterConexao();              
    return new Promise((resolve) => {
      let dbRefFila = ref(connectionDB,'filas/' + fila);
      let consulta = query(dbRefFila);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let fila = dataSnapshot.val();
        if(fila != null) 
          resolve(new Fila(fila.tipo_fila,fila.id_fila,fila.tempo_medio));
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

  async incluir(fila) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {
      let dbRefFilas = ref(connectionDB,'filas');
      runTransaction(dbRefFilas, (filas) => {       
        let dbRefNovoFila = child(dbRefFilas,fila.getSigla());
        let setPromise = set(dbRefNovoFila,fila);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(fila) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefFilas = ref(connectionDB,'filas');
      runTransaction(dbRefCursos, (filas) => {       
        let dbRefAlterarFila = child(dbRefFilas, fila.getSigla());
        let setPromise = set(dbRefAlterarFila, fila);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(fila) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefFila = ref(connectionDB,'filas');
      runTransaction(dbRefFila, (filas) => {       
        let dbRefExcluirFila = child(dbRefFila,fila.getSigla());
        let setPromise = remove(dbRefExcluirFila, fila);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  //-----------------------------------------------------------------------------------------//
}