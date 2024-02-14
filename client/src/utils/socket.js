import { io } from "socket.io-client";
import { NOTIFICATION_SERVICE } from "../constants/constant";

const socket = io(NOTIFICATION_SERVICE);

export default socket;