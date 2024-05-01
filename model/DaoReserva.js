"use strict";

import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com";


import Reserva from "/model/Reserva.js";
import ReservaDTO from "/model/ReservaDTO.js";
import ModelError from "/model/ModelError.js";

export default class DaoReserva {
  
  //-----------------------------------------------------------------------------------------//

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  async obterConexao() {

    if(DaoReserva.promessaConexao == null) {
      DaoReserva.promessaConexao = new Promise(function(resolve, reject) {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoReserva.promessaConexao;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  async obterReservaPelaData(data) {
    let connectionDB = await this.obterConexao();              
    return new Promise((resolve) => {
      let dbRefReserva = ref(connectionDB,'reservas/' + reserva);
      let consulta = query(dbRefReserva);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let reserva = dataSnapshot.val();
        if(reserva != null) 
          resolve(new Reserva(reserva.nome_paciente,reserva.tipo_reserva,reserva.data));
        else
          resolve(null);
      });
    });
  }

  //-----------------------------------------------------------------------------------------//

  async obterReservas(gerarDTOs) {
    let connectionDB = await this.obterConexao();      
    
    return new Promise((resolve) => {
      let conjReservas = [];      
      let dbRefReservas = ref(connectionDB,'reservas');
      let paramConsulta = orderByChild('data');
      let consulta = query(dbRefReservas, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        dataSnapshot.forEach( (dataSnapshotObj) => {
            let elem = dataSnapshotObj.val();
            if(gerarDTOs === undefined)
              conjReservas.push(new Reserva(elem.nome_paciente,elem.tipo_reserva,elem.data));
            else
              conjReservas.push(new ReservaDTO(new Reserva(elem.nome_paciente,elem.tipo_reserva,elem.data)));
            });
        });
    });
}

  //-----------------------------------------------------------------------------------------//

  async incluir(reserva) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {
      let dbRefReservas = ref(connectionDB,'reservas');
      runTransaction(dbRefReservas, (reservas) => {       
        let dbRefNovaReserva = child(dbRefReservas,reserva.getSigla());
        let setPromise = set(dbRefNovaReserva,reserva);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(reserva) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefReservas = ref(connectionDB,'reservas');
      runTransaction(dbRefReservas, (reservas) => {       
        let dbRefAlterarReserva = child(dbRefReservas, reserva.getSigla());
        let setPromise = set(dbRefAlterarReserva, reserva);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(reserva) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefReserva = ref(connectionDB,'reservas');
      runTransaction(dbRefReserva, (reservas) => {       
        let dbRefExcluirReserva = child(dbRefReserva,reserva.getSigla());
        let setPromise = remove(dbRefExcluirReserva, reserva);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  //-----------------------------------------------------------------------------------------//
}
