import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { SolidFileHelper } from '../helpers/solid-file-helper.js';

import  '../vendor/@lit-element-bootstrap/bs-form.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

import './i18n-component.js'

import './stream-component.js'

import { space} from '../vendor/rdf-namespaces/rdf-namespaces.min.js';

// Extend the LitElement base class
class PicpostComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      source: {type: String},
      notes: {type: Array},
      lang: {type: String},
      agoraNotesListUrl: {type: String},
      person: {type: Object},
      path: {type: String},
      filename: {type: String}
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
    this.sfh = new SolidFileHelper()
    this.path = ""
    this.filename = ""
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
    //  this.initNotePod()
    this.webId = person.webId
    this.storage = this.person.getRef(space.storage)
    console.log("storage",this.storage)
    this.sfh.readFolder(this.storage+"public/Picpost/").then(
      success => {

        console.log(success)
        if (typeof success == "String" && success.startsWith("404")){
          //  console.log("404 ERREUR §§§§§§§§§§§§§")
          this.sfh.createFolder(this.storage+"public/Picpost/").then(
            success => {console.log(success)},
            err => {console.log(err)})
          }

        },
        err => {console.log(err)})

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
        createTemp(e) {

          if (this.webId == null){
            alert(i18next.t('must_log'))
          }

          console.log(e.target)
          //  console.log(e.target.getAttribute("capture"))

          this.file = e.target.files[0];
          console.log("storage",this.storage)
          this.path = this.storage+"public/Picpost/"
          console.log(this.file)
          this.filename = this.file.name
          this.uri = this.path+this.filename

          var canvas =   this.shadowRoot.getElementById('canvas')
          var ctx = canvas.getContext('2d');
          var cw = canvas.width;
          var ch = canvas.height;
          var maxW=cw;
          var maxH=ch;

          var image = new Image;
          image.onload = function() {
            var iw=image.width;
            var ih=image.height;
            var scale=Math.min((maxW/iw),(maxH/ih));
            var iwScaled=iw*scale;
            var ihScaled=ih*scale;
            canvas.width=iwScaled;
            canvas.height=ihScaled;
            ctx.drawImage(image,0,0,iwScaled,ihScaled);
            //  ctx.drawImage(image, 0,0);
            //  alert('the image is drawn');
          }
          image.src = URL.createObjectURL(this.file);

          /*
          canvas.width = this.file.width;
          canvas.height = this.file.height;
          canvas.getContext('2d').drawImage(image, 0, 0);
          // Other browsers will fall back to image/png
          img.src = canvas.toDataURL('image/webp');*/

        }


        sendPic(){
          this.sfh.updateFile(this.uri, this.file)
          .then(
            success =>{
              console.log(success)
              //this.addNote()

            },
            err => {console.log(err)});
          }


          render() {
            const noteList = (notes) => html`
            <h3>My Picpost List (${notes.length})</h3>


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
              <link href="./vendor/fontawesome/css/all.css" rel="stylesheet">
              <link href="./vendor/bootstrap-4/css/bootstrap.min.css" rel="stylesheet">

              <style>
              .fa-disabled {
                opacity: 0.6;
                cursor: not-allowed;
              }

              i {
                padding: 10px
              }
              </style>





              <h3 class="m-0 font-weight-bold text-primary">${this.name} </h3>


              <div class="row">
              <form>
              <!--https://www.html5rocks.com/en/tutorials/getusermedia/intro/-->
              <div class="custom-file">
              <input type="file" class="custom-file-input" @change="${this.createTemp}" id="imageFile" accept="image/*;capture=camera">
              <label class="custom-file-label" for="imageFile"><i class="fas fa-camera-retro"></i> Image</label>
              </div>
              <div class="custom-file">
              <input type="file" class="custom-file-input" @change="${this.createTemp}" id="videoFile" accept="video/*;capture=camcorder">
              <label class="custom-file-label" for="videoFile"><i class="fas fa-video"></i> Video</label>
              </div>
              <div class="custom-file">
              <input type="file" class="custom-file-input" @change="${this.createTemp}" id="audioFile" accept="audio/*;capture=microphone">
              <label class="custom-file-label" for="audioFile"><i class="fas fa-microphone"></i> Audio</label>
              </div>
              </form>
              </div>

              <div class="row">
              Folder : <a href="${this.path}" target="_blank">${this.path}</a>
              </div>
              <div class="row">
              File <a href="${this.path+this.filename}" target="_blank">${this.filename}</a> <i title="rename" class="fas fa-file-signature fa-disabled"></i> <i title="copy" class="fas fa-copy fa-disabled"></i>
              </div>
              <div class="row"><canvas style="max-width: 100%; height: auto;" id="canvas"/></div>


              <!--<input type="file" class="form-control-file" @change="${this.sendPic}"  id="camera" accept="image/*" capture="camera"></input>
              <input type="file" @change="${this.sendPic}"  id="camcorder" accept="image/*" capture="camcorder">
              <input type="file" @change="${this.sendPic}" id="audio" accept="image/*" capture="audio">-->



              <bs-form-group>
              <bs-form-label slot="label">Legend</bs-form-label>
              <bs-form-textarea id ="notearea" rows="8" slot="control"></bs-form-textarea>


              </bs-form-group>
              <br>
              <bs-button primary @click=${this.sendPic}>${i18next.t('send_picture')}</bs-button>




              <bs-form-check-group>
              <bs-form-checkbox-input id="agora_pub" name="agora_pub" slot="check" checked></bs-form-checkbox-input>
              <bs-form-check-label slot="label">${i18next.t('agora_publish')}</bs-form-check-label>
              </bs-form-check-group>
              <br>

              <stream-component id="stream" name="Stream"></stream-component>

              <p>
              ${noteList(this.notes)}
              </p>
              `;
            }
          }

          // Register the new element with the browser.
          customElements.define('picpost-component', PicpostComponent);
