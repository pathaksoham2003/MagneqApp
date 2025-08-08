import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/RootNavigator";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";  // <-- import here
import { ToastProvider } from 'react-native-toast-notifications'
import { store, persistor } from "./reducer/store";


const queryClient = new QueryClient();

function App() {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider style={{ flex: 1, paddingTop: 30 }}>  {/* <-- Wrap here */}
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </ToastProvider>
  );
}

export default App;
