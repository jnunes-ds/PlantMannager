import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Platform,
    Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { saveImageProfile } from '../libs/storage';

export function EditProfile(){
    const defaultImageProfileAdress = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
    const [imageProfile, setImageProfile] = useState<string>(defaultImageProfileAdress);
    const navigation = useNavigation();


    const getCurrentImageProfile: VoidFunction = async() => {
        const img = await AsyncStorage.getItem('@plantmanager:imageProfile');
        await setImageProfile(img || defaultImageProfileAdress);
    }

    useEffect(() => {
        (async () => {
            if(Platform.OS !== 'web'){
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if(status !== 'granted'){
                    Alert.alert('Atenção','Precisamos que você nos conceda o acesso à sua galeria para prossegir')
                }
            }
        })();
    },[]);

    const pickImage: VoidFunction = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if(!result.cancelled){
            try{
                await setImageProfile(result.uri);
            }catch{
                Alert.alert('Não foi possível carregar a foto 😞')
            }
        }
    }

    const saveChanges: VoidFunction = async () => {
        saveImageProfile(imageProfile);
        navigation.navigate('Confirmation', {
            title: 'Pronto!',
            subtitle: 'Seu perfil foi alterado com sucesso!',
            buttonTitle: 'Avançar',
            icon: 'smile',
            mextScreen: 'PlantSelect'
        })
    }

    
    getCurrentImageProfile();

    return (

        <View
            style={styles.container}
        >
            <View style={styles.editLabel}>
                <Text style={styles.editLabelTitle}>
                    Editar
                </Text>
                <Text style={styles.editLabelContent}>
                    Utilize o espaço abaixo para editar seus dados pessoais
                </Text>
            </View>
            <TouchableOpacity
                style={styles.imageProfileContainer}
                onPress={pickImage}
            >
                <Image 
                    source={{ uri: `${imageProfile}` }}
                    style={styles.image}
                />
                
                <MaterialIcons 
                    name="edit"
                    style={styles.editProfileIcon}
                    size={40}
                    color={colors.red}
                />
            </TouchableOpacity>

            <TextInput 
                style={styles.input}
                placeholder="Digite o seu nome"
            />

            <View style={styles.footer}>
                <Button
                    label="Salvar"
                    onPress={saveChanges}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    editLabel: {
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    editLabelTitle: {
        fontFamily: fonts.heading,
        fontWeight: 'bold',
        fontSize: 30
    },
    editLabelContent: {
        fontFamily: fonts.text,
        fontSize: 14,
        textAlign: 'justify',
        marginTop: 20
    },
    imageProfileContainer: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75
    },
    editProfileIcon: {
        position: 'absolute',
        backgroundColor: colors.blue_light,
        borderRadius: 50,
        bottom: 20
    },
    input:{
        width: "100%",
        fontSize: 24,
        textAlign: "center",
        fontFamily: fonts.heading,
        marginBottom: 30
    },
    button: {
        width: 100,
        height: 50
    },
    footer: {
        width: '100%',
        paddingHorizontal: 50,
        marginTop: 20
    }
});