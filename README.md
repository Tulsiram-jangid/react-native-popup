# @tulsiramjangid/react-native-popup

react-native-popup is a lightweight and customizable popup/modal component for React Native applications. It provides a flexible context-based API to trigger informative alerts, confirmations, or action-driven popups globally from anywhere in your app.

## 🎥 Demo

<p align="center">
  <img src="https://github.com/Tulsiram-jangid/react-native-popup/blob/main/docs/ok.gif" height="400" width="200" alt="Popup Demo" />
  <img src="https://github.com/Tulsiram-jangid/react-native-popup/blob/main/docs/ok_horizontal.gif" height="400" width="200" alt="Popup Demo" />
  <img src="https://github.com/Tulsiram-jangid/react-native-popup/blob/main/docs/okcancelVertical.gif" height="400" width="200" alt="Popup Demo" />
</p>

## 🚀 Features

💬 Show popups with custom title and message

📦 Built on Context API — easy global access

🎨 Smooth animations with Reanimated v2

✅ Simple API: showPopup({ title, message })

🧩 Plug-and-play with zero configuration

🛠️ Easily extendable for action buttons, auto-close, etc.



## 📦 Installation

Using **npm**:

```bash
npm install @tulsiramjangid/react-native-popup
```

Using **yarn**:

```bash
yarn add @tulsiramjangid/react-native-popup
```

Using **Peer Dependency (Required):**:

This package uses react-native-reanimated, so be sure to install it as well:

```bash
yarn add react-native-reanimated
```



## How to use this

```bash

import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { PopupProvider , usePopup, ClickAction, PopupAction} from './src/PopupProvider';

const App = () => {
  return (
    <PopupProvider>
      <MainScreen />
    </PopupProvider>
  );
};

const MainScreen = () => {
  const { showPopup } = usePopup();

  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20
    }}>
      <Text>Welcome to the Popup Demo!</Text>
      <Button title="Show Popup" onPress={() => {
        showPopup({
          title: "Hey", 
          message: "how are you!",
          action: PopupAction.OK,
          actionPress:(action)=>{
            if(action === ClickAction.ok){
              Alert.alert("Hey ok is clicked!");
            }
            if(action === ClickAction.cancel){
              Alert.alert("Hey cancel is clicked!");
            }
          }
        });
      }} />
    </View>
  );
};

export default App;


```



