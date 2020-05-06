import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

export default class BioEditor extends React.Component {
    constructor() {
        super();

        this.state = {
            textareaIsVisible: false,
            draftBio: null,
        };

        console.log("bioeditor.js, this.state in BioEditor:", this.state);
    }

    componentDidMount() {
        this.setState({
            dbBio: this.props.bio,
        });
    }

    handleChange(e) {
        console.log("bioeditor.js handleChange, e.target:", e.target);
        this.setState(
            {
                draftBio: e.target.value,
            },
            () =>
                console.log(
                    "bioeditor.js, this.state in handleChange:",
                    this.state
                )
        );
    }

    toggleTextarea() {
        console.log("bioeditor.js, toggleTextarea running");
        this.setState({
            textareaIsVisible: !this.state.textareaIsVisible,
        });
    }

    uploadBio() {
        console.log("bioeditor.js, uploadBio running");
        var each = this;
        let updateBioInfo = { id: this.props.id, bio: this.state.draftBio };
        this.props.updateBio(this.state.draftBio);

        this.setState = {
            textareaIsVisible: false,
        };

        axios
            .post("/bio", updateBioInfo)
            .then(({ data }) => {
                console.log(
                    "bioeditor.js in post /bio after upload, data:",
                    data
                );
                each.props.updateBio(data.userBio.bio);
            })
            .catch((err) => {
                console.log("CATCH in bioeditor.js in axios.post /bio:", err);
            });
    }

    render() {
        return (
            <div>
                <h2>heading in bioeditor.js</h2>

                {this.state.textareaIsVisible && (
                    <div>
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={(e) => this.handleChange(e)}
                            name="textarea"
                            cols="30"
                            rows="10"
                        ></textarea>
                        <button
                            onClick={this.uploadBio()}
                            // onClick={this.toggleTextarea()}
                        >
                            submit
                        </button>
                    </div>
                )}

                {this.props.bio && (
                    <div>
                        <p>{this.props.bio}</p>
                        <p onClick={() => this.toggleTextarea()}>
                            Edit your info
                        </p>
                    </div>
                )}

                {!this.props.bio && (
                    <div>
                        <p
                            onClick={() =>
                                this.setState({ textareaIsVisible: true })
                            }
                        >
                            Tell us a little bit about yourself
                        </p>
                    </div>
                )}
            </div>
        );
    }
}
