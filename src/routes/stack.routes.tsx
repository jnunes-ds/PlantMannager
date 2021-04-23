import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import colors from '../styles/colors';
import App from '../../App';
import { Welcome } from '../screens/Welcome';
import { UserIdentification } from '../screens/UserIdentification';
import { Confirmation } from '../screens/Confirmation';
import { PlantSelect } from '../screens/PlantSelect';
import { PlantSave } from '../screens/PlantSave';
import { MyPlants } from '../screens/MyPlants';

const stackRoutes = createStackNavigator();

const AppRoutes: React.FC = () => (
    <stackRoutes.Navigator
        headerMode="none"
        screenOptions={{
            cardStyle: {
                backgroundColor: colors.white
            },
        }}
    >
        <stackRoutes.Screen 
            name="Welcome"
            component={Welcome}
        />

        <stackRoutes.Screen 
            name="UserIdentification"
            component={UserIdentification}
        />

        <stackRoutes.Screen 
            name="Confirmation"
            component={Confirmation}
        />
        <stackRoutes.Screen 
            name="PlantSelect"
            component={PlantSelect}
        />
        <stackRoutes.Screen 
            name="PlantSave"
            component={PlantSave}
        />
        <stackRoutes.Screen 
            name="MyPlants"
            component={MyPlants}
        />

    </stackRoutes.Navigator>
);

export default AppRoutes;
