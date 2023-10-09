import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "@remix-run/react";

import { RouterProvider } from "react-aria-components";

import styles from "./tailwind.css";
import { GlobalToastRegion } from "./components/Toast";
import { Header } from "./components/Header";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export default function App() {
  const navigate = useNavigate();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="">
        <RouterProvider navigate={navigate}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-grow flex items-stretch">
              <Outlet />
            </div>
          </div>
          <GlobalToastRegion />
        </RouterProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
