import React, { VoidFunctionComponent } from 'react';
import { 
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps
 } from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface ButtonsProps extends TouchableOpacityProps {
    label: string;
}

export function Button({ label, ...rest } : ButtonsProps){
    return (
        <TouchableOpacity 
            style={styles.container}
            {...rest}
        >
            <Text style={styles.text} >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.green,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: colors.white,
        fontFamily: fonts.heading
    }
});