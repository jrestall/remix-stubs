import { render, screen } from "@testing-library/react";
import { createRemixStub } from "remix-stubs";
import New from "./new";

describe("New Note Route", () => {
  // Make the stub
  let RemixStub = createRemixStub([
    {
      path: "/notes/new",
      element: <New />,
    },
  ]);

  it("displays title required error message", async () => {
    render(
      <RemixStub
        initialEntries={["/notes/new"]}
        initialActionData={{
          "/notes/new": {
            errors: { title: "Title is required", body: null },
          },
        }}
      />
    );

    expect(screen.getByRole("textbox", { name: "Title:" })).toBeInvalid();
    expect(screen.getByText("Title is required")).toBeDefined();
  });
});
