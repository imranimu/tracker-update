import * as React from 'react'; 

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator(); 

import RegisterScreen from './screens/registerScreen'
import LoginScreen from "./screens/loginScreen";
import HomeScreen from "./screens/homeScreen";  


export default class App extends React.Component {

  render(){    
    return (      
      <NavigationContainer>        
        <Stack.Navigator>
        <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{
              headerShown: false
            }} 
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false
            }}
          />            
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}