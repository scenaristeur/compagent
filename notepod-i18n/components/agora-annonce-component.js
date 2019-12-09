import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './i18n-component.js'

import {vcard, foaf, solid, schema, space, rdf, rdfs} from '../vendor/rdf-namespaces/rdf-namespaces.min.js';

// Extend the LitElement base class
class AgoraAnnonceComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      agoraAnnoncesListUrl: {type: String},
          annonces: {type: Array},
      lang: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.agoraAnnoncesListUrl = "https://agora.solid.community/public/Annonce/annonces.ttl"
    this.annonces = []
    this.lang=navigator.language
/*    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
    this.AGORA = new $rdf.Namespace('https://agora.solid.community/public/')*/

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "langChanged":
          app.lang = message.lang;
          app.requestUpdate();
          break;
          default:
          // code block
          console.log("Unknown action ",message)
        }
      }
    };
    this.getAgoraData()
  }

  render() {
    const annonceList = (annonces) => html`
    Annonces on Agora (${annonces.length})<br> <small><a href="${this.agoraAnnoncesListUrl}" target="_blank">${this.agoraAnnoncesListUrl}</a></small><br>
    <ul>
    ${annonces.map((n) => html`
      <li>
      ${n.text}
      <br><small>${n.date.toLocaleString(this.lang, { timeZone: 'UTC' })}
      <a href="${n.creator}" ?hidden=${n.creator == null} title="${n.creator}" target="_blank">creator</a>
      <a href="${n.also}" ?hidden=${n.also == null} title="${n.also}" target="_blank">see also</a>
      </small>

      </li>
      `)}
      </ul>
      `;

      return html`
      ${annonceList(this.annonces)}
      `;
    }


    getAgoraData(){
      var app = this
      Tripledoc.fetchDocument(app.agoraAnnoncesListUrl).then(
        annoncesList => {
          app.annoncesList = annoncesList;
          console.log("app.annoncesList",app.annoncesList)




          app.annoncesUri = annoncesList.findSubjects(rdf.type, 'https://agora.solid.community/public/Annonce')
          //  console.log("annoncesUri",app.annoncesUri)
          app.annonces = []
          app.annoncesUri.forEach(function (nuri){
            //var subj = nuri.getLocalSubject()
            //  console.log("nuri",nuri)
            //  console.log("doc",nuri.getDocument())
            var text = nuri.getString(schema.text)
            var date = nuri.getDateTime(schema.dateCreated)
            var creator = nuri.getRef(schema.creator)
            var also = nuri.getRef(rdfs.seeAlso)
            //  console.log(text, date)
            var annonce = {}
            annonce.text = text;
            annonce.date = date;
            annonce.creator = creator;
            annonce.also = also;
            //text = nuri.getAllStrings()*/
            app.annonces = [... app.annonces, annonce]
          })

          app.annonces.reverse()
          console.log(app.annonces)


          if (app.socket == undefined){
            app.subscribe()
          }else{
            console.log("socket exist deja")
          }

        })
      }

      subscribe(){
        var app = this
        //https://github.com/scenaristeur/spoggy-chat-solid/blob/master/index.html
        var websocket = this.annoncesList.getWebSocketRef();
        console.log("WEBSOCK",websocket)
        app.socket = new WebSocket(websocket);
        console.log ("socket",app.socket)
        app.socket.onopen = function() {
          const d = new Date();
          var now = d.toLocaleTimeString(app.lang) + `.${d.getMilliseconds()}`
          this.send('sub '+app.agoraAnnoncesListUrl);
          app.agent.send('Messages', now+"[souscription] "+app.agoraAnnoncesListUrl)
          //  this.send('sub https://spoggy.solid.community/public/test/fichier2.ttl');
          /*  this.send('sub https://spoggy.solid.community/public/test');
          this.send('sub https://spoggy.solid.community/public/test/index.ttl');*/
          //  document.getElementById("notification").value = now+"[souscription] "+whiteboardUrl+"\n"+document.getElementById("notification").value;
          //  document.getElementById("notification").value = now+"[souscription] fichier2.ttl\n"+document.getElementById("notification").value;
          console.log("OPENED SOCKET",app.socket)
        };
        app.socket.onmessage = function(msg) {
          if (msg.data && msg.data.slice(0, 3) === 'pub') {
            // resource updated, refetch resource
            const d = new Date();
            var now = d.toLocaleTimeString(app.lang) + `.${d.getMilliseconds()}`
            console.log("msg",msg);
            console.log("data",msg.data)
            //  document.getElementById("notification").value = now+"[notification] "+msg.data+"\n"+document.getElementById("notification").value;
            app.getAgoraData()

          }
          else{console.log("message inconnu",msg)}
        };
      }




    }

    // Register the new element with the browser.
    customElements.define('agora-annonce-component', AgoraAnnonceComponent);
