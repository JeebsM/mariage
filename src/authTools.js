import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged, 
    getIdToken } from 'firebase/auth';
import { ApiMessenger } from './ApiMessenger.js';
import { apiConfig } from '../config/apiConfig.js';
import { emitMessage } from './utils.js';

  class AuthenticationTools {
    constructor(auth) {
      if (this.instance) return this.instance; // This is the key idea of implementing singleton. Return the same instance (i.e. the one that has already been created before)
      // We only proceedd to the following lines only if no instance has been created from this class
      AuthenticationTools.instance = this;

      this.userMessenger = new ApiMessenger(apiConfig.apiRoute.users);
      const userId = this.userMessenger.userId == null ? '0' : this.userMessenger.userId;
      //console.log(userId);
      this.authTools(auth);
      //console.log(this.userMessenger);
      this.userMessenger
        .get(`user/user_id/${userId}`)
        .then(response => {
            //console.log(response, response.status);
            if(!response || !response.status || response.status == 404){
                throw new Error("Utilisateur inconnu!");
            } 
            return response.json();
        })
        .then(data => {
            emitMessage("Data fetched", "#fff", 1);
            if(data.length == 1){
              sessionStorage.setItem('user', JSON.stringify(data[0]));
            }else{
              console.log("Error: multiple users sharing the same ID!");
            }
        })
        .catch(e => {
            //console.log({"status": e.status, "message": e.message});
            let user = {
                "user_id": userId,
                "mail": '',
                "surname": '',
                "family": '',
                "adult": '',
                "child": '',
                "witness": false,
                "host": false
            };
            emitMessage(e.message, "#ec1c1c");
            sessionStorage.setItem('user', JSON.stringify(user));
        });
    }
  
    authTools (auth) {
  
      // Authentication
      const authSwitchLinks = document.querySelectorAll('.switch');
      const authModals = document.querySelectorAll('.auth .modal');
      const authWrapper = document.querySelector('.auth');
      const registerForm = document.querySelector('.register');
      const loginForm = document.querySelector('.login');
      const logoutButton = document.querySelector('.sign-out');
    
      // toggle auth modals
      authSwitchLinks.forEach(link => {
        link.addEventListener('click', () => {
          authModals.forEach(modal => modal.classList.toggle('active'));
        });
      });
    
      // register form
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        const displayName = registerForm.displayName.value;
        
        createUserWithEmailAndPassword(auth, email, password)
          .then(user => {
            console.log('registered', user);
            let newUser = {
              "user_id": user.id,
              "mail": email,
              "surname": displayName,
              "family": '',
              "adult": '',
              "child": '',
              "witness": false,
              "host": false
          };
            this.userMessenger.save(newUser); 
            registerForm.reset();
          })
          .catch(error => {
            registerForm.querySelector('.error').textContent = error.message;
          });
      });
    
      // login form
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = loginForm.email.value;
        const password = loginForm.password.value;
    
        signInWithEmailAndPassword(auth, email, password)
          .then(user => {
            console.log('logged in', user);
            let emptyUser = {
              "user_id": '',
              "mail": '',
              "surname": '',
              "family": '',
              "adult": '',
              "child": '',
              "witness": false,
              "host": false
          };
            sessionStorage.setItem('user', JSON.stringify(emptyUser));
            loginForm.reset();
          })
          .catch(error => {
            loginForm.querySelector('.error').textContent = error.message;
          });
      });
    
      // sign out
      logoutButton.addEventListener('click', () => {
        signOut(auth)
          .then(() => console.log('signed out'));
      });
  
      // TODO: edit user
      /**
       * updateProfile(user, {
              displayName: displayName, photoURL: ""
            }).then(() => {
              console.log("update", user, displayName);
              registerForm.reset();
            }).catch((error) => {
              loginForm.querySelector('.error').textContent = error.message;
            });
       */
    
      // auth listener
      const unsubAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          authWrapper.classList.remove('open');
          authModals.forEach(modal => {
            modal.classList.remove('active');
          });
        } else {
          authWrapper.classList.add('open');
          authModals[0].classList.add('active');
        }
        //console.log('user status changed:', user);
      });

      onAuthStateChanged(auth, (user) => {
        if (user) {
          /* We set userAuthenticatedToken once for the whole app */
          const userNameSpan = document.querySelectorAll('.userName');
          const adminSections = document.querySelectorAll('.admin');
          const witnessSections = document.querySelectorAll('.witness');
          getIdToken(user)
            .then((token) => {
                sessionStorage.setItem("user_id", user.uid);
                sessionStorage.setItem("user_token", token);

                if(!sessionStorage.getItem('user')){
                  sessionStorage.setItem('user', JSON.stringify({
                    'user_id': user.uid,
                    'surname': 'Guest',
                    'host': false,
                    'witness': false
                  }))
                }; 

                const sessionUser = JSON.parse(sessionStorage.getItem('user'));
                console.log("session user", sessionUser);
                userNameSpan.forEach(span => {
                  span.innerHTML = sessionUser.surname;
                });
                /* Utility to load data coming from Google Sheet POC */
                if(sessionUser.host == true){
                  adminSections.forEach(section => {
                    section.style.display = "flex";
                  });
                }
                if(sessionUser.witness == true){
                  witnessSections.forEach(section => {
                    section.style.display = "flex";
                  });
                }
            })
            .catch(e => {
                console.log({"status": 403, "message": e.message});
                emitMessage(e.message, "#ec1c1c");
            });    
        } else {
          sessionStorage.clear();
        }
        //console.log('User status changed, accessToken: ', user);
      });

    }
  
  }
  
  export {AuthenticationTools};