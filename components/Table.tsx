import {StyleSheet, Text, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";


interface ITableProps {
  maxNumber: number
  opened: Set<Cell>
  quest: Cell
}

export class Cell {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public multiply(): number {
    return this.x * this.y;
  }

  public equals(other: Cell) {
    return this.x == other.x && this.y == other.y;
  };

  public toString(){
    return this.x+'*'+this.y
  }
}


export const Table = (props: ITableProps) => {


  const [nums,setNums] = useState([])

  useEffect(()=>{
    setNums([...Array(props.maxNumber+1).keys()].slice(1))
  },[props.maxNumber])


  const renderCell = (cell: Cell) => {

    let showNum = false;

    let extraStyle = {};
    let textStyle = {}

    if (props.opened.has(cell)) {
      showNum = true;
    }

    if (props.quest!=null){

      if (props.quest.x == cell.x || props.quest.y == cell.y) {
        extraStyle = {backgroundColor: '#ff990544'}
      }

      if (props.quest.equals(cell)) {
        extraStyle = {backgroundColor: '#ff9905dd'}
      }
    }

    const header = (cell.x == 1 || cell.y == 1);

    if (header) {
      showNum = true;
      if (cell.x == 1 && cell.y == 1) {
        textStyle = {opacity: 0}
      } else {
        textStyle = {fontWeight: 'bold'}
      }
    }


    for (let openedKey of props.opened) {
      if (cell.equals(openedKey)) {
        if (!cell.equals(props.quest)) {
          textStyle = {opacity: 0.5}
        }
        showNum = true;
      }
    }

    return (
        <View style={{...styles.cell, ...extraStyle}} key={cell.toString()}>
          {(showNum) ?
              <Text style={{...styles.cellText, ...textStyle}}>{cell.multiply()}</Text>
              :
              <Text></Text>}
        </View>
    )
  }

  const renderRow = (x: number) => {
    return (
        <View style={{flexDirection: "row"}} key={x+'*'+'y'}>
          {nums.map((y) => renderCell(new Cell(x, y)))}
        </View>
    )
  }

  return (
      <View style={styles.table}>
        {nums.map((y) => renderRow(y))}
      </View>
  )
}

const styles = StyleSheet.create({
  table:{
    borderColor: 'black',
    borderRightWidth: 1,
    borderBottomWidth:1
  },
  cell: {
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRightWidth: 0,
    borderBottomWidth:0
  },
  cellText: {
    fontSize: 20
  }
});
