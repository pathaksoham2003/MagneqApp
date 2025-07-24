/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigators/RootNavigator";
import { create } from 'twrnc';
import { useDeviceContext, useAppColorScheme } from 'twrnc';
import { store, persistor } from './reducer/store';
export const tw = create(require(`./tailwind.config.js`));
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
    // <View style={styles.container}>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    //   <NewAppScreen templateFileName="App.tsx" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
