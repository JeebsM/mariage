import { auth } from '../config/firebaseConfig.js';
import { GateKeeper } from './gatekeeper.js';
import { JournalLog } from './components/journalLog.js';
import { ApiMessenger } from './ApiMessenger.js';
import { apiConfig } from '../config/apiConfig.js';
import { emitMessage, sortDataByDate } from './utils.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);
const messenger = new ApiMessenger(apiConfig.apiRoute.records);

const journalPage = document.querySelector('#journal');

messenger.get()
  .then(response => response.json())
  .then(data => {
    emitMessage("Data fetched", "#fff", 1);
    let records = filterRecords(data);
    sessionStorage.setItem('records', JSON.stringify(records));
    updateJournal({}, records);
  })
  .catch(e => {
    //console.log({"status": e.status, "message": e.message});
    emitMessage(e.message, "#ec1c1c");
  });

function updateJournal(event,records=[]) {
  let logs = (records.length > 0 && records instanceof Array)? records : JSON.parse(sessionStorage.getItem('records'));
  let logsSorted = sortDataByDate(logs, "desc");
  //console.log("all records", records);
  logsSorted.forEach(log => {
    let journalLog = document.createElement('journal-log');
        journalLog.setAttribute('url', log.imageUrl);
        journalLog.setAttribute('legend', log.legend);
        journalLog.setAttribute('id', log.id);
        journalLog.setAttribute('title', log.title);
        journalLog.setAttribute('imageUrl', log.imageUrl);
        journalLog.setAttribute('date', log.date);
        journalLog.setAttribute('type', log.type);
        journalLog.setAttribute('like', log.like);
        journalLog.setAttribute('black', log.black);
        journalLog.setAttribute('white', log.white);
    journalPage.append(journalLog);
  });
}

function filterRecords(records) {
  return records.filter(record => record.type != "behind");
}
