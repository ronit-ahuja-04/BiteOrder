import { io } from 'socket.io-client';

// One shared Socket.IO client. autoConnect:false -> we connect/disconnect from a React effect.
import { API_ORIGIN } from './config';

export const SOCKET_URL = API_ORIGIN;
export const socket = io(SOCKET_URL, { autoConnect: false });
