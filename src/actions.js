import axios from "./axios";

export async function getFriendsAndRequests() {
    const { data } = await axios.get(`/get-friends-wannabes`);
    console.log(
        "actions.js, data from axios-request getFriendsAndRequests:",
        data
    );

    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsAndWannabes: data,
    };
}

export async function acceptFriend(otherUserId) {
    console.log("actions.js, axios-request acceptFriend running");
    await axios.post(`/send-friend-request/${otherUserId}`, {
        bt: "Accept Friend Request",
    });
    console.log("actions.js, axios post  request acceptFriend successful");

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        otherUserId,
    };
}

export async function endFriendship(otherUserId) {
    console.log("actions.js, axios-request endFriendship running");
    await axios.post(`/send-friend-request/${otherUserId}`, {
        bt: "End Friendship",
    });
    console.log("actions.js, axios post request endFriendship successful");

    return {
        type: "UNFRIEND",
        otherUserId,
    };
}

// axios request to server (server does the usual stuff)
// then: passed on to reducer
