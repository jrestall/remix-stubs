import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { createRemixStub } from "remix-stubs";
import Login from "./login";

describe("Login Route", () => {
  const loginSpy = vi.fn();
  let email: string, password: string, redirectTo: string;

  // Make the stub
  let RemixStub = createRemixStub([
    {
      path: "/login",
      element: <Login />,
      action: async ({ request }) => {
        let formData = await request.formData();
        email = formData.get("email") as string;
        password = formData.get("password") as string;
        redirectTo = formData.get("redirectTo") as string;
        loginSpy();
      },
    },
  ]);

  it("submits valid credentials successfully", async () => {
    const user = userEvent.setup();
    render(<RemixStub initialEntries={["/login?redirectTo=/test"]} />);

    const emailInput = screen.getByRole("textbox", { name: /Email address/i });
    await userEvent.type(emailInput, "test@test.com");

    const passwordInput = screen.getByLabelText(/Password/i);
    await userEvent.type(passwordInput, "S3cre7");

    await user.click(screen.getByRole("button", { name: /Log in/i }));

    expect(email).toBe("test@test.com");
    expect(password).toBe("S3cre7");
    expect(redirectTo).toBe("/test");
    expect(loginSpy).toHaveBeenCalledTimes(1);
  });
});
