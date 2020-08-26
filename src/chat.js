import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.cm);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // prevents going to the next line
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
