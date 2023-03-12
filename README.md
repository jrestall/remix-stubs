:warning: ***Remix has now released [@remix-run/testing](https://www.npmjs.com/package/@remix-run/testing?activeTab=versions) ([example tests](https://github.com/remix-run/remix/blob/dev/packages/remix-testing/__tests__/stub-test.tsx)) which should be used instead of remix-stubs. It has a very similar API so migration is easy. With stubbing now built-in to Remix, remix-stubs won't be updated and only works with older versions of Remix such as <v1.9.***

# remix-stubs

An example implementation and usage of Ryan Florence's [createRemixStub design](https://github.com/remix-run/remix/discussions/2481) with Storybook and Vitest.

## Examples

- [create-remix-stub.tsx](./packages/remix-stubs/src/create-remix-stub.tsx) for a stub implementation.
- [preview.tsx](./apps/stubs-example/.storybook/preview.tsx) and [main.ts](apps/stubs-example/.storybook/main.ts) for a Storybook 7.0 w/ Vite example.

### Tests

- [LikeButton.test.tsx](./apps/stubs-example/app/components/LikeButton.test.tsx) for Ryan's Vitest unit testing example.
- [new.test.tsx](./apps/stubs-example/app/routes/notes/new.test.tsx) for an initialActionData example.
- [login.test.tsx](./apps/stubs-example/app/routes/login.test.tsx) for a login form submission test with vitest mocks to assert the action has been called once.
- [$teamId.test.tsx](./apps/stubs-example/app/routes/teams/$teamId.test.tsx) for an example that uses useOutletContext().

Whilst I won't be publishing remix-stubs as a package, since it relies on deep imports from Remix, please do create issues, examples or discussions so that the example implementation can be improved.

## Current Issues

There's a few issues and workarounds you will need to be aware of.

### Unit Testing

- global.FormData wasn't being set to the jsdom class. Manually set it in [setup-test-env.ts](./apps/stubs-example/test/setup-test-env.ts).
- happy-dom doesn't support formdata or form submissions so if unit testing those you should set the vitest environment to jsdom in [vitest.config.js](./apps/stubs-example/vitest.config.js).
- jsdom's form submission support isn't perfect and won't pass the form submit button's value as documented in [LikeButton.tsx](./apps/stubs-example/app/components/LikeButton.tsx).

### Storybook

- Due to the deep import of RemixEntry in [create-remix-stub.tsx](./packages/remix-stubs/src/create-remix-stub.tsx) from @remix-run/react, you may find webpack/vite bundles both a esm and cjs version of the components code, which causes React context to be inconsistent. For vite I've added an alias in [.storybook/main.ts](./apps/stubs-example/.storybook/main.ts) as a temporary workaround.
