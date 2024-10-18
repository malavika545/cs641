/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import HomeScreen from '../components/pages/Home/Home';

const Stack = createNativeStackNavigator();

const App = () => {
    return
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
        </Stack.Navigator>
};

const styles = StyleSheet.create({});

export default App;