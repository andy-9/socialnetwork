import React from "react";
import App from "./app-test";
import { render, waitFor } from "@testing-library/react";
import axios from "../src/axios";

// automatic mock, jest does the work, returns a fake axios
jest.mock("../src/axios");

test("App shows nothing at first", async () => {
    // async so I can await the promise
    axios.get.mockResolvedValue({
        // I need to pass in mock data from the mock axios, values do not matter
        data: {
            id: 1,
            first: "ivana",
            last: "matijevic",
            url: "/dog.png",
        },
    });

    const { container } = render(<App />);

    // make sure that div in return statement appears on screen
    // problem: axios is asynchronous
    // before we write expect()-statement we tell it to wait:
    await waitFor(() => expect(container.children.length).toBe(1));
});
