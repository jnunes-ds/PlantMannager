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
import colors from '../global/styles/colors';
import fonts from '../global/styles/fonts';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { saveImageProfile, saveUserName } from '../libs/storage';

export function EditProfile(){
    const defaultImageProfileAdress = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png';
    const [imageProfile, setImageProfile] = useState<string>(defaultImageProfileAdress);
    const [userName, setUserName] = useState<string>('fefew');
    const navigation = useNavigation();


    useEffect(() => {
        const getCurrentImageProfile: VoidFunction = async() => {
            const img = await AsyncStorage.getItem('@plantmanager:imageProfile');
            if(!img || img == ''){
                saveImageProfile(defaultImageProfileAdress);
            }
            await setImageProfile(img || defaultImageProfileAdress);
        }

        getCurrentImageProfile();

    },[]);

    useEffect(() => {
        const getCurrentUserName: VoidFunction = async () => {
            const name = await AsyncStorage.getItem('@plantmanage:user');
            setUserName(name || '');
        }

        getCurrentUserName();

    },[]);

    

    useEffect(() => {
        (async () => {
            if(Platform.OS !== 'web'){
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if(status !== 'granted'){
                    Alert.alert('Atenção','Precisamos que você nos conceda o acesso à sua galeria para prossegir')
                }
            }
        })();
    },[]);

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

    const takeASelf: VoidFunction = async () => {
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

    const pickImageFromGallery: VoidFunction = async () => {
        let result = await ImagePicker.launchImageLibraryAsync()

        if(!result.cancelled){
            try{
                await setImageProfile(result.uri);
            }catch{
                Alert.alert('Não foi possível carregar a foto 😞')
            }
        }
    }

    function chooseBetweenCameraAndGallery(){
        Alert.alert('Escolha uma foto', 'Escolha uma foto de sua preferência a partir da galeria ou da câmera', [
            {
                text: 'Escolha da caleria',
                onPress: () => pickImageFromGallery()
            },
            {
                text: 'Tirar agora com a câmera',
                onPress: () => takeASelf()
            },
            {
                text: 'Cancelar'
            }
        ])
    }

    const saveChanges: VoidFunction = async () => {
        saveImageProfile(imageProfile);
        saveUserName(userName);
        navigation.navigate('Confirmation', {
            title: 'Pronto!',
            subtitle: 'Seu perfil foi alterado com sucesso!',
            buttonTitle: 'Avançar',
            icon: 'smile',
            mextScreen: 'PlantSelect'
        })
    }

    function handleInputChange(value: string){
        setUserName(value);
    }

    function removeImageProfile(){
        setImageProfile(defaultImageProfileAdress);
    }

    function chooseToChangeOrDelete(){
        Alert.alert('Foto de perfil:', 'deseja alterar a foto de perfil?', [
            {
                text: 'Excluir Foto',
                onPress: () => Alert.alert('Atenção!', 'Tem certeza que deseja deletar a foto de perfil?', [
                    {
                        text: 'Não'
                    },
                    {
                        text: 'Sim',
                        onPress: () => removeImageProfile()
                    }
                ])
            },
            {
                text: 'Cancelar',
            },
            {
                text: 'Escolher outra foto',
                onPress: () => chooseBetweenCameraAndGallery()
            }
        ])
    }

    function imageProfileIsDefault(){
        if(imageProfile == defaultImageProfileAdress){
            chooseBetweenCameraAndGallery();
        }else{
            chooseToChangeOrDelete();
        }
    }

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
                onPress={imageProfileIsDefault}
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
                placeholder={"Digite o seu nome"}
                onChangeText={handleInputChange}
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