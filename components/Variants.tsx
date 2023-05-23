import {StyleSheet, Text, TouchableHighlight, View} from "react-native";
import React from "react";
import {Cell} from "./Table";

interface IVariantsProps {
    variants:any
    lastAnswerState: string
    selectedVariant: any
    onClick: any
}

export const Variants = (props) => {
    const [isCorrect, setIsCorrect] = React.useState(false)
    const variantStyle = (v: Cell) => {

        if (props.selectedVariant && v == props.selectedVariant) {
            if (props.lastAnswerState == 'CORRECT') {
                return styles.variantCorrect
            } else if (props.lastAnswerState == 'INCORRECT') {
                return styles.variantIncorrect
            }

        }
    }
    const onPress = (v: Cell) => {
        if (props.onClick(v)){
            setIsCorrect(true)
        }
    }


    return (
    <View style={styles.variantsBlock}>
        {props.variants.map((v, i) => {
            return (<TouchableHighlight key={i}
                                        style={{...styles.variant, ...variantStyle(v)}}
                                        activeOpacity={0.9}
                                        underlayColor="#fff"
                                        onPress={() => onPress(v)}>
                <View>
                    <Text style={styles.variantText} key={i}>{v.toString()}</Text>
                </View>
            </TouchableHighlight>);
        })}
    </View>
    )

}

const styles = StyleSheet.create({

    variantsBlock: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    variant: {
        // marginHorizontal: 8,
        width: 100,
        display: "flex", alignItems: "center", borderRadius: 10,
        paddingVertical: 10,
        backgroundColor: '#FFFFFFCC'
    },
    variantCorrect: {
        backgroundColor: '#44FF00FF'
    },
    variantIncorrect: {
        backgroundColor: '#FF4400FF'
    },
    variantText: {
        fontSize: 40,
    }
})
