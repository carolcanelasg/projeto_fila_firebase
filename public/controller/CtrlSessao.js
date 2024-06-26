"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  browserSessionPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

import {
  getDatabase,
  ref,
  query,
  onValue,
  onChildAdded,
  orderByChild,
  orderByKey,
  equalTo,
  get,
  set,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
import CtrlFila from "../controller/CtrlFila.js";
import CtrlHospitais from "../controller/CtrlHospitais.js";
import CtrlPaciente from "../controller/CtrlPaciente.js";
import CtrlReserva from "../controller/CtrlReserva.js";
import CtrlServico from "../controller/CtrlServico.js";
import DaoUsuario from "../model/usuario/DaoUsuario.js";
import Usuario from "../model/usuario/usuario.js";
import CtrlUsuario from "../controller/CtrlUsuario.js";

const swal = new Function("json,th", "swal(json).then(th)");

const firebaseConfig = {
  apiKey: "AIzaSyAnwVECL8SAhShBFT4-nEYjkt4tZ34NiLo",
  authDomain: "prj-unilasalle-kevin-borba.firebaseapp.com",
  databaseURL: "https://prj-unilasalle-kevin-borba-default-rtdb.firebaseio.com",
  projectId: "prj-unilasalle-kevin-borba",
  storageBucket: "prj-unilasalle-kevin-borba.appspot.com",
  messagingSenderId: "1006054485314",
  appId: "1:1006054485314:web:478338e52308a5ac6d2cdb",
  measurementId: "G-PMCPZ9RGQ1",
};

const app = initializeApp(firebaseConfig);

export default class CtrlSessao {
  #daoUsuario;

  constructor() {
    this.init();
  }

  async init() {
    console.log("Inferno : ");
    try {
      console.log("Inferno : ");
      this.usuario = await this.verificandoLogin();
      console.log("morri");
      if (document.URL.includes("pacientes.html")) {
        console.log("Inferno : " + document.URL.includes);
        this.ctrlAtual = new CtrlPaciente();
      } else if (document.URL.includes("hospitais.html"))
        this.ctrlAtual = new CtrlHospitais();
      else if (document.URL.includes("fila.html"))
        this.ctrlAtual = new CtrlFila();
      else if (document.URL.includes("reserva.html"))
        this.ctrlAtual = new CtrlReserva();
      else if (document.URL.includes("servico.html"))
        this.ctrlAtual = new CtrlServico();
      else if (document.URL.includes("usuario.html"))
        this.ctrlAtual = new CtrlUsuario();
    } catch (e) {
      alert(e);
    }
  }

  async verificandoLogin() {
    return new Promise((resolve, reject) => {
      console.log("aaaaaaaaa");
      const auth = getAuth(app);
      auth.setPersistence(browserSessionPersistence);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.#daoUsuario = new DaoUsuario();
          let usrSistema = await this.#daoUsuario.obterUsuarioPeloUID(user.uid);
          if (usrSistema == null) {
            await this.#daoUsuario.incluir(new Usuario(user.email, user.uid));
            reject(
              'A conta "' +
                user.email +
                '" não foi habilitada para usar este sistema'
            );
          } else {
            if (usrSistema.getFuncao() == "INABILITADO")
              reject(
                'O Administrador não concedeu à conta "' +
                  user.email +
                  '" acesso ao sistema'
              );
            resolve(user);
          }
        } else {
          reject("Você não realizou a autenticação via Google");
        }
      });
    });
  }
}

new CtrlSessao();