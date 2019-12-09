import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './i18n-component.js'

import  '../vendor/@lit-element-bootstrap/bs-list-group.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

import {vcard, foaf, solid, schema, space, rdf, rdfs} from '../vendor/rdf-namespaces/rdf-namespaces.min.js';
// Extend the LitElement base class
class AgoraNotesComponent extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      agoraNotesListUrl: {type: String},
      notes: {type: Array},
      lang: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "unknown"
    this.notes = []
    this.lang=navigator.language
    this.agoraNotesListUrl = "https://agora.solid.community/public/notes.ttl"
    /*    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')*/
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

    const noteList = (notes) => html`
    <h3>    Notes on Agora (${notes.length})</h3>


    <bs-link-button primary small
    href="${this.agoraNotesListUrl}"
    target="_blank">
    ${this.agoraNotesListUrl}
    </bs-link-button>

    <bs-list-group-action>
    ${notes.map((n) => html`
      <bs-list-group-item-action-link class="flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between">
      <!--              <h5 class="mb-1">${n.title}</h5>-->

      </div>
      <p class="mb-1">
      <div style="white-space: pre-wrap">${n.text}</div>
      </p>
      <!--<small>Donec id elit non mi porta.</small>-->
      <small>${n.date.toLocaleString(this.lang, { timeZone: 'UTC' })}</small>
      <bs-link-button primary small
      href="${n.creator}"
      ?hidden=${n.creator == null}
      target="_blank"
      title="${n.creator}">
      Creator
      </bs-link-button>

      <bs-link-button primary small
      href="${n.also}"
      ?hidden=${n.also == null}
      title="${n.also}"
      target="_blank">
      See Also
      </bs-link-button>
      </bs-list-group-item-action-link>
      `)}
      </bs-list-group-action>
      `;

      return html`


      ${noteList(this.notes)}
      `;
    }


    getAgoraData(){
      var app = this
      Tripledoc.fetchDocument(app.agoraNotesListUrl).then(
        notesList => {
          app.notesList = notesList;

          console.log("app.notesList",app.notesList)




          app.notesUri = notesList.findSubjects(rdf.type, schema.TextDigitalDocument)
          //  console.log("notesUri",app.notesUri)
          app.notes = []
          app.notesUri.forEach(function (nuri){
            //var subj = nuri.getLocalSubject()
            //  console.log("nuri",nuri)
            //  console.log("doc",nuri.getDocument())
            var text = nuri.getString(schema.text)
            var date = nuri.getDateTime(schema.dateCreated)
            var creator = nuri.getRef(schema.creator)
            var also = nuri.getRef(rdfs.seeAlso)
            //  console.log(text, date)
            var note = {}
            note.text = text;
            note.date = date;
            note.creator = creator;
            note.also = also;
            //text = nuri.getAllStrings()*/
            app.notes = [... app.notes, note]
          })

          app.notes.reverse()
          console.log(app.notes)


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
        var websocket = this.notesList.getWebSocketRef();
        console.log("WEBSOCK",websocket)
        app.socket = new WebSocket(websocket);
        console.log ("socket",app.socket)
        app.socket.onopen = function() {
          const d = new Date();
          var now = d.toLocaleTimeString(app.lang) + `.${d.getMilliseconds()}`
          this.send('sub '+app.agoraNotesListUrl);
          app.agent.send('Messages', now+"[souscription] "+app.agoraNotesListUrl)
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
    customElements.define('agora-notes-component', AgoraNotesComponent);
