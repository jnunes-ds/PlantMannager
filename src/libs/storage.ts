import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';
import { Alert } from 'react-native';

export interface PlantProps {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: Array<string>;
    frequency: {
        times: number;
        repeat_every: string;
    },
    hour: string;
    dateTimeNotification: Date;
}

export interface StoragePlantProps {
    [id: string]: {
        data: PlantProps;
        notificationId: string;
    }
}

const plantsStorageKey = '@plantmanager:plants';

export async function savePlant(plant:PlantProps): Promise<void> {
    try {
        const nextTime = new Date(plant.dateTimeNotification);
        const now = new Date();

        const { times, repeat_every } = plant.frequency;
        if(repeat_every === 'week'){
            const interval = Math.trunc(7 / times);
            nextTime.setDate(now.getDate() + interval);
        }else{
            nextTime.setDate(nextTime.getDate() + 1);
        }

        const seconds = Math.abs(
            Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
        );

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Heeey, 🌱',
                body: `Está na hora de cuidar da sua ${plant.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {
                    plant
                },
            },
            trigger: {
                seconds: seconds < 60 ? 60 : seconds,
                repeats: true
            }
        })

        const data = await AsyncStorage.getItem(plantsStorageKey);
        const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const newPlant = {
            [plant.id]: {
                data: plant,
                notificationId
            }
        }

        await AsyncStorage.setItem(plantsStorageKey,
        JSON.stringify({
            ...newPlant,
            ...oldPlants
        })
        )

    }catch(error : any){
        throw new Error(error);
    }
}

export async function loadPlant(): Promise<PlantProps[]> {
    try {

        const data = await AsyncStorage.getItem(plantsStorageKey);
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const plantsSorted = Object
            .keys(plants)
            .map(plant => {
                return {
                    ...plants[plant].data,
                    hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
                }
            })
            .sort((a, b) => 
                Math.floor(
                    new Date(a.dateTimeNotification).getTime() / 1000 -
                    Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
                )
            );

            return plantsSorted;

    }catch(error : any){
        throw new Error(error);
    }
}

export async function removePlant(id: string): Promise<void>{
    const data = await AsyncStorage.getItem(plantsStorageKey);
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);

    delete plants[id];

    await AsyncStorage.setItem(
        plantsStorageKey,
        JSON.stringify(plants)
);
}

export async function saveImageProfile(uri: string){
    try{
        await AsyncStorage.setItem('@plantmanager:imageProfile', uri);
        
    }catch{
        Alert.alert('Não foi possível salvar a imagem. 😞')
    }
    
}

export async function saveUserName(name:string) {
    try{
        if(!name || name == ''){
            return
        }
        await AsyncStorage.setItem('@plantmanager:user', name||'');
    }catch{
        Alert.alert('Não foi possível modificar o seu nome 😞')
    }
}