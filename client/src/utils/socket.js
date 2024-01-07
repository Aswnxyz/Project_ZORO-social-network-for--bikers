import { io } from "socket.io-client";

const socket = io("http://localhost:8003");

export default socket;