import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Keyboard, KeyboardAvoidingView } from 'react-native';
import Tw from 'twrnc';
import * as Animatable from 'react-native-animatable';
import {createUserWithEmailAndPassword , signInWithEmailAndPassword} from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardActive, setKeyboardActive] = useState(false);
  const auth = FIREBASE_AUTH;

  const SignUp = async () => {
    // Your sign-up logic
    try{
        const response = await createUserWithEmailAndPassword(auth,email,password);
        alert(" User Successfully Registered ! ");
    }
    catch(error){console.log(error); alert(" User Email Already Taken !");}
  };

  const SignIn = async () => {
    // Your sign-in logic
    try{
        console.log(password);
        console.log(email);
        const response = await signInWithEmailAndPassword(auth,email,password);
        console.log(response);
        // alert("Login Successful !");
    
    }
    catch(error){
        console.log(error);
        alert(" Invalid Credentials !");
    }

  };

  const move = () => {
    setKeyboardActive(true);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', move);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardActive(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={Tw``}>
      {!keyboardActive && (
        <Animatable.Image
          source={require('../assets/logingif.gif')}
          animation="slideInUp"
          iterationCount={1}
          style={Tw`h-96 w-110`}
        />
      )}

      <KeyboardAvoidingView behavior="padding" style={Tw`p-10 mt-0`}>
        <TextInput
          style={Tw`border h-10 my-5 text-center rounded bg-gray-300 shadow`}
          placeholder="Email"
          autoCapitalize='none'
          value={email}
          onChangeText={(text: string) => setEmail(text)}
        />
        <TextInput
          style={Tw`border h-10 my-1 text-center rounded bg-gray-300 shadow`}
          placeholder="Password"
          textContentType="password"
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          secureTextEntry 
        />

        <View style={Tw`flex-row text-center justify-between my-4 `}>
          <View style={Tw`mr-5 rounded`}>
            <Button title="Create Account" onPress={SignUp} />
          </View>
          <View style={Tw`rounded`}>
            <Button title="Sign In" onPress={SignIn} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
