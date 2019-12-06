import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/i18n/i18next.min.js';

// Extend the LitElement base class
class I18nComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;
    i18next.init({
      lng: navigator.language,
      fallbackLng: 'en',
      resources: {
        en: {
          translation: {
            "hello_world": "Hello World !",
            "home": "Home",
            "Messages": "Messages",
            "say": "say",
            "add_note": "Add Note"
          }
        },
        fr: {
          translation: {
            "hello_world": "Salut tout le monde !",
            "home": "Accueil",
            "Messages": "Messages",
            "say": "dit",
            "add_note": "Ajouter une note"
          }
        },
        de: {
          translation: {
            "hello_world": "Hallo Welt !",
            "home": "Startseite",
            "Messages": "Nachrichten",
            "say": "sagte",
            "add_note": "Notiz hinzufügen"
          }
        },
        es: {
          translation: {
            "hello_world": "Hola Mundo !",
            "home": "Bienvenida",
            "Messages": "Mensajes",
            "say": "dicho",
            "add_note": "Añadir la nota"
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
  }

  render() {
    return html`
    <img src="./assets/flag/en.png" @click="${this.changeLanguage}" lang="en" >
    <img src="./assets/flag/fr.png" @click="${this.changeLanguage}" lang="fr" >
    <img src="./assets/flag/de.png" @click="${this.changeLanguage}" lang="de" >
    <img src="./assets/flag/es.png" @click="${this.changeLanguage}" lang="es" >
    `;
  }

  doSomething(params){
    console.log(params)
  }

  changeLanguage(event){
    var lang = event.target.getAttribute('lang')
    i18next.changeLanguage(lang)
    this.requestUpdate();
    this.agent.send('App', {action:"langChanged", lang: lang });
    this.agent.send('Messages', {action:"langChanged", lang: lang });
    this.agent.send('Notepod', {action:"langChanged", lang: lang });
  }

}

// Register the new element with the browser.
customElements.define('i18n-component', I18nComponent);
