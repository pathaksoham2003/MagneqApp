import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Dashboard from "../screens/Dashboard";
import Production from "../screens/Production";
import Sales from "../screens/Sales";

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {(props) => (
            <Login {...props} onLogin={() => setIsLoggedIn(true)} />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Dashboard">
            {(props) => (
              <Dashboard {...props} onLogout={() => setIsLoggedIn(false)} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Production" component={Production} />
          <Stack.Screen name="Sales" component={Sales} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
