"use strict";

import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com";


import Reserva from "/model/reserva/Reserva.js";
import Paciente from "/model/paciente/Paciente.js";
import DaoPaciente from "/model/paciente/DaoPaciente.js";
import Servico from "/model/servico/Servico.js";
import DaoServico from "/model/servico/DaoServico.js";
import Fila from "/model/fila/Fila.js";
import DaoFila from "/model/fila/DaoFila.js";
import Hospitais from "/model/hospitais/Hospitais.js";
import DaoHospitais from "/model/hospitais/DaoHospitais.js";
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
  
  async obterReservaPeloId(id_reserva) {
    let connectionDB = await this.obterConexao();              
    return new Promise((resolve) => {
      let dbRefReserva = ref(connectionDB,'reservas/' + id_reserva);
      let consulta = query(dbRefReserva);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let reserva = dataSnapshot.val();
            if(reserva != null) {
                let promises = [];
                
                // Promise para obter informações do paciente
                let promisePaciente = new Promise(async (resolvePaciente) => {
                    let daoPaciente = new DaoPaciente();
                    let paciente = await daoPaciente.obterPacientePeloCpf(reserva.paciente);
                    resolvePaciente(paciente);
                });
                promises.push(promisePaciente);
                
                // Promise para obter informações do serviço
                let promiseServico = new Promise(async (resolveServico) => {
                    let daoServico = new DaoServico();
                    let servico = await daoServico.obterServicoPeloId(reserva.servico);
                    resolveServico(servico);
                });
                promises.push(promiseServico);
                
                // Promise para obter informações de fila
                let promiseFila= new Promise(async (resolveFila) => {
                    let daoFila = new DaoFila();
                    let fila = await daoFila.obterFilaPeloId(reserva.fila);
                    resolveFila(fila);
                });
                promises.push(promiseFila);

                // Promise para obter informações de hospitais
                let promiseHospitais= new Promise(async (resolveHospitais) => {
                  let daoHospitais = new DaoHospitais();
                  let hospitais = await daoHospitais.obterHospitalPeloId(reserva.hospitais);
                  resolveHospitais(hospitais);
              });
              promises.push(promiseHospitais);
                
                Promise.all(promises).then(([paciente, servico, fila, hospitais]) => {
                    resolve(new Reserva(paciente, servico, fila, hospitais, reserva.id_reserva, reserva.data));
                });
            } else {
                resolve(null);
            }
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

async obterReservas() {
  let connectionDB = await this.obterConexao();      
  
  return new Promise((resolve) => {
      let conjReservas = [];      
      let dbRefReservas = ref(connectionDB, 'reservas');
      let paramConsulta = orderByChild('id_reserva');
      let consulta = query(dbRefReservas, paramConsulta);
      let resultPromise = get(consulta);
      
      resultPromise.then(async (dataSnapshot) => {
          dataSnapshot.forEach(async (dataSnapshotObj) => {
              let elem = dataSnapshotObj.val();
              
              // Promise para obter informações do paciente
              let daoPaciente = new DaoPaciente();
              let paciente = await daoPaciente.obterPacientePeloCpf(elem.paciente);
              
              // Promise para obter informações do serviço
              let daoServico = new DaoServico();
              let servico = await daoServico.obterServicoPeloId(elem.servico);
              
              // Promise para obter informações da fila
              let daoFila = new DaoFila();
              let fila = await daoFila.obterFilaPeloId(elem.fila);

              // Promise para obter informações de hospitais
              let daoHospitais = new DaoHospitais();
              let hospitais = await daoHospitais.obterHospitalPeloId(elem.hospitais);
              
              conjReservas.push(new Reserva(paciente, servico, fila, hospitais, elem.id_reserva, elem.data));
          });
          
          Promise.all(conjAlunos).then(() => {
              resolve(conjAlunos);
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
        let dbRefNovaReserva = child(dbRefReservas,reserva.getIdReserva());

        reserva.paciente = reserva.paciente.getCpf();
        reserva.fila = reserva.fila.getId()
        reserva.servico = reserva.servico.getIdServico()
        reserva.hospitais = reserva.hospitais.getId()

        let setPromise = set(dbRefNovaReserva, reserva);
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
        let dbRefAlterarReserva = child(dbRefReservas,reserva.getIdReserva());

        reserva.paciente = reserva.paciente.getCpf();
        reserva.fila = reserva.fila.getId()
        reserva.servico = reserva.servico.getIdServico()
        reserva.hospitais = reserva.hospitais.getId()

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
      let dbRefReservas = ref(connectionDB,'reservas');
      runTransaction(dbRefReservas, (reservas) => {       
        let dbRefExcluirReserva = child(dbRefReservas,reserva.getIdReserva());
        let setPromise = remove(dbRefExcluirReserva, reserva);
        setPromise.then(value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//
}
