import { ApiMessenger } from '../ApiMessenger.js';
import { apiConfig } from '../../config/apiConfig.js';

// Extend the HTMLElement class to create the web component
class JournalLog extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();
	}

	/**
	 * Runs each time the element is appended to or moved in the DOM
	 */
	connectedCallback () {
		const userId = sessionStorage.getItem('user_id') || false;
		const record = this.getRecord();
		const user_chose_black = record.black.includes(userId) ? 'answer disabled' : '';
		const user_chose_white = record.white.includes(userId) ? 'answer disabled' : '';
		const user_chose_like = record.like.includes(userId) ? 'hidden' : '';
        // Render HTML
		this.innerHTML = /* html */ `
            <div class="card">
				<div>
					<h4>${this.title}</h4>
					<p>${this.legend}</p>
					<p><span id="like_${this.id}">${this.count_like}</span> <i class="material-icons icon md-light">favorite</i></p>
				</div>
				<div>
					<img id="${this.id}" src="${this.url}" class="img-resize"/>
				</div>
				<div class="row">
					<button logId="log_${this.id}" class="editLogButton column white ${this.white_response} ${user_chose_white}">${this.white_response}</b>
					<button logId="log_${this.id}" class="editLogButton column like ${user_chose_like}">Like</b>
					<button logId="log_${this.id}" class="editLogButton column black ${this.black_response} ${user_chose_black}">${this.black_response}</b>
				</div>
            </div>
        `;

		const editLogButtons = document.querySelectorAll('.editLogButton');

		editLogButtons.forEach(editLogButton => {
			editLogButton.addEventListener('click',this.editLog);
		});
		//console.log('connected!', this);
	}

	/**
	 * Runs when the element is removed from the DOM
	 */
	disconnectedCallback () {
		//console.log('disconnected', this);
	}

	editLog(e) {
		const userId = sessionStorage.getItem('user_id') || false;
		if(!userId){
			return;
		}
		const recordMessenger = new ApiMessenger(apiConfig.apiRoute.records);
		const attributes = e.target.classList; //.split(" ");
		const parentElement = e.target.parentElement;
		const black = attributes.contains("black");
		const white = attributes.contains("white");
		const like = attributes.contains("like");
		const recordId = e.target.attributes.logId.value.split('_')[1];
		let records = JSON.parse(sessionStorage.getItem('records'));
		let record = records.filter(item => item.id == recordId)[0];
		//console.log("record before",record, "black", black, "white", white, "like", like);
		if(black){ 
			//console.log("black", record.black, userId);
			if(record.black.includes(userId)) return; 
			record.black.push(userId);
			record.black = record.black.filter((v, i, a) => a.indexOf(v) === i);
			record.white = record.white.filter(elmt => elmt != userId);
			parentElement.querySelector('.white').classList.remove('answer','disabled');
			//parentElements.forEach(elmt => {console.log(elmt); elmt.classList.contains('white') ? elmt.classList.remove('answer','disabled') : null});
			e.target.classList.add('answer');
		}
		if(white){ 
			//console.log("white", record.white, userId);
			if(record.white.includes(userId)) return; 
			record.white.push(userId);
			record.white = record.white.filter((v, i, a) => a.indexOf(v) === i);
			record.black = record.black.filter(elmt => elmt != userId);
			parentElement.querySelector('.black').classList.remove('answer','disabled');
			//parentElements.forEach(elmt => elmt.classList.contains('black') ? elmt.classList.remove('answer','disabled') : null);
			e.target.classList.add('answer');
		}
		if(like){
			//console.log("like", record.like, userId);
			if(record.like.includes(userId)) return; 
			record.like.push(userId);
			record.like = record.like.filter((v, i, a) => a.indexOf(v) === i);
			document.querySelector(`#like_${recordId}`).innerHTML = 
				parseInt(document.querySelector(`#like_${recordId}`).innerHTML) + 1;
			e.target.classList.add('hidden');
		};
		//console.log("record after",record);
		recordMessenger.save(record);
	}

	getRecord() {
		var records = JSON.parse(sessionStorage.getItem('records'));
		return records.filter(item => item.id == this.id)[0];
	}

	get answer() {
		return
	}

    get url() {
        return this.getAttribute('url') || '';
    }

    get legend() {
        return this.getAttribute('legend') || '';
    }

	get id() {
        return this.getAttribute('id') || '';
    }

	get title() {
        return this.getAttribute('title') || '';
    }

    get imageUrl() {
        return this.getAttribute('imageUrl') || '';
    }

	get date() {
        return this.getAttribute('date') || '';
    }

	get type() {
        return this.getAttribute('type') || '';
    }

    get like() {
        return this.getAttribute('like') ||'';
    }

	get black() {
        return this.getAttribute('black') || '';
    }

	get white() {
        return this.getAttribute('white') || '';
    }

	get black_response() {
		if(this.type == 'kikadi'){
			return "Jeebs";
		}
		if(this.type == 'quizz'){
			return "Non";
		}
        return "hidden";
    }

	get white_response() {
        if(this.type == 'kikadi'){
			return "Joy";
		}
		if(this.type == 'quizz'){
			return "Oui";
		}
        return "hidden";
    }

	get count_like() {
		return this.like.split(',').length;
	}
}

// Define the new web component
if ('customElements' in window) {
	customElements.define('journal-log', JournalLog);
}