"use strict";

import { getDatabase, ref, query, onValue, onChildAdded, orderByChild, 
        child, orderByKey, equalTo, get, set, remove, push, runTransaction } 
  from "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com";


import Servico from "/model/servico/Servico.js";
import ServicoDTO from "/model/servico/ServicoDTO.js";
import ModelError from "/model/ModelError.js";

export default class DaoServico {
  
  //-----------------------------------------------------------------------------------------//

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  async obterConexao() {

    if(DaoServico.promessaConexao == null) {
      DaoServico.promessaConexao = new Promise(function(resolve, reject) {
        const db = getDatabase();
        if(db)
            resolve(db);
        else 
            reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
      });
    }
    return DaoServico.promessaConexao;
  }
  
  //-----------------------------------------------------------------------------------------//
  
  async obterServicoPeloId(id_servico) {
    let connectionDB = await this.obterConexao();              
    return new Promise((resolve) => {
      let dbRefServico = ref(connectionDB,'servicos/' + id_servico);
      let consulta = query(dbRefServico);
      let resultPromise = get(consulta);
      resultPromise.then(async (dataSnapshot) => {
        let servico = dataSnapshot.val();
        if(servico != null) 
          resolve(new Servico(servico.nome_servico,servico.quantidade_atendimento,servico.id_servico));
        else
          resolve(null);
      });
    });
  }

  //-----------------------------------------------------------------------------------------//

  async obterServicos(gerarDTOs) {
    let connectionDB = await this.obterConexao();      
    
    return new Promise((resolve) => {
      let conjServicos = [];      
      let dbRefServicos = ref(connectionDB,'servicos');
      let paramConsulta = orderByChild('id_servico');
      let consulta = query(dbRefServicos, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(dataSnapshot => {
        dataSnapshot.forEach(dataSnapshotObj => {
          let elem = dataSnapshotObj.val();
          if(gerarDTOs === undefined)
            conjServicos.push(new Servico(elem.nome_servico,elem.quantidade_atendimento,elem.id_servico));
          else
            conjServicos.push(new CursoDTO(new Curso(elem.nome_servico,elem.quantidade_atendimento,elem.id_servico)));
        });
        resolve(conjServicos);
      },(e) => console.log("#" + e));
    });
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(servico) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {
      let dbRefServicos = ref(connectionDB,'servicos');
      runTransaction(dbRefServicos, (servicos) => {       
        let dbRefNovoServico = child(dbRefServicos,servico.getIdServico());
        let setPromise = set(dbRefNovoServico,servico);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(servico) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefServicos = ref(connectionDB,'servicos');
      runTransaction(dbRefCursos, (servicos) => {       
        let dbRefAlterarServico = child(dbRefServicos, servico.getIdServico());
        let setPromise = set(dbRefAlterarServico, servico);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(servico) {
    let connectionDB = await this.obterConexao();    
    //--------- PROMISE --------------//
    let resultado = new Promise( (resolve, reject) => {   
      let dbRefServico = ref(connectionDB,'servicos');
      runTransaction(dbRefServico, (servicos) => {       
        let dbRefExcluirServico = child(dbRefServico,servico.getIdServico());
        let setPromise = remove(dbRefExcluirServico, servico);
        setPromise.then( value => {resolve(true)},  erro => {reject(erro)});
      });
    });
    return resultado;
  }

  //-----------------------------------------------------------------------------------------//
}
