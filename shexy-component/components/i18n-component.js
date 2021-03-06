import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/i18n/i18next.min.js';

// Extend the LitElement base class
class I18nComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      lang: {type: String}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    this.lang = navigator.language
    i18next.init({
      lng: this.lang,
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {
            "hello_world": "Hello World !",
            "home": "Home",
            "login": "Login",
            "logout": "Logout",
            "Messages": "Messages",
            "say": "say",
            "add_note": "Add Note",
            "info_app1": "This is a simple app to post some notes on your POD.",
            "info_app2": "If you want to post, you must login.",
            "info_app3": "And check all authorizations to this website as shown on this",
            "screenshot": "screenshot",
            "agora_publish": "Publish to Agora",
            "must_log" : "You must login to be able to post !",
            "add_annonce": "Add Classified",
          }
        },
        fr: {
          translation: {
            "hello_world": "Salut tout le monde !",
            "home": "Accueil",
            "login": "Connexion",
            "logout": "Deconnexion",
            "Messages": "Messages",
            "say": "dit",
            "add_note": "Ajouter une note",
            "info_app1": "Ceci est une petite app pour poster des notes sur votre POD.",
            "info_app2": "Si vous voulez poster, vous devez vous connecter.",
            "info_app3": "Et cochez toutes les autorisations comme dans cette",
            "screenshot": "capture d'écran",
            "agora_publish": "Publier sur l'Agora",
            "must_log" : "Vous devez vous connecter pour pouvoir poster !",
            "add_annonce": "Ajouter une Annonce",
          }
        },
        de: {
          translation: {
            "hello_world": "Hallo Welt !",
            "home": "Startseite",
            "login": "Einloggen",
            "logout": "Ausloggen",
            "Messages": "Nachrichten",
            "say": "sagte",
            "add_note": "Notiz hinzufügen",
            "info_app1": "Dies ist eine einfache App, mit der Sie einige Notizen auf Ihrem POD veröffentlichen können.",
            "info_app2": "Wenn Sie posten möchten, müssen Sie sich anmelden.",
            "info_app3": "Und überprüfen Sie alle Berechtigungen wie in diesem",
            "screenshot": "Screenshot",
            "agora_publish": "In Agora veröffentlichen",
            "must_log" : "Sie müssen sich anmelden, um einen Beitrag schreiben zu können!"
          }
        },
        es: {
          translation: {
            "hello_world": "Hola Mundo !",
            "home": "Bienvenida",
            "login": "Iniciar sesión",
            "logout": "Cerrar sesión",
            "Messages": "Mensajes",
            "say": "dicho",
            "add_note": "Añadir la nota",
            "info_app1": "Esta es una aplicación simple para publicar algunas notas en tu POD.",
            "info_app2": "Si desea publicar, debe iniciar sesión.",
            "info_app3": "Y verifique todos los permisos como en esta",
            "screenshot": "captura de pantalla",
            "agora_publish": "Publicar en Agora",
            "must_log" : "¡Debes iniciar sesión para poder publicar!"
          }
        }
      }
    });
  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "doSomething":
          // code block
          app.doSomething(message.params)
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
    this.informLanguage();
  }

  render() {
    return html`
    <img src="./assets/flag/en.png" @click="${this.changeLanguage}" lang="en" >
    <img src="./assets/flag/fr.png" @click="${this.changeLanguage}" lang="fr" >
    <img src="./assets/flag/es.png" @click="${this.changeLanguage}" lang="es" >
    <img src="./assets/flag/de.png" @click="${this.changeLanguage}" lang="de" >
    `;
  }

  doSomething(params){
    console.log(params)
  }

  changeLanguage(event){
    this.lang = event.target.getAttribute('lang')
    i18next.changeLanguage(this.lang)
    this.requestUpdate();
    this.informLanguage();
  }

  informLanguage(){
    this.agent.send('App', {action:"langChanged", lang: this.lang });
    this.agent.send('Messages', {action:"langChanged", lang: this.lang });
    this.agent.send('Notepod', {action:"langChanged", lang: this.lang });
    this.agent.send('Login', {action:"langChanged", lang: this.lang });
    this.agent.send('Login2', {action:"langChanged", lang: this.lang });
    this.agent.send('AgoraNotes', {action:"langChanged", lang: this.lang });
  }

}

// Register the new element with the browser.
customElements.define('i18n-component', I18nComponent);
