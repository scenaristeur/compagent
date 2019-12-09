import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

import  '../vendor/@lit-element-bootstrap/bs-form.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

import './i18n-component.js'

import {vcard, foaf, solid, schema, space, rdf, rdfs} from '../vendor/rdf-namespaces/rdf-namespaces.min.js';

// Extend the LitElement base class
class NotepodComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      source: {type: String},
      notes: {type: Array},
      lang: {type: String},
      agoraNotesListUrl: {type: String},
      person: {type: Object}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From my-element';
    this.name = "unknown"
    this.person = {}
    this.source = "unknown"
    this.agoraNotesListUrl = "https://agora.solid.community/public/notes.ttl"
    this.notes = []
    this.lang=navigator.language
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
          case "sessionChanged":
          app.sessionChanged(message.webId)
          break;
          case "personChanged":
          app.personChanged(message.person)
          break;
          case "langChanged":
          app.lang = message.lang;
          app.requestUpdate();
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }


  personChanged(person){
    this.person=person;
    this.initNotePod()
  }


  sessionChanged(webId){
    this.webId = webId

    if (this.webId != null){
      //this.getUserData()
      //
    }else{
      this.notes = []
    }
  }

  /*
  getUserData(){
  var app = this;
  Tripledoc.fetchDocument(app.webId).then(
  doc => {
  //    console.log("DOC",doc)
  //    console.log(doc.getStatements())
  app.doc = doc;
  app.person = doc.getSubject(app.webId);
  console.log("personne",app.person)
  app.username = app.person.getString(app.FOAF('name'))
  app.friends = app.person.getAllRefs(app.FOAF('knows'))

  console.log("Friends",app.friends)
  app.initNotePod()
  app.agent.send('Profile',{action: "usernameChanged", username: app.username})
  app.agent.send('Profile',{action: "sessionChanged", webId: app.webId})
  app.agent.send('Friends',{action: "friendsChanged", friends: app.friends})
  const storage = app.person.getRef(app.SPACE('storage'))
  console.log("storage",storage)
  app.agent.send('Storage',{action: "storageChanged", storage: storage})
},
err => {
console.log(err)
}
);
}*/

initNotePod(){
  var app = this;
  app.publicTypeIndexUrl = app.person.getRef(solid.publicTypeIndex)
  //console.log("publicTypeIndexUrl",app.publicTypeIndexUrl)

  Tripledoc.fetchDocument(app.publicTypeIndexUrl).then(
    publicTypeIndex => {
      app.publicTypeIndex = publicTypeIndex;
      app.notesListEntry = app.publicTypeIndex.findSubject(solid.forClass, schema.TextDigitalDocument);
      //  console.log("app.notesListEntry",app.notesListEntry)
      if (app.notesListEntry === null){
        app.notesListUrl = app.initialiseNotesList(app.person, app.publicTypeIndex)
      }else{
        app.notesListUrl = app.notesListEntry.getRef(solid.instance)
        //  console.log("notesListUrl",app.notesListUrl)

      }
      app.getNotes()
    },
    err => {console.log(err)}
  );
}


