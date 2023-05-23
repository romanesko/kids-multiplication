import {
    Button,
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import {Table} from "./components/Table";
import {Score} from "./components/Score";
import React, {useEffect, useRef, useState} from "react";
import Toast from 'react-native-toast-message';
import {toastConfig, toastSettings} from "./common/ToastConfig";
import {Success} from "./components/Success";
import {LevelSelect} from "./components/LevelSelect";
import {GameService} from "./services/GamseService";
import {Variants} from "./components/Variants";
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';

function cacheImages(images) {
    return images.map(image => {
        if (typeof image === 'string') {
            return Image.prefetch(image);
        } else {
            return Asset.fromModule(image).downloadAsync();
        }
    });
}
SplashScreen.preventAutoHideAsync();

export default function App() {

    const gameRef = useRef(new GameService());
    const game = gameRef.current;
    const [render, setRender] = useState(0);

    const showSelectLevel = () => {
        game.stop()
        setRender(Math.random())
    }

    const handleLevelClick = (num: number) => {
        game.startNewGame(num)
        next()
    }

    const next = () => {
        game.getNextQuestion()
        setRender(Math.random())
    }

    const check = (answer: number) => {
        if (game.checkAnswer(answer)) {
            Toast.show({...toastSettings, ...{type: 'success', text1: '👍'}});
        } else {
            Toast.show({...toastSettings, ...{type: 'error', text1: ':('}});
        }
        setTimeout(next, 500)
    }

    const onReloadClick = () => {
        showSelectLevel()
    }
    useEffect(() => {
        showSelectLevel()
    }, [])


    const [appIsReady, setAppIsReady] = useState(false);

    // Load any resources or data that you need prior to rendering the app
    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                const imageAssets = cacheImages([
                    require('./assets/splash.png'),
                    require('./assets/back.png'),
                ]);

                await Promise.all([...imageAssets]);
            } catch (e) {
                // You might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setAppIsReady(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    if (!appIsReady) {
        return null;
    }

    if (game.gameStarted && game.opened.size >= game.variantsCount) {
        return <View style={styles.container}>
            <Success/>
            <View style={{marginBottom: 40}}>
                <Button title={"start over / начать сначала"} onPress={onReloadClick}></Button>
            </View>
        </View>
    }


    const mainRender = () => {
        if (!game.gameStarted) {
            return (
                <ImageBackground source={require('./assets/splash.png')} style={styles.image}>


                    <LevelSelect onSelect={handleLevelClick}/>
                </ImageBackground>
                )
        }
        return (
            <ImageBackground source={require('./assets/back.png')} style={styles.image}>
            <View style={styles.container}>
                <View style={{...styles.block, minHeight: 60}}>
                    <Score counters={game.counters}/>
                </View>
                <View style={styles.block}>
                    <Table opened={game.opened} quest={game.currentQuestion} maxNumber={game.maxNumber}/>
                </View>
                <View style={styles.block}>
                    <Variants variants={game.proposedVariants} lastAnswerState={game.lastAnswerState} onClick={check}/>
                </View>
                <Toast config={toastConfig}/>
            </View>
            </ImageBackground>

        );
    }
    let ScreenHeight = Dimensions.get("window").height;
    return (
        <ScrollView scrollEnabled={false} style={styles.containerWrapper}>
            <View style={{height:ScreenHeight}}>

                    {mainRender()}

            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    containerWrapper: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#15131B',
    },
    block: {
        width:100+'%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        marginTop: Platform.OS === 'ios' ? 40 : 20,
        marginBottom: Platform.OS === 'ios' ? 60 : 40,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    score: {
        paddingTop: 40,
        flexDirection: 'row',
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',

    },
});
