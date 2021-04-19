import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import colors from '../styles/colors';

interface ButtonProps extends TouchableOpacityProps{
    label: string
}

export function Button({ label, ...others } : ButtonProps){
    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            { ...others }
        >
            <Text style={styles.buttonText}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 15,
        height: 63,
        width: 63,
    },
    buttonText: {
        color: colors.white,
        fontSize: 26
    }
});
