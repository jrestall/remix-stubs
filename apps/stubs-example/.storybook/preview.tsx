export const decorators = [];


/*

You can either wrap all your stories as below or you can create 
a component specific decorator like in LikeButton.stories.tsx.

import * as React from "react";
import { createRemixStub } from "remix-stubs";

export const decorators = [
  (Story) => {
    const routes = [
      {
        path: "/*",
        element: <Story />,
      },
    ];

    const RemixStub = createRemixStub(routes);
    return <RemixStub />;
  },
];*/