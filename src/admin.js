import { auth, storage } from '../config/firebaseConfig.js';
import { GateKeeper } from './gatekeeper.js';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { ApiMessenger } from './ApiMessenger.js';
import { apiConfig } from '../config/apiConfig.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);

const userMessenger = new ApiMessenger(apiConfig.apiRoute.users);
const recordMessenger = new ApiMessenger(apiConfig.apiRoute.records);
//const uploadImageForm = document.querySelector('#uploadImageForm');
const createRecordForm = document.querySelector('#createRecordForm');
const editUserForm = document.querySelector('#editUserForm');

window.addEventListener('DOMContentLoaded', (event) => {
    if(sessionStorage.getItem('user')){
        let user = JSON.parse(sessionStorage.getItem('user'));
        populateUserForm(user.id,user);
        return;
    }else{
        if(sessionStorage.getItem('user_id')){
            let userId = sessionStorage.getItem('user_id');
            populateUserForm(userId,null);
        }
    }
});


editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const userId = e.target.user_id.value == "" ? undefined : e.target.user_id.value;
    const mail = e.target.mail.value;
    const surname = e.target.surname.value;
    const family = e.target.family.value;
    const child = e.target.child.value;
    const adult = e.target.adult.value;

    let user = {
        "id": userId,
        "mail": mail,
        "surname": surname,
        "family": family,
        "adult": child,
        "child": adult,
        "witness": false,
        "host": false
    }
    sessionStorage.setItem('user_ready', false);
    userMessenger.save(user); 
});

function populateUserForm(user_id,user=null) {
    document.getElementById('user_id_input').setAttribute('value', user_id);
    if(user != null){
        document.getElementById('mail_input').setAttribute('value', user.mail);
        document.getElementById('surname_input').setAttribute('value',  user.surname);
        document.getElementById('family_input').setAttribute('value', user.family);
        document.getElementById('adult_input').setAttribute('value',  user.adult);
        document.getElementById('child_input').setAttribute('value', user.child);
    }
}

createRecordForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const picture = e.target.picture.files[0];
    const title = e.target.title.value;
    const type = e.target.type.value;
    const imageName = setImageName(type, title)
    const dateLog = e.target.date.value == "" ? new Date().valueOf() : new Date(e.target.date.value).valueOf();

    const imageRef = ref(storage, imageName);

    let record = {
        "title": e.target.title.value,
        "legend": e.target.legend.value,
        "imageUrl": "",
        "date": dateLog,
        "type": type,
        "like": [],
        "black": [],
        "white": []
    }

    if(picture != null){
        uploadBytes(imageRef, picture).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                record.imageUrl = url;
                recordMessenger.save(record); 
            });
        });
    }else{
        recordMessenger.save(record); 
    }
    
    createRecordForm.reset();
});

function setImageName(type, title) {
    let titleWIthoutSpaces = title.replace(" ","_");
    if(type == 'behind'){
        return "behind-the-scene/" + titleWIthoutSpaces + v4();
    }else{
        return "wedding/" + titleWIthoutSpaces + v4();
    }
}
