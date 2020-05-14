import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getFriendsAndRequests, acceptFriend, endFriendship } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("friends.js, useEffect for getFriendsAndRequests() runs");
        dispatch(getFriendsAndRequests());
    }, []);

    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted)
    );
    console.log("friends.js, friends after useSelector ran:", friends);

    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => !user.accepted)
    );
    console.log("friends.js, wannabes after useSelector ran:", wannabes);

    return (
        <div id="friends-container">
            <div id="my-friends">
                {friends && !friends.length && (
                    <h3>Currently you don&apos;t have any friends</h3>
                )}
                {friends && friends.length && <h3>My Friends</h3>}

                <div>
                    {friends &&
                        friends.map((each) => (
                            <div key={each.id}>
                                <Link to={`/user/${each.id}`} key={each.id}>
                                    <div>
                                        <img
                                            src={each.img_url || "/default.svg"}
                                            alt={`${each.first} ${each.last}`}
                                        />
                                    </div>
                                    <div>
                                        {each.first} {each.last}
                                    </div>
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(endFriendship(each.id))
                                    }
                                >
                                    End Friendship
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            <div id="wannabes-requests">
                {wannabes && !wannabes.length && (
                    <h3>Currently no friend requests</h3>
                )}
                {wannabes && wannabes.length && <h3>Friend Requests:</h3>}

                <div>
                    {wannabes &&
                        wannabes.map((each) => (
                            <div key={each.id}>
                                <Link to={`/user/${each.id}`} key={each.id}>
                                    <div>
                                        <img
                                            src={each.img_url || "/default.svg"}
                                            alt={`${each.first} ${each.last}`}
                                        />
                                    </div>
                                    <div>
                                        {each.first} {each.last}
                                    </div>
                                </Link>
                                <button
                                    onClick={() =>
                                        dispatch(acceptFriend(each.id))
                                    }
                                >
                                    Accept Friend Request
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
