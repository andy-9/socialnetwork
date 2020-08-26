export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsAndWannabes: action.friendsAndWannabes,
        };
    }

    if (action.type === "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map((friend) => {
                if (friend.id == action.otherUserId) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }

    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.filter(
                (friend) => friend.id != action.otherUserId
            ),
        };
    }

    if (action.type === "TEN") {
        state = {
            ...state,
            cm: action.ltcm,
        };
    }

    if (action.type === "MSG") {
        state = {
            ...state,
            cm: action.cm,
        };
    }

    return state;
}

// always has to be a copy --> do not use push, pop, shift etc., but:
// - ... (spread operator for cloning and adding)
// - map (clone array and modify one/several items in cloned array)
// - filter (remove items from cloned array)
// - concat (combine arrays)
