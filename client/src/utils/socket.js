import { io } from "socket.io-client";

const socket = io("https://zoro.shopzen.in.net/api/notification");

export default socket;