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
  const [initialRoute, setInitialRoute] = useState('Dashboard');

  const handleLogin = (routeName = 'Dashboard') => {
    setInitialRoute(routeName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setInitialRoute('Dashboard'); // Reset to default
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login">
          {props => <Login {...props} onLogin={handleLogin} />}
        </Stack.Screen>
      ) : (
        <>
          {/* Dashboard Screen */}
          <Stack.Screen 
            name="Dashboard" 
            initialParams={{ isInitial: initialRoute === 'Dashboard' }}
          >
            {props => (
              <Dashboard {...props} onLogout={handleLogout} />
            )}
          </Stack.Screen>

          {/* Sales Screens */}
          <Stack.Screen 
            name="Sales"
            initialParams={{ isInitial: initialRoute === 'Sales' }}
          >
            {props => (
              <Sales {...props} onLogout={handleLogout} />
            )}
          </Stack.Screen>
          <Stack.Screen 
            name="CreateSales" 
            component={CreateSales}
            initialParams={{ isInitial: initialRoute === 'CreateSales' }}
          />
          <Stack.Screen name="ViewSales" component={ViewSales} />

          {/* Production Screens */}
          <Stack.Screen 
            name="Production"
            initialParams={{ isInitial: initialRoute === 'Production' }}
          >
            {props => (
              <Production {...props} onLogout={handleLogout} />
            )}
          </Stack.Screen>
          <Stack.Screen name="ViewProduction" component={ViewProduction} />

          {/* Store/Purchase Screens */}
          <Stack.Screen 
            name="Store" 
            component={Stores}
            initialParams={{ isInitial: initialRoute === 'Store' }}
          />
          <Stack.Screen name="Purchase" component={Purchase} />
          <Stack.Screen name="CreatePurchase" component={CreatePurchase} />
          <Stack.Screen name="PurchaseDetail" component={PurchaseDetail} />
          <Stack.Screen name="RawMaterialDetail" component={RawMaterialDetail} />
          <Stack.Screen name="AddStock" component={AddStock} />

          {/* Quality Screens */}
          <Stack.Screen name="Quality" component={Quality} />
          <Stack.Screen name="CreateQuality" component={CreateQuality} />
          <Stack.Screen name="CreateTicket" component={CreateTicket} />
          <Stack.Screen name="TicketDetails" component={TicketDetails} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;