// src/helloworld.js // could be named anything, but convention: name after what is inside
import React from "react";
import axios from "axios"; // needs to be imported, is not global
import Child from "./child";

export default class HelloWorld extends React.Component {
    constructor() {
        super();
        this.state = {
            first: "Andy",
            last: "Hechler",
        };
    }

    componentDidMount() {
        // oftentimes in Vue we would do the following in mounted:
        // axios.get("/images").then(function (resp) {
        //     self.images = resp.data;
        // });
        axios.get("/some-route").then((resp) => {
            // this is how to update state (always with setState):
            this.setState({
                // first: res.data.first, // data is what we get from the server
            });
        });

        setTimeout(() => {
            this.setState({
                first: "Andreas",
            });
        }, 3000);
    }

    // this becomes undefined when we create our own methods, we need to bind it
    handleClick() {
        console.log("handleClick is running!");
        this.setState({
            first: "animal crossing",
        });
    }

    render() {
        return (
            <div>
                Hello, {this.state.first} {this.state.last}!
                <Child first={this.state.first} />
                {/* prop "first" passed down to Child component
                "first" on left side could be anything, is the name of the prop */}
                <p onClick={() => this.handleClick()}>click me!</p>
                {/* arrow-functions remember "this" --> we can use it in our event handlers (here: handleClick) */}
            </div>
        );
    }
}

// export default function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
