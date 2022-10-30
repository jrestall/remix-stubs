# remix-stubs

An example implementation and usage of Ryan Florence's [createRemixStub design](https://github.com/remix-run/remix/discussions/2481) with Storybook and Vitest.

Please see,
- [createRemixStub.tsx](./packages/remix-stubs/src/createRemixStub.tsx) for the stub implementation.
- [preview.tsx](./apps/stubs-example/.storybook/preview.tsx) and [main.ts](apps/stubs-example/.storybook/main.ts) for the Storybook example.
- [LikeButton.test.tsx](./apps/stubs-example/app/components/LikeButton.test.tsx) for the Vitest unit testing example.

Whilst I won't be publishing remix-stubs as a package, since it relies on deep imports from Remix, please do raise issues or discussions so that the example implementation can be improved.