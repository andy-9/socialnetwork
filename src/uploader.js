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
        this.setState({
            file: e.target.files[0],
        });
    }

    uploadImage() {
        var each = this;
        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/imgupload", formData)
            .then(({ data }) => {
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
                    <h5>
                        Something went wrong. Please try again. The max.
                        file-size is 2 MB.
                    </h5>
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
