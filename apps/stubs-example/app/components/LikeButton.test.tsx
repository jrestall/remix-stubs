import { describe, it, afterEach, expect } from "vitest";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { useLoaderData } from "@remix-run/react";
import { createRemixStub } from "remix-stubs";
import { LikeButton } from "./LikeButton";

// Example implementation of Ryan Florence's tests from https://github.com/remix-run/remix/discussions/2481

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("LikeButton", () => {
  // set up a fake "database" record again
  let fakePost = { id: "123", title: "Fake Post", liked: false };

  // Make the stub
  let RemixStub = createRemixStub([
    {
      path: "/post/:postId",
      loader: () => fakePost,
      element: <TestSubject />,
    },
    {
      path: "/post/:postId/like",
      action: async ({ request }) => {
        // add some delay to test the optimistic UI
        await sleep(100);
        let formData = await request.formData();
        fakePost.liked = JSON.parse(formData.get("liked") as string);
        return null;
      },
    },
  ]);

  // Now we're testing the component how it's more likely to be used:
  function TestSubject() {
    let post = useLoaderData();
    return (
      <LikeButton
        liked={post.liked}
        label={post.liked ? `Unlike ${post.title}` : `Like ${post.title}`}
        href={`/post/${post.id}/like`}
      />
    );
  }

  afterEach(() => {
    // reset the fake record
    fakePost.liked = false;
  });

  it("renders an empty heart initially", async () => {
    render(
      <RemixStub
        initialEntries={["/post/123"]}
        initialLoaderData={{ "/post/:postId": fakePost }}
      />
    );
    await waitFor(() => screen.getByRole("button"));
    expect(screen.getByRole("button").innerHTML).toMatch("🤍");
  });

  // In this test we no longer need to mock useFetcher return values, the test
  // also no longer has to know the implementation details of the spelling of
  // "liked" in the formData
  it("optimistically renders the heart", async () => {
    render(
      <RemixStub
        initialEntries={["/post/123"]}
        initialLoaderData={{ "/post/:postId": fakePost }}
      />
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => screen.getByText("💗"));

    // assert it's optimistic, our action will not have changed this yet
    expect(fakePost.liked).toBe(false);

    // wait for the action
    await waitFor(() => fakePost.liked === true);

    // expect to still see the heart
    expect(screen.getByText("💗")).toBeDefined();
  });

  /*it("optimistically renders the heart", async () => {
    render(
      <RemixStub
        initialEntries={["/post/123"]}
        initialLoaderData={{ "/post/:postId": fakePost }}
      />
    );
    fireEvent.click(screen.getByRole("button"));

    // check optimistic render, we haven't resolved the action or loader yet
    await waitFor(() => screen.getByText("♥"));
    expect(screen.getByText("♥")).toBeDefined();

    // manually resolve the action, this is just something the person writing the
    // test could set up on the routes in the test with a `deferred()`
    // implementation.
    await actionDeferred.resolve(true);
    // assert it's still a filled in heart after the action resolves
    expect(screen.getByText("♥")).toBeDefined();

    // finally resolve the loader with the new record
    await loaderDeferred.resolve({ title: "fake", liked: true });
    // assert it's still a filled in heart
    expect(screen.getByText("♥")).toBeDefined();
  });*/
});
