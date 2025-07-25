import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Dashboard from "../screens/Dashboard";
import Production from "../screens/Production";
import Sales from "../screens/Sales";
import Stores from "../screens/Stores";
import Purchase from "../screens/Purchase";
import Quality from "../screens/Quality";
import CreateTicket from "../screens/Quality/CreateTicket";
import TicketDetails from "../screens/Quality/TicketDetails";

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
          <Stack.Screen name="Stores" component={Stores} />
          <Stack.Screen name="Purchase" component={Purchase} />
          <Stack.Screen name="Quality" component={Quality} />
          <Stack.Screen name="CreateTicket" component={CreateTicket} />
          <Stack.Screen name="TicketDetails" component={TicketDetails} />


        </>

      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
