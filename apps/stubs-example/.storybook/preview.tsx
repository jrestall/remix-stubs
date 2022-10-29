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
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
