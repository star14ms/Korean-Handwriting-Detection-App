import React, { useRef, useState } from 'react';
import { Platform, Animated, StyleSheet, StatusBar, TouchableOpacity, useColorScheme } from 'react-native';
import { Canvas, CanvasRef, DrawingTool } from '@benjeau/react-native-draw';
import {
  BrushProperties,
  CanvasControls,
  DEFAULT_COLORS,
} from '@benjeau/react-native-draw-extras';
import { useTheme } from '@react-navigation/native';


import { View, Text } from '../components/Themed';
import axios from 'axios'
import { Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Sounds from '../sound'


const sounds = new Sounds();


export default () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const canvasRef = useRef<CanvasRef>(null);
  const [color, setColor] = useState('#FFFFFF'); // DEFAULT_COLORS[0][0][0]
  const [thickness, setThickness] = useState(10);
  const [opacity, setOpacity] = useState(1);
  const [tool, setTool] = useState(DrawingTool.Brush);
  const [visibleBrushProperties, setVisibleBrushProperties] = useState(false);
  
  const [text, setText] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const chartWidth = Dimensions.get('window').width;
  const containerBorderWidth = 20
  const canvasBorderWidth = 5
  const border_width = containerBorderWidth*2 + canvasBorderWidth*2
  const canvasWidth = chartWidth - border_width
  const container_border = { borderWidth: containerBorderWidth,
    borderColor: colorScheme === 'dark' ? 'black': 'white',
    backgroundColor: colorScheme === 'dark' ? 'black' : 'white',}
  const canvas_border = { borderWidth: canvasBorderWidth,
    borderColor: colorScheme === 'dark' ? 'white': 'black',
    backgroundColor: colorScheme === 'dark' ? 'white' : 'black',}


  const handleUndo = () => {
    canvasRef.current?.undo();
  };
  
  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const handleToggleEraser = () => {
    setTool((prev) =>
      prev === DrawingTool.Brush ? DrawingTool.Eraser : DrawingTool.Brush
    );
  };

  const [overlayOpacity] = useState(new Animated.Value(0));
  const handleToggleBrushProperties = () => {
    if (!visibleBrushProperties) {
      setVisibleBrushProperties(true);

      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setVisibleBrushProperties(false);
      });
    }
  };

  const handleDetect = async () => {
    sounds.play('detecting')
    const svg: any = canvasRef.current?.getSvg()
    const isBlank = svg === 
    '<svg xmlns="http://www.w3.org/2000/svg" width="325" height="325" viewBox="0 0 325 325"></svg>'
    
    if (isBlank) {
      setText(text => text + ' ')
      return
    }
    
    setIsDetecting(true)
    const dataURL = "data:image/svg+xml," + encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')
    await axios.post('http://192.168.35.73:5000/detect', dataURL, {
        headers: { 
            'Content-Type': 'text/xml'
            // 'Content-Type': 'multipart/form-data'
        }
    })
    .then(
        (result) => {
            setText(text => text + result.data.answer.trim())
        },
        (error) => {
            alert('손글씨 인식 서버가 닫힌 듯 하다.')
        }
    )
    setIsDetecting(false)
  }

  const handleBackspace = () => {
    setText((prev) => prev.slice(0, -1))
  }

  const copyToClipboard = () => {
    Clipboard.setString(text);
    alert(`${text}\n복사 완료!`)
  }

  return (
    <View style={[styles.container, container_border]}
    >
      <View style={[styles.canvasSide, canvas_border, styles_.radius]}>
        <Canvas
          ref={canvasRef}
          height={canvasWidth} // border_size
          width={canvasWidth}
          color={color}
          thickness={thickness}
          opacity={opacity}
          tool={tool}
          style={{
            backgroundColor: 'black',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
            borderRadius: 10,
          }}
        />
      </View>

      <View style={[styles.controlSide, visibleBrushProperties && Platform.OS === 'android' ? { flex: 1 } : {}]}>
        <CanvasControls
          onUndo={handleUndo}
          onClear={handleClear}
          onToggleEraser={handleToggleEraser}
          onToggleBrushProperties={handleToggleBrushProperties}
          tool={tool}
          color={color}
          opacity={opacity}
          thickness={thickness}
        />
        {visibleBrushProperties && (
          <BrushProperties
            color={color}
            thickness={thickness}
            opacity={opacity}
            onColorChange={setColor}
            onThicknessChange={setThickness}
            onOpacityChange={setOpacity}
            sliderColor={theme.colors.text}
            //@ts-ignore
            style={[{
              position: 'absolute',
              left: -containerBorderWidth,
              right: 0,
              padding: 10,
              width: chartWidth,
              backgroundColor: theme.colors.background,
              borderTopEndRadius: 10,
              borderTopStartRadius: 10,
              borderWidth: StyleSheet.hairlineWidth,
              borderBottomWidth: 0,
              borderTopColor: '#ccc',
              opacity: overlayOpacity,
            },
            Platform.OS === 'android' ? { top: 80 } : { bottom: 80 }
          ]}
          />
        )}
      </View>

      {(!visibleBrushProperties || Platform.OS === 'ios') && (
      <View style={styles.buttonSide}>
        <StatusBar barStyle="dark-content" />

        <TouchableOpacity
          disabled={text.length === 0}
          style={[styles_.button, styles_.radius, text.length === 0 ? styles_.bg_pink : styles_.bg_green]}
          onPress={handleBackspace}
        >
          <Text darkColor="black" style={styles_.text32}>지우기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isDetecting}
          style={[styles_.button, styles_.radius, isDetecting ? styles_.bg_pink : styles_.bg_green]}
          onPress={handleDetect}
        >
          <Text darkColor="black" style={styles_.text32}>완료</Text>
        </TouchableOpacity>
      </View>
      )}
      {(!visibleBrushProperties || Platform.OS === 'ios') && (
      <View style={styles.outputSide}>
        <View darkColor="black" style={styles.output}>
          <Text darkColor="white" style={styles_.text32}>{text}</Text>
        </View>

        <TouchableOpacity
          style={[styles_.button, styles_.bg_blue, styles.button_clear]}
          onPress={copyToClipboard}
        >
          <Text darkColor="black" style={styles_.text24}>복사</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 12,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  canvasSide: {
  },
  controlSide: {
  },
  buttonSide: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  outputSide: {
    flex: 2,
    flexDirection: "row",
    marginTop: '5%',
  },
  output: {
    flex: 8,
    justifyContent: 'center',
    marginLeft: '5%',
  },
  button_clear: {
    flex: 2,
  },
});


const styles_ = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: '5%',
    width: '45%',
    backgroundColor: 'lightgreen',
  },
  radius: {
    borderRadius: 10,
  },
  bg_green: {
    backgroundColor: 'lightgreen',
  },
  bg_blue: {
    backgroundColor: 'lightblue',
  },
  bg_pink: {
    backgroundColor: 'pink',
  },
  text32: {
    fontSize: 32,
  },
  text24: {
    fontSize: 24,
  },
})