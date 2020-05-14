export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }

    // if (action.type === "ACCEPT_FRIEND_REQUEST") {
    //     state = {
    //         ...state,
    //         friendsWannabes: state.friendsWannabes.map((friend) => {
    //             if (friend.id == action.id) {
    //                 return {
    //                     ...friend,
    //                     friend: action.type == "ACCEPT_FRIEND_REQUEST",
    //                 };
    //             } else {
    //                 return friend;
    //             }
    //         }),
    //     };
    // }

    // if (action.type === "UNFRIEND") {
    //     state = {
    //         ...state,
    //         friendsWannabes: state.friendsWannabes.map((friend) => {
    //             if (friend.id == action.id) {
    //                 return {
    //                     ...friend,
    //                     friend: action.type == "UNFRIEND",
    //                 };
    //             } else {
    //                 return friend;
    //             }
    //         }),
    //     };
    // }

    console.log("reducer.js, state:", state);
    return state;
}

// always has to be a copy --> do not use push, pop, shift etc., but:
// ... (spread operator for cloning and adding), map (clone array and modify one/several items in cloned array), filter (remove items from cloned array), concat (combine arrays)
