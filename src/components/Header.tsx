import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import colors from '../global/styles/colors';
import fonts from '../global/styles/fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';


export function Header(){
    const [userName, setUserName] = useState<string>();
    const defaultImageProfileAdress = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
    const [imageProfile, setImageProfile] = useState<string>(defaultImageProfileAdress);
    const navigation = useNavigation();
    
    
    
    useEffect(() => {
        async function loadStorageUserName(){
            const user = await AsyncStorage.getItem('@plantmanager:user');
            setUserName(user || '');
        }

        loadStorageUserName();
    },[]);

    useEffect(() => {
        async function loadStorageImageProfile(){
            const img = await AsyncStorage.getItem('@plantmanager:imageProfile');
            setImageProfile(img || imageProfile);
        }

        loadStorageImageProfile();
    },[]);

    async function editProfile(): Promise<void>{
        await navigation.navigate('EditProfile')
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.hello}>Olá,</Text>
                <Text style={styles.userName}>
                    {userName}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => editProfile()}
            >
                <Image 
                    source={{ uri: `${imageProfile}` }} 
                    style={styles.image}
                />
            </TouchableOpacity>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: getStatusBarHeight(),
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35
    },
    hello: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName: {
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 40
    }
});