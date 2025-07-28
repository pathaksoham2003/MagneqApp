import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Production from '../screens/Production';
import Sales from '../screens/Sales';
import Purchase from '../screens/Purchase';
import CreatePurchase from '../screens/Purchase/CreatePurchase';
import CreateSales from '../screens/Sales/CreateSales';
import ViewProduction from '../screens/Production/ViewProduction';
import Quality from '../screens/Quality';
import CreateQuality from '../screens/Quality/CreateQuality';
import ViewSales from '../screens/Sales/ViewSales';
import Stores from '../screens/Stores';
import CreateTicket from '../screens/Quality/CreateTicket';
import TicketDetails from '../screens/Quality/TicketDetails';
import RawMaterialDetail from '../screens/Stores/RawMaterialDetail';
import AddStock from '../screens/Stores/AddStock';
import PurchaseDetail from '../screens/Purchase/PurchaseDetail';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {props => <Login {...props} onLogin={() => setIsLoggedIn(true)} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Dashboard">
            {props => (
              <Dashboard {...props} onLogout={() => setIsLoggedIn(false)} />
            )}
          </Stack.Screen>
          <Stack.Screen name="ViewProduction" component={ViewProduction} />
          <Stack.Screen name="Sales">
            {props => (
              <Sales {...props} onLogout={() => setIsLoggedIn(false)} />
            )}
          </Stack.Screen>

          <Stack.Screen name="Production">
            {props => (
              <Production {...props} onLogout={() => setIsLoggedIn(false)} />
            )}
          </Stack.Screen>
          <Stack.Screen name="ViewSales" component={ViewSales} />
          <Stack.Screen name="CreateSales" component={CreateSales} />
          <Stack.Screen name="CreatePurchase" component={CreatePurchase} />
          <Stack.Screen name="Quality" component={Quality} />
          <Stack.Screen name="CreateQuality" component={CreateQuality} />
          <Stack.Screen name="Stores" component={Stores} />
          <Stack.Screen name="AddStock" component={AddStock} />
          <Stack.Screen name="Purchase" component={Purchase} />
          <Stack.Screen name="PurchaseDetail" component={PurchaseDetail} />
          <Stack.Screen name="CreateTicket" component={CreateTicket} />
          <Stack.Screen name="TicketDetails" component={TicketDetails} />

          <Stack.Screen
            name="RawMaterialDetail"
            component={RawMaterialDetail}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
