import React, { Component, Fragment } from "react";
import ProfilePic from "./profilepic-test";
import { render, fireEvent } from "@testing-library/react";

test("renders img with src set to url prop", () => {
    const { container } = render(<ProfilePic url="/turnips.jpg" />);
    // "container" generates the DOM
    // value of url could be anything
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/turnips.jpg"
    );
});

test("renders img with src set to /default.jpg when no url prop is present", () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector("img").getAttribute("src")).toBe(
        "/default.jpg"
    );
});

test("renders first and last props in alt attribute", () => {
    const { container } = render(<ProfilePic first="ivana" last="matijevic" />);
    expect(container.querySelector("img").getAttribute("alt")).toBe(
        "ivana matijevic"
    );
});

test("onClick prop gets called when image is clicked", () => {
    const myMockOnClick = jest.fn(); // i don't pass anything since i just want to know IF the function is called
    const { container } = render(<ProfilePic onClick={myMockOnClick} />); // "onClick" because that's what I used in ProfilePic in profilepic-test.js
    fireEvent.click(container.querySelector("img"));
    expect(myMockOnClick.mock.calls.length).toBe(1); // how many times was the function called
});
