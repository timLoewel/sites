import React from "react";
import { View } from "react-native";

export default function CenterView(props) {
  return (
    <View style={style.main}>
      {props.children}
    </View>
  );
}
const style = {
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  }
};
