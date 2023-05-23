
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
interface ILevelSelectProps {
    level: number
    onSelect: (num: number) => void
}
export const LevelSelect = (props) => {

    const setGameLevel = (num: number) => {
        props.onSelect(num);
    }

    return (
        <View style={styles.container}>
        <View style={{marginBottom: 40, width:'100%'}}>
            <Text style={styles.levelTitle}>LEVEL:</Text>
            {[[4, 5, 6], [7, 8, 9]].map((r,i)=>{
                return (<View key={i} style={{flexDirection: "row",justifyContent: "space-evenly", width: "100%"}}>
                    {r.map((v, i) => {
                return (<TouchableHighlight key={i}
                                            style={{
                                                marginVertical: 8,
                                                borderRadius: 10,
                                                backgroundColor: '#fff',
                                                paddingVertical: 10,
                                                paddingHorizontal: 20
                                            }}
                                            activeOpacity={0.9}
                                            underlayColor="#fff"
                                            onPress={() => setGameLevel(v)}>
                    <View style={{alignItems: "center"}}>
                        <Text style={{fontSize: 20}}>{v}x</Text>
                    </View>
                </TouchableHighlight>)
            })}
                    </View>
                    )})}
        </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        marginTop: 40,
        // marginBottom: 60,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    levelTitle: {
        textAlign: "center", fontSize: 20, marginBottom: 20, color:'white',
        textShadowRadius: 1,
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1}
    }

    }


)
