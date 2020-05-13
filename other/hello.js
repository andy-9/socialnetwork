import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function Hello() {
    const [first, setFirst] = useState("Andrea");
    // useState gives an array: 1st: property value ("Andrea"), 2nd: function that can change the value whenever you call it
    // convention: always use "set + property" for the name of the function
    const [country, setCountry] = useState("");
    const [countries, setCountries] = useState([]);
    // an empty array is not equal to another empty array; an empty string is equal to another empty string

    useEffect(() => {
        console.log(`'${first}' has been rendered in useEffect.`);
    });
    // you can have multiple use effects, will do 2 different things

    useEffect(() => {
        console.log("useEffect runs");

        axios
            .get(`http://flame-egg.glitch.me/?q=${country}`)
            .then(({ data }) => {
                console.log("data from flame egg:", data);
                setCountries(data); // adds 'data' to [countries]
            });

        // cleanup-function:
        return () => {
            console.log(`about to replace ${country} with a new value`);
        };
    }, [country]); // second argument, prevents infinite loop, you can pass variables used in first argument/function or an empty array (run only once), without second argument runs every time

    return (
        <div>
            <p>Hello {first}, we're learning hooks today.</p>

            {/* onChange will run every time I put something in the input field, update {first} and render immediately: */}
            <input onChange={(e) => setFirst(e.target.value)} />

            <input onChange={(e) => setCountry(e.target.value)} />

            <ul>
                {countries.map((each) => (
                    <li key={each}>{each}</li>
                ))}
            </ul>
            {/* "each" can be called anything, could also be "country". "key" is passed a unique identifier, e.g. each.id*/}
        </div>
    );
}
