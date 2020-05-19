import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getFriendsAndRequests, acceptFriend, endFriendship } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriendsAndRequests());
    }, []);

    const friends = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((user) => user.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((user) => !user.accepted)
    );

    return (
        <div id="friends-container">
            <div className="center">
                {wannabes && wannabes.length === 0 && (
                    <h2 className="one-percent-bottom">
                        Currently no friend requests
                    </h2>
                )}
                {wannabes && wannabes.length > 0 && (
                    <h2 className="one-percent-bottom">Friend Requests</h2>
                )}
                <div className="peers">
                    {wannabes &&
                        wannabes.map((each) => (
                            <div className="five-percent-right" key={each.id}>
                                <Link
                                    className="one-percent-right one-percent-bottom"
                                    to={`/user/${each.id}`}
                                    key={each.id}
                                >
                                    <div className="pic-peers">
                                        <img
                                            className="img-frame"
                                            src={each.img_url || "/default.svg"}
                                            alt={`${each.first} ${each.last}`}
                                        />
                                    </div>
                                    <div className="center">
                                        {each.first} {each.last}
                                    </div>
                                </Link>
                                <button
                                    className="button-translate nomargin green"
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
                {friends && !friends.length === 0 && (
                    <h2 className="one-percent-bottom">
                        Currently you don&apos;t have any friends
                    </h2>
                )}
                {friends && friends.length > 0 && (
                    <h2 className="one-percent-bottom">My Friends</h2>
                )}
                <div className="peers">
                    {friends &&
                        friends.map((each) => (
                            <div className="five-percent-right" key={each.id}>
                                <Link
                                    className="one-percent-right one-percent-bottom"
                                    to={`/user/${each.id}`}
                                    key={each.id}
                                >
                                    <div className="pic-peers">
                                        <img
                                            className="img-frame"
                                            src={each.img_url || "/default.svg"}
                                            alt={`${each.first} ${each.last}`}
                                        />
                                    </div>
                                    <div className="center">
                                        {each.first} {each.last}
                                    </div>
                                </Link>
                                <button
                                    className="button-translate nomargin red"
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
