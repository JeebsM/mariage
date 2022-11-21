import { ApiMessenger } from '../ApiMessenger.js';
import { apiConfig } from '../../config/apiConfig.js';

// Extend the HTMLElement class to create the web component
class ImageLog extends HTMLElement {

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
		const user_chose_like = record.like.includes(userId) ? 'hidden' : '';
        // Render HTML
		this.innerHTML = /* html */ `
            <div class="behind-the-scene">
                <img id="${this.id}" src="${this.url}" class="img-resize"/>
                <figcaption>
					${this.legend} 
					<br><span id="like_${this.id}">${this.count_like}</span> <i class="material-icons icon md-light">favorite</i>
				</figcaption>
				<button logId="log_${this.id}" class="editLogButton column like ${user_chose_like}">Like</b>
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
		const attributes = e.target.classList; //.split(" ");");
		const like = attributes.contains("like");
		const recordId = e.target.attributes.logId.value.split('_')[1];
		let records = JSON.parse(sessionStorage.getItem('coulisses'));
		let record = records.filter(item => item.id == recordId)[0];
		//console.log("record before",record, "like", like);
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
		var records = JSON.parse(sessionStorage.getItem('coulisses'));
		return records.filter(item => item.id == this.id)[0];
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

	get like() {
        return this.getAttribute('like') || '';
    }

	get count_like() {
		return this.like.split(',').length;
	}

}

// Define the new web component
if ('customElements' in window) {
	customElements.define('image-log', ImageLog);
}