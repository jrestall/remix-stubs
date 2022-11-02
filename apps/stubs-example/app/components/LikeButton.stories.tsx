import { createRemixStub } from "remix-stubs";
import type { StoryFn, Meta } from "@storybook/react";
import { useArgs } from "@storybook/client-api";
import { LikeButton } from "./LikeButton";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
let story: Meta<typeof LikeButton> = {
  title: "Example/LikeButton",
  component: LikeButton,
  decorators: [
    (Story) => {
      const [args, updateArgs] = useArgs();
      const RemixStub = createRemixStub([
        {
          path: "/post/1",
          element: <Story />,
          loader: () => {
            return args;
          },
          action: async ({ request }) => {
            let formData = await request.formData();
            await new Promise((resolve) => setTimeout(resolve, 1000));
            updateArgs({ liked: formData.get("liked") === "true" });
            return null;
          },
        },
      ]);

      return (
        <RemixStub
          initialLoaderData={{ "/post/1": args }}
          initialEntries={["/post/1"]}
        />
      );
    },
  ],
};

export default story;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof LikeButton> = (args) => <LikeButton {...args} />;

export const Liked = Template.bind({});
Liked.args = {
  action: "/post/1",
  label: "Fake Post",
  liked: true,
};

export const NotLiked = Template.bind({});
NotLiked.args = {
  action: "/post/1",
  label: "Fake Post",
  liked: false,
};
