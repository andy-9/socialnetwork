import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        // console.log(
        //     "uploader.js handleChange, e.target.files[0]:",
        //     e.target.files[0]
        // );
        this.setState(
            {
                file: e.target.files[0],
            }
            // () =>
            //     console.log(
            //         "uploader.js 'this.state.file' in handleChange:",
            //         this.state.file
            //     )
        );
    }

    uploadImage() {
        var each = this;
        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/imgupload", formData)
            .then(({ data }) => {
                // console.log(
                //     "uploader.js, data.userImg.user_img in post /imgupload:",
                //     data.userImg.img_url
                // );
                // if (response.data[0] === null || response.data === "noNumber") {
                each.props.profileImgUrl(data.userImg.img_url);
                this.closeModal();
            })
            .catch((err) => {
                console.log(
                    "CATCH in uploader.js in axios.post /uploader:",
                    err
                );
                this.setState({
                    error: true,
                });
            });
    }

    closeModal() {
        // console.log("uploader.js, closeModal fired");
        this.props.toggleModal();
    }

    render() {
        return (
            <div className="img-modal">
                <div className="x" onClick={() => this.closeModal()}>
                    X
                </div>
                <h3 className="center">Upload your image here</h3>
                <div
                    className="choose-file center"
                    onChange={(e) => this.handleChange(e)}
                >
                    <ion-icon
                        class="icon"
                        name="cloud-upload-outline"
                    ></ion-icon>
                    <label htmlFor="file" className="label-uploader pointer">
                        Choose an image
                    </label>
                    <input
                        id="file"
                        className="input-for-file"
                        type="file"
                        name="file"
                        accept="image/*"
                    />
                </div>
                {this.state.error && (
                    <h5>Something went wrong. Please try again.</h5>
                )}
                <button
                    className="button-uploader"
                    onClick={() => this.uploadImage()}
                >
                    upload
                </button>
            </div>
        );
    }
}
