import { auth } from '../config/firebaseConfig.js';
import { GateKeeper } from './gatekeeper.js';
import { ImageLog } from './components/imageLog.js';
import { ApiMessenger } from './ApiMessenger.js';
import { apiConfig } from '../config/apiConfig.js';
import { emitMessage, sortDataByDate } from './utils.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);
const messenger = new ApiMessenger(apiConfig.apiRoute.records);

const coulisseGallery = document.querySelector('#coulisses');
const nextImageButton = document.querySelector('#nextImageButton');
const previousImageButton = document.querySelector('#previousImageButton');

nextImageButton.addEventListener('click', updateImage);
previousImageButton.addEventListener('click', updateImage);

messenger.get()
  .then(response => response.json())
  .then(data => {
    emitMessage("Data fetched", "#fff", 1);
    let records = filterRecords(data);
    sessionStorage.setItem('coulisses', JSON.stringify(records));
    updateImage({},records);
  })
  .catch(e => {
    //console.log({"status": e.status, "message": e.message});
    emitMessage(e.message, "#ec1c1c");
  });

function updateImage(event,records=[]) {
  const currentImage = document.querySelector("#coulisses img");
  
  let coulisses = (records.length > 0 && records instanceof Array)? records : JSON.parse(sessionStorage.getItem('coulisses'));
  let coulissesSorted = sortDataByDate(coulisses,"asc");
  var record = coulissesSorted[0];

  if(currentImage != null){
    const isCurrentImage = (element) => element.id == currentImage.id;
    let currentImageIndex = coulissesSorted.findIndex(isCurrentImage);
    let newImageIndex = event.target.classList.contains("next") ? currentImageIndex+1 : currentImageIndex-1;
    if(newImageIndex >= coulissesSorted.length) {
      newImageIndex = 0;
    }
    if(newImageIndex < 0) {
      newImageIndex = coulissesSorted.length-1;
    }
    record = coulissesSorted[newImageIndex];
  }
  
  let imageLog = document.createElement('image-log');
      imageLog.setAttribute('url', record.imageUrl);
      imageLog.setAttribute('legend', record.legend);
      imageLog.setAttribute('id', record.id);
      imageLog.setAttribute('like', record.like);
  if(currentImage != null){
    coulisseGallery.removeChild(coulisseGallery.firstChild);
  }
  coulisseGallery.append(imageLog);
}

function filterRecords(records) {
  return records.filter(record => record.type == "behind");
}

/*
const coulissesDir = "behind-the-scene/";
const coulissesListRef = ref(storage, coulissesDir);

var imagesUrls = [];

listAll(coulissesListRef).then((response) => {
  response.items.forEach((item) => {
    getDownloadURL(item).then((url) => {
      imagesUrls.push(url);
      sessionStorage.setItem('imageUrls', JSON.stringify(imagesUrls));
    })
  });  
});
*/