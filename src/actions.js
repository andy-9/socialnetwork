import axios from "./axios";

export async function getFriendsAndRequests() {
    const { data } = await axios.get(`/get-friends-wannabes`);

    // axios request to server (server does the usual stuff)
    // then: passed on to reducer:
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsAndWannabes: data,
    };
}

export async function acceptFriend(otherUserId) {
    await axios.post(`/send-friend-request/${otherUserId}`, {
        bt: "Accept Friend Request",
    });

    return {
        type: "ACCEPT_FRIEND_REQUEST",
        otherUserId,
    };
}

export async function endFriendship(otherUserId) {
    await axios.post(`/send-friend-request/${otherUserId}`, {
        bt: "End Friendship",
    });

    return {
        type: "UNFRIEND",
        otherUserId,
    };
}

export function lastTen(ltcm) {
    return {
        type: "TEN",
        ltcm,
    };
}

export function chatMessage(cm) {
    return {
        type: "MSG",
        cm,
    };
}
