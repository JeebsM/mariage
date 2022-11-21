import { auth } from '../config/firebaseConfig.js';
import { GateKeeper } from './gatekeeper.js';

/* Contain all authentication logic */
const authTools = new GateKeeper(auth);
