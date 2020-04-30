import React from "react";
import ReactDOM from "react-dom";
import HelloWorld from "./helloworld"; // no curly braces necessary because of 'export default'

ReactDOM.render(<HelloWorld />, document.querySelector("main"));
