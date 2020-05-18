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
            <p className="chat-title">Welcome to Chat</p>
            <div className="chat-messages-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((each, index) => (
                        <div className="" key={index}>
                            <Link
                                className=""
                                to={`/user/${each.id}`}
                                key={each.id}
                            >
                                <div className="">
                                    <img
                                        className="img-frame"
                                        src={each.img_url || "/default.svg"}
                                        alt={`${each.first} ${each.last}`}
                                    />
                                </div>
                                <div className="">
                                    {each.first} {each.last}
                                </div>
                            </Link>
                            <div>{each.text}</div>
                            <div>{each.created_at}</div>
                        </div>
                    ))}
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
