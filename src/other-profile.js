import React, { Component, Fragment } from "react";
import axios from "./axios";
import FriendShipButton from "./friend-button";
// import ChatWithFriends from "./chat-with-friends";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("other-profile.js, componentDidMount is running");
        // console.log("other-profile.js, componentDidMount, this.props.match.params.id:", this.props.match.params.id);
        const otherUserId = this.props.match.params.id;

        axios
            .get("/api/user/" + otherUserId)
            .then(({ data }) => {
                // console.log(
                // "other-profile.js in get /otherprofile, data:",
                // data
                // );
                if (data.isLoggedInUser) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        first: data.otherUserInfo.first,
                        last: data.otherUserInfo.last,
                        img_url: data.otherUserInfo.img_url || "/default.svg",
                        bio: data.otherUserInfo.bio,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "CATCH in other-profile.js in axios.get /api/user/:",
                    err
                );
            });

        axios
            .get("/api/threefriends/" + otherUserId)
            .then(({ data }) => {
                console.log(
                    "other-profile.js in get /otherprofile, data:",
                    data
                );
                if (data.noFriends) {
                    // don't show anything
                } else {
                    this.setState({
                        idFriend: data.id,
                        firstFriend: data.first,
                        lastFriend: data.last,
                        img_urlFriend: data.img_url || "/default.svg",
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "CATCH in other-profile.js in axios.get /api/threefriends/:",
                    err
                );
            });
    }

    render() {
        return (
            <Fragment>
                <div className="profile">
                    <div className="pic-for-profile">
                        <img
                            className="img-frame"
                            src={this.state.img_url || "/default.svg"}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                    </div>
                    <div className="text-for-profile">
                        <h6 className="profile-fullname">
                            {this.state.first} {this.state.last}
                        </h6>
                        <p className="bio-text">{this.state.bio}</p>
                        <FriendShipButton
                            otherUserId={this.props.match.params.id}
                            first={this.state.first}
                            last={this.state.last}
                        />
                    </div>
                    <div className="friends-of-friends-container">
                        {/* {threeFriends && !threeFriends.length === 0 && (
                        )} */}
                        {/* {threeFriends && threeFriends.length > 0 && ( */}
                        <h4 className="one-percent-bottom">
                            {this.state.first} {this.state.last} is also friends
                            with
                        </h4>
                        {/* )} */}
                        <div className="">
                            {/* {data &&
                                data.map((each) => (
                                    <div className="" key={each.idFriend}>
                                        <Link
                                            className="one-percent-bottom"
                                            to={`/user/${each.idFriend}`}
                                            key={each.idFriend}
                                        >
                                            <div className="pic-peers">
                                                <img
                                                    className="img-frame"
                                                    src={
                                                        each.img_urlFriend ||
                                                        "/default.svg"
                                                    }
                                                    alt={`${each.firstFriend} ${each.lastFriend}`}
                                                />
                                            </div>
                                            <div className="center">
                                                {each.firstFriend}{" "}
                                                {each.lastFriend}
                                            </div>
                                        </Link>
                                    </div>
                                ))} */}
                        </div>
                        {/* } */}
                    </div>
                    {/* {console.log("other-profile.js 1:", this.state.buttonText)} */}
                    {/* {console.log("other-profile.js 2:", this.props.buttonText)} */}
                    {/* <ChatWithFriends id="position-duo-chat" /> */}
                </div>
            </Fragment>
        );
    }
}

export default OtherProfile;
