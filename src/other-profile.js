import React, { Component, Fragment } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import FriendShipButton from "./friend-button";
// import ChatWithFriends from "./chat-with-friends";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areFriends: true,
        };
        console.log("other-profile.js, state:", this.state);
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
            .get("/api/friends-of-friends/" + otherUserId)
            .then(({ data }) => {
                console.log(
                    "other-profile.js in get /api/friends-of-friends/, data:",
                    data
                );
                this.setState({ data }, () =>
                    console.log(
                        "other-profile.js in get /api/threefriends/, this.state:",
                        this.state
                    )
                );
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
                        <div className="">
                            {console.log("other-profile.js, rendering false")}
                            {this.state.areFriends === false && (
                                <h4 className="one-percent-bottom"></h4>
                            )}
                        </div>

                        <div className="">
                            {console.log("other-profile.js, rendering true")}
                            <div>
                                {this.state.areFriends === true && (
                                    <div>
                                        <h4 className="one-percent-bottom">
                                            {this.state.first} {this.state.last}
                                            is also friends with
                                        </h4>

                                        <div>
                                            {console.log(
                                                "other-profile.js, mapping to begin"
                                            )}
                                            {this.state.data &&
                                                this.state.data.map((each) => {
                                                    return (
                                                        <div key={each.id}>
                                                            <Link
                                                                className="one-percent-bottom"
                                                                to={`/user/${each.id}`}
                                                                key={each.id}
                                                            >
                                                                <div className="">
                                                                    <img
                                                                        className="img-frame"
                                                                        src={
                                                                            each.img_url ||
                                                                            "/default.svg"
                                                                        }
                                                                        alt={`${each.first} ${each.last}`}
                                                                    />
                                                                </div>
                                                                {each.first}{" "}
                                                                {each.last}
                                                            </Link>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default OtherProfile;
