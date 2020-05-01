import React from "React";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <h1>Kiters Against Sexism</h1>
            {/* LOGO LARGE */}
            {/* short explanation about the social network */}
            <Registration />
            <p>
                Already registered? Just <a href="/login">Login</a>
            </p>
        </div>
    );
}
