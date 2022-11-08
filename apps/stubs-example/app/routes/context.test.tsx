import { useLoaderData } from "@remix-run/react";
import { render, screen } from "@testing-library/react";
import { createContext, useContext } from "react";
import { createRemixStub } from "remix-stubs";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

enum Theme {
  LIGHT = 1,
  DARK = 2,
}

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const initialContext: ThemeContextType = {
  theme: Theme.LIGHT,
  toggleTheme: (): void => {
    throw new Error("setContext function must be overridden");
  },
};

function ThemeToggler() {
  const { theme, toggleTheme } = useContext<ThemeContextType>(ThemeContext);
  return (
    <button
      onClick={() => {
        console.log("Clicked!");
        toggleTheme();
      }}
    >
      <svg className="text-blue-500" />
      {theme === Theme.DARK ? "DARK" : "LIGHT"}
    </button>
  );
}

const ThemeContext = createContext<ThemeContextType>(initialContext);
function ThemeProvider({
  children,
  specifiedTheme,
}: {
  children: React.ReactNode;
  specifiedTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(specifiedTheme);
  const toggleTheme = () => {
    setTheme((theme) => (theme === Theme.DARK ? Theme.LIGHT : Theme.DARK));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

describe("Team Route", () => {
  const RemixStub = createRemixStub([
    {
      path: "/",
      element: <TestSubject />,
    },
  ]);

  function TestSubject() {
    const { theme } = useLoaderData();
    return (
      <ThemeProvider specifiedTheme={theme}>
        <ThemeToggler />
      </ThemeProvider>
    );
  }

  it("sets correctly a color theme", async () => {
    const user = userEvent.setup();
    render(<RemixStub initialLoaderData={{ "/": { theme: Theme.LIGHT } }} />);

    // theme is correctly set to light
    expect(await screen.findByRole("button")).toMatchInlineSnapshot(`
      <button>
        <svg
          class="text-blue-500"
        />
        LIGHT
      </button>
    `);

    //render(<RemixStub initialLoaderData={{ "/": { theme: Theme.DARK } }} />);
    // instead of using `rerender` I've tried first to trigger user interaction but it didn't work:
    await user.click(await screen.findByRole("button"));

    // theme didn't get updated to dark (className should be `text-yellow-500`)
    expect(await screen.findByRole("button")).toMatchInlineSnapshot(`
      <button>
        <svg
          class="text-blue-500"
        />
        DARK
      </button>
    `);
  });

  it("sets correctly a dark color theme", async () => {
    render(<RemixStub initialLoaderData={{ "/": { theme: Theme.DARK } }} />);
    // instead of using `rerender` I've tried first to trigger user interaction but it didn't work:
    // user.click(screen.getByRole("button"));

    // theme didn't get updated to dark (className should be `text-yellow-500`)
    expect(await screen.findByRole("button")).toMatchInlineSnapshot(`
      <button>
        <svg
          class="text-blue-500"
        />
        DARK
      </button>
    `);
  });
});
