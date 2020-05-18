import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.cm);
    // console.log("chat.js, chatMessages:", chatMessages);

    // run this every time for every new chat message
    useEffect(() => {
        // console.log("chat hooks component has mounted");
        // console.log("elemRef =", elemRef);
        // console.log("scroll top:", elemRef.current.scrollTop); // always at top/position 0
        // console.log("clientHeight:", elemRef.current.clientHeight); // container-height
        // console.log("scrollHeight:", elemRef.current.scrollHeight); // container + scroll down

        // I want my container to scroll from the top:
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = (e) => {
        // console.log("key pressed:", e.key);

        if (e.key === "Enter") {
            e.preventDefault(); // prevents going to the next line
            // console.log(e.target.value);
            socket.emit("chat message from user", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div id="chat-container">
                <div className="chat-messages-container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((each, index) => (
                            <div id="chat-messages-alignment" key={index}>
                                <div>
                                    <Link
                                        className="chat-info-alignment"
                                        to={`/user/${each.id}`}
                                        key={each.id}
                                    >
                                        <div className="image-chat-container">
                                            <img
                                                className="image-in-chat"
                                                src={
                                                    each.img_url ||
                                                    "/default.svg"
                                                }
                                                alt={`${each.first} ${each.last}`}
                                            />
                                        </div>
                                        <div className="chat-align-name">
                                            {each.first} {each.last}
                                        </div>
                                    </Link>
                                    <div className="date-in-chat">
                                        {each.created_at}
                                    </div>
                                </div>
                                <div id="chatmessage">{each.text}</div>
                            </div>
                        ))}
                </div>
                <div id="textarea-chat">
                    <textarea
                        name=""
                        placeholder="Join the conversation..."
                        id=""
                        cols="50"
                        rows="10"
                        onKeyDown={keyCheck}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
