import React from "React";
import Registration from "./registration";
import Login from "./login";
import Navbar from "./navbar";
// import Shortinfo from "./shortinfo";
import { LogoNoText } from "./logo";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div>
            <h1>Kiters Against Sexism</h1>
            <LogoNoText />
            <Navbar />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
