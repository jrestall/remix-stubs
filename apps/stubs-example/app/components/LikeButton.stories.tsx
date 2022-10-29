import type { StoryFn, Meta } from '@storybook/react';
import { LikeButton } from './LikeButton';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Example/LikeButton",
  component: LikeButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as Meta<typeof LikeButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof LikeButton> = (args) => <LikeButton {...args} />;

export const Liked = Template.bind({});
Liked.args = {
  liked: true,
  label: 'Liked',
};

export const NotLiked = Template.bind({});
NotLiked.args = {
  liked: false,
  label: "Not Liked",
};
