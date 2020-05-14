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
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((user) => user.accepted)
    );
    console.log("friends.js, friends after useSelector ran:", friends);

    const wannabes = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((user) => !user.accepted)
    );
    console.log("friends.js, wannabes after useSelector ran:", wannabes);

    return (
        <div id="friends-container">
            <div className="center">
                {wannabes && !wannabes.length && (
                    <h3 className="one-percent-bottom">
                        Currently no friend requests
                    </h3>
                )}
                {wannabes && wannabes.length && (
                    <h3 className="one-percent-bottom">Friend Requests</h3>
                )}
                <div className="peers">
                    {wannabes &&
                        wannabes.map((each) => (
                            <div key={each.id}>
                                <Link
                                    className="one-percent-right one-percent-bottom"
                                    to={`/user/${each.id}`}
                                    key={each.id}
                                >
                                    <div className="pic-peers">
                                        <img
                                            src={each.img_url || "/default.svg"}
                                            alt={`${each.first} ${each.last}`}
                                        />
                                    </div>
                                    <div className="center">
                                        {each.first} {each.last}
                                    </div>
                                </Link>
                                <button
                                    className="button-translate nomargin"
                                    onClick={() =>
                                        dispatch(acceptFriend(each.id))
                                    }
                                >
                                    Accept as friend
                                </button>
                            </div>
                        ))}
                </div>
            </div>

            <div className="center one-percent-top">
                {friends && !friends.length && (
                    <h3 className="one-percent-bottom">
                        Currently you don&apos;t have any friends
                    </h3>
                )}
                {friends && friends.length && (
                    <h3 className="one-percent-bottom">My Friends</h3>
                )}
                <div className="peers">
                    {friends &&
                        friends.map((each) => (
                            <div key={each.id}>
                                <Link
                                    className="one-percent-right one-percent-bottom"
                                    to={`/user/${each.id}`}
                                    key={each.id}
                                >
                                    <div className="pic-peers">
                                        <img
                                            src={each.img_url || "/default.svg"}
                                            alt={`${each.first} ${each.last}`}
                                        />
                                    </div>
                                    <div className="center">
                                        {each.first} {each.last}
                                    </div>
                                </Link>
                                <button
                                    className="button-translate nomargin"
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
        </div>
    );
}
