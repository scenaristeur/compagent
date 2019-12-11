import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';
import { SolidFileHelper } from '../helpers/solid-file-helper.js';

import  '../vendor/@lit-element-bootstrap/bs-form.bundle.js';
import  '../vendor/@lit-element-bootstrap/bs-button.bundle.js';

import './i18n-component.js'

import './stream-component.js'

import { space, schema, solid, rdf, rdfs} from '../vendor/rdf-namespaces/rdf-namespaces.min.js';

// Extend the LitElement base class
class PicpostComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      source: {type: String},
      pics: {type: Array},
      lang: {type: String},
      agoraPicsListUrl: {type: String},
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
    this.agoraPicsListUrl = "https://agora.solid.community/public/Picpost/pics.ttl"
    this.pics = []
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
    /*
    $custom-file-text: (
    en: "Browse",
    es: "Elegir",
    fr: "Parcourir",
    de: "Durchsuchen"
  );*/
}


personChanged(person){
  this.person=person;
  this.initPicPod()
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
        this.pics = []
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
    app.initpicPod()
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

initPicPod(){
  var app = this;
  app.publicTypeIndexUrl = app.person.getRef(solid.publicTypeIndex)
  console.log("publicTypeIndexUrl",app.publicTypeIndexUrl)

  Tripledoc.fetchDocument(app.publicTypeIndexUrl).then(
    publicTypeIndex => {
      app.publicTypeIndex = publicTypeIndex;
      app.picsListEntry = app.publicTypeIndex.findSubject(solid.forClass, schema.MediaObject);
      console.log("app.picsListEntry",app.picsListEntry)
      if (app.picsListEntry === null){
        app.picsListUrl = app.initialisePicsList(app.person, app.publicTypeIndex)
      }else{
        app.picsListUrl = app.picsListEntry.getRef(solid.instance)
          console.log("picsListUrl",app.picsListUrl)

      }
      app.getPics()
    },
    err => {console.log(err)}
  );
}


getPics(){
  var app = this;
  //  console.log("getpics at ",app.picsListUrl)
  Tripledoc.fetchDocument(app.picsListUrl).then(
    picsList => {
      app.picsList = picsList;

      //    console.log("app.picsList",app.picsList)
      app.picsUri = picsList.findSubjects(rdf.type, schema.MediaObject)
      //  console.log("picsUri",app.picsUri)
      app.pics = []
      app.picsUri.forEach(function (nuri){
        var subject = nuri.asNodeRef()
        //  console.log("subject",subject)
        //  console.log("doc",nuri.getDocument())
        var text = nuri.getString(schema.text)
        var date = nuri.getDateTime(schema.dateCreated)
        //  console.log(text, date)
        var pic = {}
        pic.text = text;
        pic.date = date;
        pic.subject = subject;
        //text = nuri.getAllStrings()*/
        app.pics = [... app.pics, pic]
      })

      app.pics.reverse()
    })
  }



  addPic(){
    var app = this

    console.log(app.picsList)
    if (app.picsList == undefined){
      alert(i18next.t('must_log'))
    }else{
      var textarea = this.shadowRoot.getElementById('picarea').shadowRoot.querySelector(".form-control")
      var pic = textarea.value.trim()
      textarea.value = ""
      //  console.log(pic)
      const newPic = app.picsList.addSubject();
      var date = new Date(Date.now())
      // Indicate that the Subject is a schema:MediaObject:
      newPic.addRef(rdf.type, schema.MediaObject);
      // Set the Subject's `schema:text` to the actual pic contents:
      newPic.addLiteral(schema.text, pic);
      // Store the date the pic was created (i.e. now):
      newPic.addLiteral(schema.dateCreated, date)
      newPic.addRef(schema.about, app.uri);

      console.log(newPic.asNodeRef())



      app.picsList.save([newPic]).then(
        success=>{
          var checkAgora = this.shadowRoot.getElementById('agora_pub').shadowRoot.firstElementChild.checked
          if(checkAgora == true){
            app.updateAgora(pic, date, newPic.asNodeRef())
          }
          app.initPicPod()
        },
        err=>{
          console.log(err)
          alert(err)
        });
      }

    }

    updateAgora(pic,date, subject){
      var app = this;
      console.log("app.agoraPicsListUrl",app.agoraPicsListUrl)
      Tripledoc.fetchDocument(app.agoraPicsListUrl).then(
        agoraPicsList => {
          app.agoraPicsList = agoraPicsList;
          console.log("app.agoraPicsList",app.agoraPicsList)
          const newPic = app.agoraPicsList.addSubject();
          // Indicate that the Subject is a schema:MediaObject:
          newPic.addRef(rdf.type, schema.MediaObject);
          // Set the Subject's `schema:text` to the actual pic contents:
          newPic.addLiteral(schema.text, pic);
          // Store the date the pic was created (i.e. now):
          newPic.addLiteral(schema.dateCreated, date)
          // add ref to user pic
          newPic.addRef(rdfs.seeAlso, subject);
          newPic.addRef(schema.creator, app.webId);
          console.log(newPic.asNodeRef())

          app.agoraPicsList.save([newPic]).then(
            success=>{
              console.log("success agora", success)
              //  app.initpicPod()
            },
            err=>{
              console.log(err)
            });
          });
        }

        initialisePicsList(profile,typeIndex){
          var app = this;
          console.log("creation a revoir")
          const storage = profile.getRef(space.storage)
          //    console.log("storage",storage)
          app.agent.send('Storage',{action: "storageChanged", storage: storage})

          const picsListUrl = storage + 'public/Picpost/pics.ttl';

          const picsList = Tripledoc.createDocument(picsListUrl);
          picsList.save();

          // Store a reference to that Document in the public Type Index for `schema:MediaObject`:
          const typeRegistration = typeIndex.addSubject();
          typeRegistration.addRef(rdf.type, solid.TypeRegistration)
          typeRegistration.addRef(solid.instance, picsList.asRef())
          typeRegistration.addRef(solid.forClass, schema.MediaObject)
          typeIndex.save([ typeRegistration ]);

          return picsListUrl
          /*// Get the root URL of the user's Pod:
          const storage = profile.getRef(space.storage);

          // Determine at what URL the new Document should be stored:
          const picsListUrl = storage + 'public/pics.ttl';
          // Create the new Document:
          const picsList = createDocument(picsListUrl);
          await picsList.save();

          // Store a reference to that Document in the public Type Index for `schema:MediaObject`:
          const typeRegistration = typeIndex.addSubject();
          typeRegistration.addRef(rdf.type, solid.TypeRegistration)
          typeRegistration.addRef(solid.instance, document.asRef())
          typeRegistration.addRef(solid.forClass, schema.MediaObject)
          await typeIndex.save([ typeRegistration ]);

          // Then finally return the new Document:
          return picsList;
          */
        }
        createTemp(e) {
          console.log(e)
          if (this.webId == null){
            alert(i18next.t('must_log'))
          }

          console.log(e.target)
          //  console.log(e.target.getAttribute("capture"))

          this.file = e.target.files[0];
          console.log("storage",this.storage)
          this.path = this.storage+"public/Picpost/"
          console.log(this.file)


          this.filename = this.file.name.substring(0,this.file.name.lastIndexOf("."));
          this.shadowRoot.getElementById('filename').value = this.filename
          this.extension = this.file.name.substring(this.file.name.lastIndexOf("."));
          this.uri = this.path+this.filename+this.extension

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

          this.uri = this.path+this.filename+this.extension
          this.sfh.updateFile(this.uri, this.file)
          .then(
            success =>{
              console.log(success)
              this.addPic()

            },
            err => {console.log(err)});

          }


          filenameChange(){
            var filename = this.shadowRoot.getElementById("filename").value
            if (filename.length == 0){
              alert("Filename must not be blank")
              this.shadowRoot.getElementById("filename").value = this.filename
            }else{
              this.filename = filename
              this.uri=this.path+this.filename+this.extension
            }
          }

          copy(){
            console.log(this.uri)
            var dummy = document.createElement("textarea");
            // to avoid breaking orgain page when copying more words
            // cant copy when adding below this code
            // dummy.style.display = 'none'
            //document.body.appendChild(dummy);
            //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
            dummy.value = this.uri;
            dummy.select();
            document.execCommand("copy");
            //  document.body.removeChild(dummy);
          }


          render() {
            const picList = (pics) => html`
            <h3>My Picpost List (${pics.length})</h3>


            <bs-list-group-action>
            ${pics.map((n) => html`
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
              <!--            <div class="custom-file">
              <input type="file" class="custom-file-input" @change="${this.createTemp}" id="imageFile" accept="image/*;capture=camera" lang="${this.lang}">
              <label class="custom-file-label" for="imageFile"><i class="fas fa-camera-retro"></i> Image</label>
              </div>
              <div class="custom-file">
              <input type="file" class="custom-file-input" @change="${this.createTemp}" id="videoFile" accept="video/*;capture=camcorder" lang="${this.lang}">
              <label class="custom-file-label" for="videoFile"><i class="fas fa-video"></i> Video</label>
              </div>
              <div class="custom-file">
              <input type="file" class="custom-file-input" @change="${this.createTemp}" id="audioFile" accept="audio/*;capture=microphone" lang="${this.lang}">
              <label class="custom-file-label" for="audioFile"><i class="fas fa-microphone"></i> Audio</label>
              </div>
              -->
              <div class="custom-file">
              <input type="file" class="custom-file-input" @change="${this.createTemp}" id="audioFile" accept="image/*;video/*;audio/*" lang="${this.lang}">
              <label class="custom-file-label" for="audioFile"><i class="fas fa-camera-retro"></i><i class="fas fa-video"></i><i class="fas fa-microphone"></i></label>
              </div>
              </form>
              </div>


              Folder : <a href="${this.path}" target="_blank">${this.path}</a>

              <div class="col-auto">
              <label class="sr-only" for="filename">Filename</label>
              <div class="input-group mb-2">
              <input id="filename" class="form-control" type="text" value="${this.filename}" @change="${this.filenameChange}" placeholder="Filename">
              <div class="input-group-append">
              <div class="input-group-text">${this.extension}</div>
              </div>
              </div>
              </div>

              <!--
              <input id="filename" class="form-control" type="text" value="${this.filename}" @change="${this.filenameChange}" placeholder="Filename"> ${this.extension}
              -->



              <div class="col-auto"><canvas style="max-width: 100%; height: auto;" id="canvas"/></div>


              <!--<input type="file" class="form-control-file" @change="${this.sendPic}"  id="camera" accept="image/*" capture="camera"></input>
              <input type="file" @change="${this.sendPic}"  id="camcorder" accept="image/*" capture="camcorder">
              <input type="file" @change="${this.sendPic}" id="audio" accept="image/*" capture="audio">-->



              <bs-form-group>
              <bs-form-label slot="label">Legend</bs-form-label>
              <bs-form-textarea id ="picarea" rows="4" slot="control"></bs-form-textarea>


              </bs-form-group>
              <br>
              <bs-button primary @click=${this.sendPic}>${i18next.t('send_picture')}</bs-button>
              <a href="${this.path+this.filename}" target="_blank">
              <i title="download" class="fas fa-file-download"></i>
              </a>
              <i title="copy" @click="${this.copy}" class="fas fa-copy"></i>




              <bs-form-check-group>
              <bs-form-checkbox-input id="agora_pub" name="agora_pub" slot="check" checked></bs-form-checkbox-input>
              <bs-form-check-label slot="label">${i18next.t('agora_publish')}</bs-form-check-label>
              </bs-form-check-group>
              <br>

              <stream-component id="stream" name="Stream"></stream-component>

              <p>
              ${picList(this.pics)}
              </p>
              `;
            }
          }

          // Register the new element with the browser.
          customElements.define('picpost-component', PicpostComponent);
