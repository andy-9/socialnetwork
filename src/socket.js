import * as io from "socket.io-client";
// import { chatMessages, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("LastTenChatMessages", (ltcm) => {
            console.log("socket.js, LastTenChatMessages, ltcm:", ltcm);
            store.dispatch(lastTen(ltcm));
        });

        socket.on("addChatMsg", (msg) => {
            console.log(
                "Got a message in the client. I'm about to start the whole redux process by dispatching here. My message is:",
                msg
            );
        });
    }
};
