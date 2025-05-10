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
