import * as io from "socket.io-client";
import { lastTen, chatMessage } from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("lastTenChatMessages", (ltcm) => {
            store.dispatch(lastTen(ltcm));
        });

        socket.on("addChatMsg", (cm) => {
            store.dispatch(chatMessage(cm));
        });
    }
};
