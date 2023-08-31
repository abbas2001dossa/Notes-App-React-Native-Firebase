import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import List from './Screens/List';
// import Details from './Screens/Details';
import Login from './Screens/Login';
import {useEffect,useState} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import Details from './Screens/Details';
import { Store } from './Store';
import { Provider } from 'react-redux';
const Stack = createNativeStackNavigator();

export default function App() {

  // user from firebase/auth
  const [user,setUser]= useState<User | null>(null);

  useEffect(()=>{
    onAuthStateChanged(FIREBASE_AUTH, (user)=>{
      console.log('user ' ,user);
      setUser(user);
    });
  },[]);

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          
          {user ? (
            <>
              <Stack.Screen name="Notes" component={List}></Stack.Screen>
              <Stack.Screen name="Details" component={Details}></Stack.Screen>
            </>
          ):(
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
          )}
          
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

