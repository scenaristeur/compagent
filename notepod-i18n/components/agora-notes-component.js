import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import './i18n-component.js'

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
    this.VCARD = new $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');
    this.FOAF = new $rdf.Namespace('http://xmlns.com/foaf/0.1/');
    this.SOLID = new $rdf.Namespace('http://www.w3.org/ns/solid/terms#');
    this.SCHEMA = new $rdf.Namespace('http://schema.org/');
    this.SPACE = new $rdf.Namespace('http://www.w3.org/ns/pim/space#');
    this.RDF = new $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    this.RDFS = new $rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
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
    this.getAgoraData()
  }

  render() {
    const noteList = (notes) => html`
    Note on Agora(${notes.length})<br> <small><a href="${this.agoraNotesListUrl}" target="_blank">${this.agoraNotesListUrl}</a></small><br>
    <ul>
    ${notes.map((n) => html`
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
      ${noteList(this.notes)}
      `;
    }


    getAgoraData(){
      var app = this
      Tripledoc.fetchDocument(app.agoraNotesListUrl).then(
        notesList => {
          app.notesList = notesList;

          console.log("app.notesList",app.notesList)
          app.notesUri = notesList.findSubjects(app.RDF('type'),app.SCHEMA('TextDigitalDocument'))
          //  console.log("notesUri",app.notesUri)
          app.notes = []
          app.notesUri.forEach(function (nuri){
            //var subj = nuri.getLocalSubject()
            //  console.log("nuri",nuri)
            //  console.log("doc",nuri.getDocument())
            var text = nuri.getString(app.SCHEMA('text'))
            var date = nuri.getDateTime(app.SCHEMA('dateCreated'))
            var creator = nuri.getRef(app.SCHEMA('creator'))
            var also = nuri.getRef(app.RDFS('seeAlso'))
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
        })
      }

    }

    // Register the new element with the browser.
    customElements.define('agora-notes-component', AgoraNotesComponent);