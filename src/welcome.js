import React from "React";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./reset";
import Navbar from "./navbar";
// import Shortinfo from "./shortinfo";
import { LogoNoText } from "./logo";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div>
            <h1>Kite.Inc</h1>
            <LogoNoText />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
