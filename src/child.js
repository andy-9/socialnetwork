import React from "react";

export default class Child extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("this.props:", this.props);
        return (
            <div>
                <h1>Child component</h1>;<h2>{this.props.first} is the best</h2>
                ;
            </div>
        );
    }
}

// export default function Child(props) {
//     // "props": object
//     console.log("props:", props);
//     return <h1>Child component!</h1>;
// }
