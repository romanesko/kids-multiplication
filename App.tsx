import {Button, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Cell, Table} from "./components/Table";
import React, {useEffect, useRef, useState} from "react";
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {toastConfig, toastSettings} from "./common/ToastConfig";
import {Success} from "./components/Success";

function randomInt(max) {
  return Math.floor(Math.random() * max);
}



export default function App() {

  const [quest, setQuest] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [level, setLevel] = useState(0);

  const [countOk, setCountOk] = useState(0);
  const [countNok, setCountNok] = useState(0);

  const openedRef = useRef(new Set<Cell>());

  const maxNumber = useRef(0)
  const variantsCountRef = useRef(64)
  const allVariants = useRef(new Set())
  const unopenedVariants = useRef(new Set())

  const start = () =>{
    setLevel(undefined);
    // setLevel(9);
  }

  const setGameLevel = (num:number)=>{
    console.log('setGameLevel',num)
    setCountNok(0)
    setCountOk(0)
    maxNumber.current = num;
    variantsCountRef.current = (num-1)**2
    openedRef.current = new Set<Cell>();

    const variants = new Set();
    for (let x of [...Array(num).keys()].slice(1)) {
        for (let y of [...Array(num).keys()].slice(1)) {
            variants.add(new Cell(x+1, y+1));
        }
    }
    allVariants.current = variants;
    unopenedVariants.current = variants;

    setLevel(num);
    next()
  }


  const test = ()=>{
    openedRef.current = new Set<Cell>()
    for (let x of [3, 4, 5, 6, 7,8,9]) {
      for (let y of [2, 3, 4, 5, 6,7,8,9]) {
        openedRef.current.add(new Cell(x, y));
      }
    }
    openedRef.current.add(new Cell(2, 9));
    openedRef.current.add(new Cell(2, 8));
    openedRef.current.add(new Cell(2, 7));
    openedRef.current.add(new Cell(2, 6));
    openedRef.current.add(new Cell(2, 5));
    openedRef.current.add(new Cell(2, 4));
    next()
  }



  // const quest = new Cell(6,6) as Cell;

  // const getRandomCell = (exclude?:number)=>{
  //   const rnd = new Cell(randomInt(maxNumber.current-1)+2,randomInt(maxNumber.current-1)+2)
  //   if (exclude && rnd.multiply() == exclude){
  //       return getRandomCell(exclude);
  //   }
  //   return rnd;
  // }
  //
  // const getRandomCellNotOpened = (correct:number, exclude: number[])=>{
  //   if(!quest) return getRandomCell().multiply();
  //   if (openedRef.current.size>variantsCountRef.current-4){
  //     console.log('no more')
  //     return getRandomCell(correct).multiply();
  //   }
  //   const cell = getRandomCell(correct);
  //   for (let o of openedRef.current){
  //     if (o.equals(cell) || cell.multiply() == correct || exclude.includes(cell.multiply())){
  //       return getRandomCellNotOpened(correct, exclude);
  //     }
  //   }
  //   return cell.multiply()
  // }



  const getRandomCell = (source):Cell =>{
    return [...source][Math.floor(Math.random()*source.size)] as Cell;
  }

  const setRandomVariants = (correct: number)=>{

    const randomPos = randomInt(3);

    const variants = []
    console.log('-----------------')

    let i =0;

    let source = (unopenedVariants.current.size>3) ? unopenedVariants.current : allVariants.current;

    while(variants.length<3){
      i++;
      if (i>10){
        source = allVariants.current;
      }
      if (i>100){
        console.log('too many attempts')
        break
      }
      const variant = getRandomCell((unopenedVariants.current.size>3)?unopenedVariants.current:allVariants.current);
      if (variant.multiply() == correct) continue;
      if (variants.includes(variant.multiply())) continue;
      variants.push(variant.multiply());
      i=0;
    }
    console.log('variants', variants)
    variants[randomPos] = correct;
    //
    return variants.sort((a,b)=>a-b);
  }

  const next = ()=>{
    const cell = getRandomCell(unopenedVariants.current);

    if(openedRef.current.size >= variantsCountRef.current){
      console.log('next: no more')
      return;
    }

    for (let o of openedRef.current){
      if (o.equals(cell)){
        return next();
      }
    }
    setVariants(setRandomVariants(cell.multiply()));
    setQuest(cell);
  }

  const check = (answer:number)=>{
    if(answer == quest.multiply()){
      openedRef.current.add(quest);
      setTimeout(()=>{
        setCountOk(countOk+1)
      },750)
      Toast.show({...toastSettings,...{type: 'success', text1: '👍'}});
    } else {
      setTimeout(()=>{
        setCountNok(countNok+1)
      },750)
      Toast.show({...toastSettings,...{type: 'error', text1: '😵‍💫'}});
    }
    setSelectedVariant(answer)

    setTimeout(()=>{
      next();
      setSelectedVariant(null)
    },500)

  }

  const onReloadClick = ()=>{
    start()
  }

  useEffect(()=>{
    start()
  },[])

  const variantStyle = (v:Cell)=>{

    if (selectedVariant && v==selectedVariant){
      if (v == quest.multiply()){
        return {backgroundColor: '#44FF0066'}
      }
      return {backgroundColor: '#FF440022'}
    }


    return {backgroundColor: '#00000011'}
  }

  if (!level){
    return <View style={styles.container}>
      <View style={{marginBottom: 40}}>
        <Text style={{textAlign:"center", fontSize:20, marginBottom:20}}>LEVEL:</Text>
        {[4,5,6,7,8,9].map((v,i)=>{
          return (<TouchableHighlight key={i}
                              style={{marginVertical:8, borderRadius:10, backgroundColor:'#ddd', paddingVertical:10, paddingHorizontal:20} }
                              activeOpacity={0.9}
                              underlayColor="#aaaaaa"
                              onPress={() => setGameLevel(v)}>
            <View style={{alignItems:"center"}}>
              <Text style={{fontSize:20}}>{v}x</Text>
              </View>
            </TouchableHighlight>)
        })}
      </View>
    </View>
  }


  if(openedRef.current.size >= variantsCountRef.current) {
    return <View style={styles.container}>
      <Success/>
      <View style={{marginBottom: 40}}>
        <Button title={"start over / начать сначала"} onPress={onReloadClick}></Button>
      </View>
    </View>
  }

  return (
    <View style={styles.container}>

      {countOk+countNok>0 ?
      <View style={styles.score}>
        <Text style={{color:'#21b000', marginBottom:5}}>👍 x{countOk}</Text>
        <Text style={{color:'#ff0000aa'}}>😵‍💫 x{countNok}</Text>
      </View> : <></>}

      <View style={{}}>
      <Table opened={openedRef.current} quest={quest} maxNumber={level} />
      </View>
      <View style={{}}>
      <View style={styles.variantsBlock}>
        {variants.map((v,i)=>{
          return (<TouchableHighlight key={i}
              style={{...styles.variant, ...variantStyle(v)} }
              activeOpacity={0.9}
              underlayColor="#aaaaaa"
              onPress={() => check(v)}>
            <View  >
              <Text style={styles.variantText} key={i}>{v.toString()}</Text>
            </View>
          </TouchableHighlight>);
        })}
      </View>
      </View>
      <Toast config={toastConfig}/>
      {/*<Button title={"Test"} onPress={test}></Button>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantsBlock:{
    flexDirection:'row',
    marginVertical:20,
  },
  variant:{
    marginHorizontal:4, width:80, display:"flex", alignItems:"center", borderRadius:10,
    paddingVertical:10,
  },
  variantText:{
    fontSize:40,
  },
  score:{
    opacity:1,
    position:"absolute",
    top:60
  }
});
