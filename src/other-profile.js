import React, { Component, Fragment } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import FriendShipButton from "./friend-button";
// import ChatWithFriends from "./chat-with-friends";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // areFriends: true,
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
            .get("/api/threefriends/" + otherUserId)
            .then(({ data }) => {
                console.log(
                    "other-profile.js in get /otherprofile, data:",
                    data
                );
                // if (data.areFriends) {
                //     console.log("other-profile.js, areFriends: false");
                //     this.setState({
                //         areFriends: false,
                //     });
                //     // don't show anything
                // } else {
                // for (let i = 0; i < data.length; i++) {
                //     this.setState({
                //         idFriend: data[i].id,
                //         firstFriend: data[i].first,
                //         lastFriend: data[i].last,
                //         img_urlFriend: data[i].img_url || "/default.svg",
                //     });
                // }
                // this.setState(data);
                this.setState({ data }, () => console.log(this.state));
                // }
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
                        {/* {areFriends && !areFriends.length === 0 && ()} */}
                        {/* {threeFriends && threeFriends.length > 0 && ( */}
                        {/* {areFriends && ( */}
                        <h4 className="one-percent-bottom">
                            {this.state.first} {this.state.last} is also friends
                            with
                        </h4>

                        <div className="">
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
                                                {each.first} {each.last}
                                            </Link>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default OtherProfile;
