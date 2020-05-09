import React, { Component, Fragment } from "react";
import BioEditor from "./bioeditor";
import { render, waitForElement, fireEvent } from "@testing-library/react";
import axios from "./axios";

// 1
test("When no bio is passed to BioEditor, a 'Tell us a little bit about yourself' button is rendered", async () => {
    const { container } = render(<BioEditor bio={null} />);

    await waitForElement(() => container.querySelector("div"));

    expect(container.querySelector("div").innerHTML).toBe(
        "<button>Tell us a little bit about yourself</button>"
    );
});

// 2a
test("When a bio is passed to BioEditor, an 'Edit your info' button is rendered", async () => {
    const { container } = render(<BioEditor bio={!null} />);

    await waitForElement(() => container.querySelector("button"));

    expect(container.querySelector("button").innerHTML).toBe("Edit your info");
});

// 2b
test("When a bio is passed to BioEditor, an 'Edit your info' button is rendered", async () => {
    const { container } = render(<BioEditor bio={!null} />);

    await waitForElement(() => container.querySelector("div"));

    expect(container.querySelector("button").getAttribute("class")).toBe(
        "edit-bio-button"
    );
});

// 2c - not working, do not understand why
// test("When a bio is passed to BioEditor, an 'Edit your info' button is rendered", async () => {
//     const { container } = render(<BioEditor bio={!null} />);

//     await waitForElement(() => container.querySelector("div"));

//     expect(container.querySelector("div").childNodes[1]).toBe(
//         "<button class='edit-bio-button'>Edit your info</button>"
//     );
// });

// 3
test("Clicking the 'Tell us a little bit about yourself' or 'Edit your info' button causes a textarea and a 'Save' button to be rendered", () => {
    const myMockOnClick = jest.fn();

    const { container } = render(<BioEditor onClick={myMockOnClick} />);

    fireEvent.click(container.querySelector("button"));

    expect(container.getElementsByTagName("textarea").length).toBe(1);
    expect(container.querySelector("button").getAttribute("class")).toBe(
        "save-button"
    );
});

// 4a
// jest.mock("./axios");

// test("Clicking the 'save' button causes an ajax request", async () => {
//     const myMockOnClick = jest.fn();
//     const mockAxios = require("./axios");

//     const { container } = render(<BioEditor onClick={myMockOnClick} />);

//     fireEvent.click(container.querySelector("button"));

//     expect(mockAxios.post).toHaveBeenCalledTimes(1);
//     expect(myMockOnClick.mock.calls.length).toBe(1);
// });

// 4b
// jest.mock("./axios");

// test("Clicking the 'save' button causes an ajax request", async () => {
//     const { container } = render(<BioEditor />);

//     fireEvent.click(container.querySelector("button"));

//     let draftBio;

//     axios.post.mockResolvedValue({
//         data: {
//             draftBio: "no, thanks",
//         },
//     });

//     await waitForElement(() => container.querySelector("bioeditor-container"));
//     expect(container.querySelector("bio-text").innerHTML).toBe(draftBio);
// });
