import { LitElement, css,  html } from '../vendor/lit-element/lit-element.min.js';
//import { LitElement, css,  html } from 'https://cdn.pika.dev/lit-element/^2.2.1';
import { HelloAgent } from '../agents/HelloAgent.js';

// Extend the LitElement base class
class StreamComponent extends LitElement {

  static get properties() {
    return {
      message: { type: String },
      name: {type: String},
      count: {type: Number}
    };
  }

  constructor() {
    super();
    this.message = 'Hello world! From minimal-element';
    this.name = "unknown"
    this.count = 0;

  }

  firstUpdated(changedProperties) {
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "doSomething":
          app.doSomething(message.params)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };

    const constraints = {
      //video: true
      video: {width: {exact: 640}, height: {exact: 480}}
    };


    const captureVideoButton =   this.shadowRoot.getElementById('capture-button');
    const screenshotButton = this.shadowRoot.getElementById('screenshot-button');
    const img = this.shadowRoot.getElementById('screenshot');
    const video = this.shadowRoot.getElementById('video');

    const canvas = document.createElement('canvas');
    /*
    navigator.mediaDevices.getUserMedia(constraints).
    then((stream) => {video.srcObject = stream});*/

    captureVideoButton.onclick = function() {
      navigator.mediaDevices.getUserMedia(constraints).
      then(handleSuccess).catch(handleError);
    };

    screenshotButton.onclick = video.onclick = function() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      // Other browsers will fall back to image/png
      img.src = canvas.toDataURL('image/webp');
    };

    function handleSuccess(stream) {
      screenshotButton.disabled = false;
      video.srcObject = stream;
    }

    function handleError(err) {
      console.log(err)
      alert(err.message)
    }
    /*
    const hdConstraints = {
    video: {width: {min: 1280}, height: {min: 720}}
  };

  navigator.mediaDevices.getUserMedia(hdConstraints).
  then((stream) => {video.srcObject = stream});

  ...

  const vgaConstraints = {
  video: {width: {exact: 640}, height: {exact: 480}}
};

navigator.mediaDevices.getUserMedia(vgaConstraints).
then((stream) => {video.srcObject = stream});*/



}

doSomething(params){
  console.log(params)
}

clickHandler(event) {
  this.count++
  //console.log(event.target);
  console.log(this.agent)
  this.agent.send('Messages', "Information pour l'utilisateur n°"+this.count);
}

render() {
  return html`
  <link href="./vendor/fontawesome/css/all.css" rel="stylesheet">
  <link href="./vendor/bootstrap-4/css/bootstrap.min.css" rel="stylesheet">
  <h3 class="m-0 font-weight-bold text-primary">${this.name} </h3>

<div class="container">
  <video id="video"  autoplay></video>
  <img id="screenshot" src="">
  <canvas style="display:none;"></canvas>
  <button id="capture-button">Capture</capture>
  <button id="screenshot-button">Screenshot</capture>
</div>
  `;
}

}

// Register the new element with the browser.
customElements.define('stream-component', StreamComponent);
