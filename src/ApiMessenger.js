import { emitMessage } from './utils.js';

class ApiMessenger {

    constructor(apiRoute) {
        this.apiRoute = apiRoute;
        this.userId = sessionStorage.getItem('user_id') != null ? sessionStorage.getItem('user_id') : null;
    }

    save(item) {

        if(sessionStorage.getItem('user_id') == null || sessionStorage.getItem('user_token') == null){
            emitMessage("Unauthorized User", "#c78438");
            return;
        }
        //console.log(sessionStorage.getItem('user_id'));
        const userId = sessionStorage.getItem('user_id');
        const token = sessionStorage.getItem('user_token');

        const data = JSON.stringify(item);
        const recordId = (item.hasOwnProperty('id') && item.id != "") ? item.id : false;
        //console.log(data, token, this.apiRoute, recordId); 
        //console.log(`User ${token} try to add data from ${apiRoute}`);
        if(!recordId) {
            return this.add(data, token, this.apiRoute);
        }else{
            return this.edit(data, token, this.apiRoute, recordId);
        }
    }

    get(id=null) {    

        if(!sessionStorage.getItem('user_id')) {
            return new Promise((resolve, reject) => {
                throw new Error("Log first!");
            });
        }

        if(sessionStorage.getItem('user_id') == null || sessionStorage.getItem('user_token') == null){
            emitMessage("Unauthorized User", "#c78438");
            return;
        }
        //console.log(`User ${token} try to add data from ${apiRoute}`);
        const userId = sessionStorage.getItem('user_id');
        const token = sessionStorage.getItem('user_token');

        let apiRouteSuffixed = id == null ? this.apiRoute : `${this.apiRoute}/${id}`;

        emitMessage("Getting data from server", "#fff",60000);

        return fetch(apiRouteSuffixed, {
            method: 'GET',
            headers: {
                'authorization': token,
                'Content-Type': "application/json"
            }
        })
    }

    add(data, token, apiRoute) {    
        //console.log(`User ${token} try to add data from ${apiRoute}`);
        fetch(apiRoute, {
            method: 'POST',
            headers: {
                'authorization': token,
                'Content-Type': "application/json"
            },
            body: data,
        })
        .then(response => response.json())
        .then(data => {
            //console.log("Record added", data);
            emitMessage(`Record ${data.id} added`, "#2fb84e");
        })
        .catch(e => {
            //console.log({"status": e.status, "message": e.message});
            emitMessage(e.message, "#ec1c1c");
        });
    }

    edit(data, token, apiRoute, recordId) {
        let apiRouteWithRecordId = apiRoute + `/${recordId}`;
        //console.log(`User ${token} try to edit data from ${apiRouteWithRecordId}`);
        fetch(apiRouteWithRecordId, {
            method: 'PATCH',
            headers: {
                'authorization': token,
                'Content-Type': "application/json"
            },
            body: data,
        })
        .then(response => response.json())
        .then(data => {
            //console.log("Record edited", data);
            emitMessage(`Record ${data.id} edited`, "#2fb84e");
        })
        .catch(e => {
            //console.log({"status": e.status, "message": e.message});
            emitMessage(e.message, "#ec1c1c");
        });;
    }

}

export {ApiMessenger};




