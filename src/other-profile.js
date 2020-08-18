import React, { Component, Fragment } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import FriendShipButton from "./friend-button";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("other-profile.js, componentDidMount is running");
        const otherUserId = this.props.match.params.id;

        axios
            .get("/api/user/" + otherUserId)
            .then(({ data }) => {
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
                this.setState({ data });
            })
            .catch((err) => {
                console.log(
                    "CATCH in other-profile.js in axios.get /api/friends-of-friends/:",
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
                            <div>
                                <div>
                                    <h4 className="three-percent-bottom">
                                        {`${this.state.first} ${this.state.last} `}
                                        is also friends with
                                    </h4>

                                    <div>
                                        {this.state.data &&
                                            this.state.data.map((each) => {
                                                return (
                                                    <div
                                                        className="five-percent-bottom"
                                                        key={each.id}
                                                    >
                                                        <Link
                                                            className="flex"
                                                            to={`/user/${each.id}`}
                                                            key={each.id}
                                                        >
                                                            <div className="image-chat-container">
                                                                <img
                                                                    className="image-in-chat"
                                                                    src={
                                                                        each.img_url ||
                                                                        "/default.svg"
                                                                    }
                                                                    alt={`${each.first} ${each.last}`}
                                                                />
                                                            </div>
                                                            <div className="position-fullname">
                                                                {`${each.first} ${each.last}`}
                                                            </div>
                                                        </Link>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                                {/* )} */}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default OtherProfile;
