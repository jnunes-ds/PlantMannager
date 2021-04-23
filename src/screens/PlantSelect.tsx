import React, { useEffect, useState } from 'react';
import { 
    StyleSheet,
    Text, 
    View,
    FlatList,
    ActivityIndicator, 
} from 'react-native';
import { EnvironmentButton } from '../components/EnvironmentButton';

import { Header } from '../components/Header';
import { Load } from '../components/Load';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';


interface EnvironmentProps{
    key: string;
    title: string
}

interface PlantsProps{
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: Array<string>;
    frequency: {
        times: number;
        repeat_every: string;
    }
}

export function PlantSelect(){

    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<PlantsProps[]>([]);
    const [filteredPlants, setFilteredPlants] = useState<PlantsProps[]>([]);
    const [environmentSelected, setEnvironmentSelected] = useState('all');
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);


    function handleEnvironmentSelected(environment: string){
        setEnvironmentSelected(environment);

        if(environment === 'all'){
            return setFilteredPlants(plants);
        }

        const filtered = plants.filter(plant => {
            if(plant.environments.includes(environment)){
                let filteredList: Array<string> = new Array();
                filteredList.push(String(plant));
                return filteredList;
            }
        });
        
        setFilteredPlants(filtered);
        
    }

    function handleFetchMore(distance: number){
        if(distance<1)
            return;
        
            setLoadingMore(true);
            setPage(oldValue => oldValue + 1)
            fetchPlants();
    }

    async function fetchPlants(){
        const { data } = await api
            .get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`);
        
        if(!data)
            return setLoading(true);
        if(page > 1){
            setPlants(oldValue => [...oldValue, ...data]);
            setFilteredPlants(oldValue => [...oldValue, ...data]);
        }else{
            setPlants(data);
            setFilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    }

    useEffect(() => {
        async function fetchEnvironment(){
            const { data } = await api
                .get('plants_environments?_sort=title&_order=asc');

            setEnvironments([
                {
                    key: "all",
                    title: "Todos"
                },
                ...data
            ]);
        }

        fetchEnvironment();

    },[]);

    useEffect(() => {

        fetchPlants();

    },[]);

    if(loading)
        return <Load />

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Header />
                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    Você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList 
                    data={environments}
                    keyExtractor={item => String(item.key)}
                    renderItem={({ item }) => (
                        <EnvironmentButton 
                        title={item.title}
                        onPress={() => handleEnvironmentSelected(item.key)}
                        active={
                            item.key === environmentSelected
                            }
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList 
                    data={filteredPlants}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardPrimary 
                            data={item}
                        />
                    )}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) => {
                        handleFetchMore(distanceFromEnd)
                    }}

                    ListFooterComponent={
                        loadingMore
                        ? <ActivityIndicator color={colors.green}/>
                        : <></>
                    }
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading
    },
    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingRight: 50,
        marginLeft: 32,
        marginRight: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    },
});