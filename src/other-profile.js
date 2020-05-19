import React, { Component, Fragment } from "react";
import axios from "./axios";
import FriendShipButton from "./friend-button";
import ChatWithFriends from "./chat-with-friends";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.log("other-profile.js is running");
        // console.log("this.props.match.params.id:", this.props.match.params.id);
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
                    "CATCH in other-profile.js in axios.get /otherprofile:",
                    err
                );
            });
    }

    render() {
        return (
            <Fragment>
                <div className="profile flex">
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
                    {/* {console.log("other-profile.js 1:", this.state.buttonText)} */}
                    {/* {console.log("other-profile.js 2:", this.props.buttonText)} */}
                    {/* <ChatWithFriends id="position-duo-chat" /> */}
                </div>
            </Fragment>
        );
    }
}

export default OtherProfile;