getNotes(){
  var app = this;
  //  console.log("getNotes at ",app.notesListUrl)
  Tripledoc.fetchDocument(app.notesListUrl).then(
    notesList => {
      app.notesList = notesList;

      //    console.log("app.notesList",app.notesList)
      app.notesUri = notesList.findSubjects(rdf.type, schema.TextDigitalDocument)
      //  console.log("notesUri",app.notesUri)
      app.notes = []
      app.notesUri.forEach(function (nuri){
        var subject = nuri.asNodeRef()
        //  console.log("subject",subject)
        //  console.log("doc",nuri.getDocument())
        var text = nuri.getString(schema.text)
        var date = nuri.getDateTime(schema.dateCreated)
        //  console.log(text, date)
        var note = {}
        note.text = text;
        note.date = date;
        note.subject = subject;
        //text = nuri.getAllStrings()*/
        app.notes = [... app.notes, note]
      })

      app.notes.reverse()
    })
  }



  addNote(){
    var app = this

    //  console.log(app.notesList)
    if (app.notesList == undefined){
      alert(i18next.t('must_log'))
    }else{
      var textarea = this.shadowRoot.getElementById('notearea').shadowRoot.querySelector(".form-control")
      var note = textarea.value.trim()
      textarea.value = ""
      //  console.log(note)
      const newNote = app.notesList.addSubject();
      var date = new Date(Date.now())
      // Indicate that the Subject is a schema:TextDigitalDocument:
      newNote.addRef(rdf.type, schema.TextDigitalDocument);
      // Set the Subject's `schema:text` to the actual note contents:
      newNote.addLiteral(schema.text, note);
      // Store the date the note was created (i.e. now):
      newNote.addLiteral(schema.dateCreated, date)

console.log(newNote.asNodeRef())



      app.notesList.save([newNote]).then(
        success=>{
          var checkAgora = this.shadowRoot.getElementById('agora_pub').shadowRoot.firstElementChild.checked
          if(checkAgora == true){
            app.updateAgora(note, date, newNote.asNodeRef())
          }
          app.initNotePod()
        },
        err=>{
          console.log(err)
          alert(err)
        });
      }

    }

    updateAgora(note,date, subject){
      var app = this;
      //  console.log("app.agoraNotesListUrl",app.agoraNotesListUrl)
      Tripledoc.fetchDocument(app.agoraNotesListUrl).then(
        agoraNotesList => {
          app.agoraNotesList = agoraNotesList;
          //  console.log("app.agoraNotesList",app.agoraNotesList)
          const newNote = app.agoraNotesList.addSubject();
          // Indicate that the Subject is a schema:TextDigitalDocument:
          newNote.addRef(rdf.type, schema.TextDigitalDocument);
          // Set the Subject's `schema:text` to the actual note contents:
          newNote.addLiteral(schema.text, note);
          // Store the date the note was created (i.e. now):
          newNote.addLiteral(schema.dateCreated, date)
          // add ref to user note
          newNote.addRef(rdfs.seeAlso, subject);
          newNote.addRef(schema.creator, app.webId);

          app.agoraNotesList.save([newNote]).then(
            success=>{
              console.log("success agora", success)
              //  app.initNotePod()
            },
            err=>{
              console.log(err)
            });
          });
        }

        initialiseNotesList(profile,typeIndex){
          var app = this;
          console.log("creation a revoir")
          const storage = profile.getRef(space.storage)
          //    console.log("storage",storage)
          app.agent.send('Storage',{action: "storageChanged", storage: storage})

          const notesListUrl = storage + 'public/notes.ttl';

          const notesList = Tripledoc.createDocument(notesListUrl);
          notesList.save();

          // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
          const typeRegistration = typeIndex.addSubject();
          typeRegistration.addRef(rdf.type, solid.TypeRegistration)
          typeRegistration.addRef(solid.instance, notesList.asRef())
          typeRegistration.addRef(solid.forClass, schema.TextDigitalDocument)
          typeIndex.save([ typeRegistration ]);

          return notesListUrl
          /*// Get the root URL of the user's Pod:
          const storage = profile.getRef(space.storage);

          // Determine at what URL the new Document should be stored:
          const notesListUrl = storage + 'public/notes.ttl';
          // Create the new Document:
          const notesList = createDocument(notesListUrl);
          await notesList.save();

          // Store a reference to that Document in the public Type Index for `schema:TextDigitalDocument`:
          const typeRegistration = typeIndex.addSubject();
          typeRegistration.addRef(rdf.type, solid.TypeRegistration)
          typeRegistration.addRef(solid.instance, document.asRef())
          typeRegistration.addRef(solid.forClass, schema.TextDigitalDocument)
          await typeIndex.save([ typeRegistration ]);

          // Then finally return the new Document:
          return notesList;
          */
        }

        render() {
          const noteList = (notes) => html`
        <h3>My  Note List (${notes.length})</h3>


          <bs-list-group-action>
          ${notes.map((n) => html`
            <bs-list-group-item-action-link class="flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
            <!--  <h5 class="mb-1">${n.title}</h5> -->
            </div>
            <p class="mb-1">
              <div style="white-space: pre-wrap">${n.text}</div>
              </p>
            <!--<small>Donec id elit non mi porta.</small>-->
            <small>${n.date.toLocaleString(this.lang, { timeZone: 'UTC' })}</small>
            <bs-link-button primary small href="${n.subject}" target="_blank">Open</bs-link-button>
            </bs-list-group-item-action-link>
            `)}
            </bs-list-group-action>

              `;

              return html`
              <h3 class="m-0 font-weight-bold text-primary">${this.name}</h3>
              <bs-form-group>
              <!--<bs-form-label slot="label">Example textarea</bs-form-label>-->
              <bs-form-textarea id ="notearea" rows="8" slot="control"></bs-form-textarea>
              </bs-form-group>
              <br>
              <bs-button primary @click=${this.addNote}>${i18next.t('add_note')}</bs-button>
              <bs-form-check-group>
              <bs-form-checkbox-input id="agora_pub" name="agora_pub" slot="check" checked></bs-form-checkbox-input>
              <bs-form-check-label slot="label">${i18next.t('agora_publish')}</bs-form-check-label>
              </bs-form-check-group>
              <br>
              <p>
              ${noteList(this.notes)}
              </p>
              `;
            }
          }

          // Register the new element with the browser.
          customElements.define('notepod-component', NotepodComponent);
