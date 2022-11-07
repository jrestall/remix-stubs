import { render, screen } from "@testing-library/react";
import { createRemixStub } from "remix-stubs";
import Teams from "../teams";
import Team from "./$teamId";
import TeamsIndex from "./index";

describe("Team Route", () => {
  // Make the stub
  let RemixStub = createRemixStub([
    {
      element: <Teams />,
      children: [
        {
          path: "/teams/index",
          index: true,
          element: <TeamsIndex />,
        },
        {
          path: "/teams/:teamId",
          element: <Team />,
        },
      ],
    },
  ]);

  it("renders the teams from outlet context", async () => {
    render(
      <RemixStub
        initialEntries={["/teams/1"]}
        initialLoaderData={{
          "/": { subtitle: "subtitle" },
          "/teams/:teamId": { ad: "ad" },
        }}
      />
    );

    expect(screen.getByText("ad")).toBeDefined();
    expect(screen.getByText("subtitle")).toBeDefined();
    expect(screen.getByText("Team One")).toBeDefined();
  });
});
