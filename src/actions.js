import axios from "./axios";

export async function getFriendsAndRequests() {
    const { data } = await axios.get("/get-friends-wannabes");
    console.log(
        "actions.js, data from axios-request getFriendsAndRequests:",
        data
    );
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsWannabes: data,
    };
}

export async function acceptFriend(id) {
    console.log("actions.js, axios-request acceptFriend running");
    await axios.post("/wannabes/:id");
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id,
    };
}

export async function endFriendship(id) {
    console.log("actions.js, axios-request endFriendship running");
    await axios.post("/myfriends/:id");
    return {
        type: "UNFRIEND",
        id,
    };
}

// axios request to server (server does the usual stuff)
// then: passed on to reducer
