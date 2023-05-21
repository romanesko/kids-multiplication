import {View, Text, StyleSheet} from "react-native";
import {useEffect, useRef, useState} from "react";

export const Success = ()=>{


  const [render,setRender] = useState(0);
  const size = useRef(1);
  const growing = useRef(true);
  const currentInterval = useRef(null);

  const startAnimation = ()=>{
    if (currentInterval.current!=null){
      return
    }
    currentInterval.current = setInterval(()=>{
     if (growing.current) {
         size.current += 3;
       setRender(size.current);
     } else if (!growing.current){
       size.current -= 3;
       setRender(size.current);
     }
     if (size.current>300){
       growing.current = false;
     } else if (size.current<200){
       growing.current = true;
     }


     },10)
  }

  useEffect(()=>{
    size.current=1;
    startAnimation();
  },[])

  return (<View style={styles.container}>
    <Text style={{...styles.textStyle, fontSize: size.current}}>👍</Text>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {

  }
})