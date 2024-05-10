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
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

import Usuario from "../usuario/usuario.js";
import UsuarioDTO from "../usuario/usuarioDTO.js";
import ModelError from "../ModelError.js";

export default class DaoUsuario {

  static promessaConexao = null;

  constructor() {
    this.obterConexao();
  }

  async obterConexao() {
    
    if (DaoUsuario.promessaConexao == null) {
      DaoUsuario.promessaConexao = new Promise(function (resolve, reject) {
        const db = getDatabase();
        if (db) resolve(db);
        else
          reject(
            new ModelError("Não foi possível estabelecer conexão com o BD")
          );
      });
    }
    return DaoUsuario.promessaConexao;
  }

  async obterUsuarioPeloUID(uid) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + uid);
      let consulta = query(dbRefUsuario);
      let resultPromise = get(consulta);
      resultPromise.then((dataSnapshot) => {
        let usr = dataSnapshot.val();
        if (usr != null)
          resolve(new Usuario(usr.email, usr.uid, usr.funcao));
        else resolve(null);
      });
    });
  }

  async obterUsuarioPeloEmail(email) {
    let connectionDB = await this.obterConexao();
    return new Promise((resolve) => {
      let dbRefUsuario = ref(connectionDB, "usuarios");
      let paramConsulta = orderByChild("email");
      let paramEqual = equalTo(email);
      let consulta = query(dbRefUsuario, paramConsulta, paramEqual);
      let resultPromise = get(consulta);
      resultPromise.then((dataSnapshot) => {
        let usr = dataSnapshot.val();
        if (usr != null) resolve(new Usuario(usr.email, usr.uid, usr.funcao));
        else resolve(null);
      });
    });
  }

  async obterUsuarios() {
    let connectionDB = await this.obterConexao();

    return new Promise((resolve) => {
      let conjUsuarios = [];
      let dbRefUsuarios = ref(connectionDB, "usuarios");
      let paramConsulta = orderByChild("email");
      let consulta = query(dbRefUsuarios, paramConsulta);
      let resultPromise = get(consulta);
      resultPromise.then(
        (dataSnapshot) => {
          dataSnapshot.forEach((dataSnapshotObj) => {
            let chave = dataSnapshotObj.key; 
            let elem = dataSnapshotObj.val();
            conjUsuarios.push(new Usuario(elem.email, elem.uid, elem.funcao));
          });
          resolve(conjUsuarios);
        },
        (e) => console.log("#" + e)
      );
    });
  }

  async incluir(usuario) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + usuario.getUid());
      let setPromise = set(dbRefUsuario, new UsuarioDTO(usuario));
      setPromise.then(
        (value) => {
          resolve(true);
        },
        (erro) => {
          reject(erro);
        }
      );
    });
    return resultado;
  }

  async alterar(usuario) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + usuario.getUid());
      let setPromise = set(dbRefUsuario, new UsuarioDTO(usuario));
      setPromise.then(
        (value) => {
          resolve(true);
        },
        (erro) => {
          reject(erro);
        }
      );
    });
    return resultado;
  }

  async excluir(usuario) {
    let connectionDB = await this.obterConexao();
    let resultado = new Promise((resolve, reject) => {
      let dbRefUsuario = ref(connectionDB, "usuarios/" + usuario.getUid());
      let setPromise = remove(dbRefUsuario);
      setPromise.then(
        (value) => {
          resolve(true);
        },
        (erro) => {
          reject(erro);
        }
      );
    });
    return resultado;
  }
}