import React, { useState, useEffect, useRef } from "react";
import axios from "./axios";
import { socket } from "./socket";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function FriendShipButton({ otherUserId, first, last }) {
    const [buttonText, setButtonText] = useState("");
    const elemRef = useRef();
    const privateChatMessages = useSelector((state) => state && state.cm);

    const keyCheck = (e) => {
        // console.log("key pressed:", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log(e.target.value);
            socket.emit("chat message from friend", e.target.value);
            e.target.value = "";
        }
    };

    useEffect(() => {
        axios.get(`/friendshipstatus/${otherUserId}`).then((resp) => {
            setButtonText(resp.data.buttonText);
        });
    }, []);

    // useEffect(() => {
    //     elemRef.current.scrollTop =
    //         elemRef.current.scrollHeight - elemRef.current.clientHeight;
    // }, []);

    function submit() {
        axios
            .post(`/send-friend-request/${otherUserId}`, { bt: buttonText })
            .then((resp) => {
                setButtonText(resp.data.buttonText);
            });
    }

    return (
        <div className="people-container">
            {buttonText == "Send Friend Request" && (
                <p>
                    Send {first} {last} a friend request.
                </p>
            )}
            {buttonText == "End Friendship" && (
                <div>
                    <p>
                        You are friends with {first} {last}.
                    </p>
                    {/* <div>
                        <h2></h2>
                        <div id="duo-chat-container">
                            <div
                                className="chat-messages-container"
                                ref={elemRef}
                            >
                                {privateChatMessages &&
                                    privateChatMessages.map((each, index) => (
                                        <div
                                            id="chat-messages-alignment"
                                            key={index}
                                        >
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
                                            <div id="chatmessage">
                                                {each.text}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                            <div id="textarea-duo-chat">
                                <textarea
                                    name=""
                                    placeholder="Join the conversation..."
                                    cols="50"
                                    rows="10"
                                    onKeyDown={keyCheck}
                                ></textarea>
                            </div>
                        </div>
                    </div> */}
                </div>
            )}
            {buttonText == "Cancel Friend Request" && (
                <p>
                    You sent {first} {last} a friend request. They haven&apos;t
                    accepted yet. If you changed your mind, you can cancel your
                    request.
                </p>
            )}
            {buttonText == "Accept Friend Request" && (
                <p>
                    {first} {last} sent you a friend request. Click the button
                    to become friends.
                </p>
            )}
            <button
                className={`friend-button
                    ${buttonText === "Send Friend Request" ? "green" : ""}
                    ${buttonText === "Accept Friend Request" ? "green" : ""}`}
                onClick={submit}
            >
                {buttonText}
            </button>
        </div>
    );
}
