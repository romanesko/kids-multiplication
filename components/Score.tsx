import {StyleSheet, Text, View} from "react-native";
import React, {useEffect} from "react";

interface IScoreProps {
    counters: { ok:number,nok:number }
}

export const Score = (props)=>{

    return (
        <View style={styles.score}>
            <View style={styles.item}>
            { props.counters.nok ? <Text style={{color: '#ff0000aa'}}> -{props.counters.nok}</Text> : <></>}
            </View>
            <View style={styles.item}>
            { props.counters.ok ? <Text style={{color: '#21b000'}}> +{props.counters.ok}</Text>: <></> }
            </View>
        </View>)
}


const styles = StyleSheet.create({
    score: {
        paddingTop: 40,
        flexDirection: 'row',
    },
    item: {
        marginHorizontal:2
    }
})
