import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store.js";
import { SidebarProvider } from "./context/SidebarContext.jsx";
import App from "./App.jsx";
import "./index.css";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
    import("@tanstack/react-query-devtools").then((mod) => ({
      default: mod.ReactQueryDevtools,
    }))
  )
  : () => null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SidebarProvider>
              <App />
            </SidebarProvider>
          </BrowserRouter>
          {import.meta.env.DEV && (
            <Suspense fallback={null}>
              <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
            </Suspense>
          )}
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);

