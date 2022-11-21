// Extend the HTMLElement class to create the web component
class NavigationMenu extends HTMLElement {

	/**
	 * The class constructor object
	 */
	constructor () {

		// Always call super first in constructor
		super();

		// Render HTML
		this.innerHTML = /* html */ `
            <nav class="row">
                <div class="column">
                    <a class="startpage" href="/"><i class="material-icons icon md-dark">rsvp</i><span class="small-screen-inactive"> Invitation</span></a>
                    <!-- Nav links activated in second column on small screens -->
                    <a class="small-screen-inactive" href="/celebration.html"><i class="material-icons icon md-dark">celebration</i> Jour J</a>
                    <a class="small-screen-inactive" href="/gallery.html"><i class="material-icons icon md-dark">checkroom</i> Les coulisses</a>
                    <a class="small-screen-inactive" href="/admin.html"><i class="material-icons icon md-dark">person</i> Admin</a>
                    <a class="small-screen-inactive sign-out"><i class="material-icons icon md-dark">logout</i> Déconnexion</a>
                </div>
				<div class="column small-screen-active">
                    <a class="" href="/celebration.html"><i class="material-icons icon md-dark">celebration</i></a>
                </div>
                <div class="column small-screen-active">
                    <a class="" href="/gallery.html"><i class="material-icons icon md-dark">checkroom</i></a>
                </div>
                <div class="column small-screen-active">
                    <a class="" href="/admin.html"><i class="material-icons icon md-dark">person</i></a>
                </div>
                <div class="column small-screen-active">
                    <a class="sign-out"><i class="material-icons icon md-dark">logout</i></a>
                </div>
            </nav>
        `;
	}

	/**
	 * Runs each time the element is appended to or moved in the DOM
	 */
	connectedCallback () {
		//console.log('connected!', this);
	}

	/**
	 * Runs when the element is removed from the DOM
	 */
	disconnectedCallback () {
		//console.log('disconnected', this);
	}

}

// Define the new web component
if ('customElements' in window) {
	customElements.define('navigation-menu', NavigationMenu);
}