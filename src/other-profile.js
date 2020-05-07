import React, { Component, Fragment } from "react";
import axios from "./axios";

class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("this.props.match.params.id:", this.props.match.params.id);
        const otherUserId = this.props.match.params.id;

        // and now make request to server asking for info about this user
        // axios.get("/api/users/" + id);

        // user should not be able to view their own profile
        // server: checks if cookie-id is the same as the /user/id, send back res.json for the than to use this.props.history.push()

        // handle if the user tries to go to a profile that does not exist, i.e. /user/234348 --> send user back to "/"
    }

    render() {
        return (
            <Fragment>
                <h1>I am OtherProfile</h1>
            </Fragment>
        );
    }
}

export default OtherProfile;
