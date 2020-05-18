import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMessages);

    // console.log("here are my last 10 chat messages:", chatMessages);

    // run this every time for every new chat message
    useEffect(() => {
        console.log("chat hooks component has mounted");
        console.log("elemRef =", elemRef);
        console.log("scroll top:", elemRef.current.scrollTop); // always at top/position 0
        console.log("clientHeight:", elemRef.current.clientHeight); // container-height
        console.log("scrollHeight:", elemRef.current.scrollHeight); // container + scroll down

        // I want my container to scroll from the top:
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = (e) => {
        console.log("key pressed:", e.key);

        if (e.key === "Enter") {
            e.preventDefault(); // prevents going to the next line
            // console.log(e.target.value);
            socket.emit("chat message from user", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div>
            <p className="chat-title">Welcome to Chat</p>
            <div className="chat-messages-container" ref={elemRef}>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
                <p>Chat messages will go here</p>
            </div>
            <textarea
                name=""
                placeholder="Add your message here"
                id=""
                cols="30"
                rows="10"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
