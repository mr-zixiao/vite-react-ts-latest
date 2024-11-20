import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useTitle } from "ahooks";
import rem from "@/utils/rem.ts";
import { useResize } from "@/hooks";
import AppRouter from "@/router";
import AntdProvider from "@/context/Antd.tsx";
import { store, persistor } from "@/store";

function App() {
  useTitle((window as any).__APP_CONFIG__.title);
  const resize = useResize(true);
  useEffect(() => {
    resize.addResizeListener(rem);
    return () => {
      resize.removeResizeListener(rem);
    };
  }, []);
  return (
    <>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AntdProvider>
            <AppRouter></AppRouter>
          </AntdProvider>
        </PersistGate>
      </ReduxProvider>
    </>
  );
}

export default App;
