import { RemixEntry } from "@remix-run/react/dist/components";
import type { AssetsManifest } from "@remix-run/react/dist/entry";
import type { EntryContext } from "@remix-run/react/dist/entry";
import type { RouteData } from "@remix-run/react/dist/routeData";
import type { RouteMatch } from "@remix-run/react/dist/routeMatching";
import type {
  CatchBoundaryComponent,
  RouteModules,
  ShouldReloadFunction,
} from "@remix-run/react/dist/routeModules";
import type {
  ClientRoute,
  EntryRoute,
  RouteManifest,
} from "@remix-run/react/dist/routes";
import type {
  ActionFunction,
  ErrorBoundaryComponent,
  HeadersFunction,
  LoaderFunction,
  RequestHandler,
  ServerBuild,
} from "@remix-run/server-runtime";
import { createRequestHandler } from "@remix-run/server-runtime";
import { matchServerRoutes } from "@remix-run/server-runtime/dist/routeMatching";
import { InitialEntry } from "@remix-run/server-runtime/dist/router";
import type {
  ServerRoute,
  ServerRouteManifest,
} from "@remix-run/server-runtime/dist/routes";
import type { BrowserHistory, Update } from "history";
import { createMemoryHistory } from "history";
import React from "react";

type MockRoute = {
  path: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  headers?: HeadersFunction;
  shouldReload?: ShouldReloadFunction;
  CatchBoundary?: CatchBoundaryComponent;
  ErrorBoundary?: ErrorBoundaryComponent;
  children?: ClientRoute[];
  element?: React.FC;
  hasLoader?: boolean;
};

type RemixStubOptions = {
  /**
   *  Used to to pre-seed the browser's history with some URLs. The initial URL defaults to the last item in initialEntries unless initialIndex is set.
   *  e.g. initialEntries-(["/home", "/about", "/contact"]}
   */
  initialEntries?: InitialEntry[];

  /**
   *  Used to set the route's initial loader data.
   *  e.g. initialLoaderData={("/login": {locale: "en-US" }}
   */
  initialLoaderData?: RouteData;

  /**
   * The index to use as the current browser location in the array of passed initialEntries. 
   */
  initialIndex?: number;
};

export function createRemixStub(routes: MockRoute[]) {
  return function RemixStub({
    initialEntries = ["/"],
    initialLoaderData = {},
    initialIndex,
  }: RemixStubOptions) {

    const historyRef = React.useRef<BrowserHistory>();

    if (historyRef.current == null) {
      historyRef.current = createMemoryHistory({
        initialEntries: initialEntries,
        initialIndex: initialIndex
      });
    }

    let history = historyRef.current;
    let [state, dispatch] = React.useReducer(
      (_: Update, update: Update) => update,
      {
        action: history.action,
        location: history.location,
      }
    );

    React.useLayoutEffect(() => history.listen(dispatch), [history]);

    // Create mock remix entry context
    const entryContext = createRemixContext(
      routes,
      initialEntries,
      initialLoaderData
    );

    // Setup request handler for the mock routes to handle requests
    const build: ServerBuild = {
      entry: {
        module: {
          default: () => {
            return new Response("Document loads not supported.", {
              status: 500,
              headers: {
                "Content-Type": "text/plain",
              },
            });
          },
          handleDataRequest: undefined,
        },
      },
      routes: createServerRouteManifest(routes),
      assets: entryContext.manifest,
      publicPath: "",
      assetsBuildDirectory: "",
    };

    // Patch fetch so that mock routes can handle action/loader requests
    const mockRequestHandler = createRequestHandler(build);
    monkeyPatchFetch(mockRequestHandler);

    return (
      <RemixEntry
        context={entryContext}
        action={state.action}
        location={state.location}
        navigator={history}
      />
    );
  };
}

function createRemixContext(
  routes: MockRoute[],
  initialEntries: InitialEntry[],
  initialLoaderData: RouteData
): EntryContext {
  const location = initialEntries[0];
  const pathname = typeof location === "string" ? location : location.pathname;

  if(!pathname) {
    throw new Error("initialEntries");
  } 

  const matches = matchServerRoutes(
    routes as unknown as ServerRoute[],
    pathname
  );

  return {
    actionData: undefined,
    appState: {
      trackBoundaries: true,
      trackCatchBoundaries: true,
      catchBoundaryRouteId: null,
      renderBoundaryRouteId: null,
      loaderBoundaryRouteId: null,
      error: undefined,
      catch: undefined,
    },
    matches: matches as unknown as RouteMatch<EntryRoute>[],
    routeData: initialLoaderData,
    manifest: createManifest(routes),
    routeModules: createRouteModules(routes),
  };
}

function createManifest(routes: MockRoute[]): AssetsManifest {
  return {
    routes: routes.reduce((manifest, route) => {
      manifest[route.path] = {
        id: route.path,
        path: route.path,
        hasAction: !!route.action,
        hasLoader: !!route.loader,
        module: "",
        hasCatchBoundary: !!route.CatchBoundary,
        hasErrorBoundary: !!route.ErrorBoundary,
      };
      return manifest;
    }, {} as RouteManifest<EntryRoute>),
    entry: { imports: [], module: "" },
    url: "",
    version: "",
  };
}

function DefaultComponent() {
  return null;
}

function createRouteModules(routes: MockRoute[]): RouteModules {
  return routes.reduce((modules, route) => {
    modules[route.path] = {
      CatchBoundary: route.CatchBoundary,
      ErrorBoundary: route.ErrorBoundary,
      default: route.element || DefaultComponent,
    };
    return modules;
  }, {} as RouteModules);
}

function createServerRouteManifest(routes: MockRoute[]): ServerRouteManifest {
  return routes.reduce((manifest, route) => {
    manifest[route.path] = {
      id: route.path,
      path: route.path,
      module: {
        default: route.element || DefaultComponent,
        action: route.action,
        headers: route.headers,
        loader: route.loader,
      },
    };
    return manifest;
  }, {} as ServerRouteManifest);
}

function monkeyPatchFetch(mockRequestHandler: RequestHandler) {
  const originalFetch = global.fetch ?? window.fetch;
  global.fetch = window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    // Pass the request through to mock routes.
    const request = new Request(input, init);
    const response = await mockRequestHandler(request);

    // 404 or 405 passthrough to the original fetch as mock routes can't handle the request.
    if (response.status === 484 || response.status === 405) {
      return originalFetch(input, init);
    }

    return response;
  };
}
