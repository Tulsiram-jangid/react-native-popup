import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Modal, StyleSheet, View, Text, Button, Alert, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  interpolateColor
} from 'react-native-reanimated';


const colors = {
  border: 'rgba(0,0,0,0.1)'
} 

export enum PopupAction {
  OK,
  QUERY_WITH_OK,
  QUERY_WITH_OK_CANCEL_HORIZONTAL,
  QUERY_WITH_OK_CANCEL_VERTICAL
}

export enum ClickAction {
  ok = "ok",
  cancel = "cancel"
}

interface PopupTypes {
  title: string;
  message: string;
  actionPress?: (action: ClickAction)=> void;
  action?: PopupAction
}

interface PopupProviderProps {
  children: ReactNode
}

interface PopupContextType {
  showPopup: ({ title, message }: PopupTypes) => void;
  closePopup: ()=> void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [data, setData] = useState({
    title: '',
    message: '',
    show: false,
    action: PopupAction.QUERY_WITH_OK
  });
  const actionPressRef  = useRef<Function>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const idleTime = 300;

  const showPopup = useCallback(({ 
    title, 
    message, 
    actionPress,
    action = PopupAction.QUERY_WITH_OK
   }: PopupTypes) => {
    setData({
      ...data,
      title,
      message,
      show: true,
      action
    });
    actionPressRef.current = actionPress as Function;
    setModalVisible(true);
  }, []);

  const closePopup = useCallback(() => {
    setData((prev: any) => ({
      ...prev,
      show: false,
    }));
    setTimeout(() => setModalVisible(false), idleTime);
  }, [data,modalVisible]);

const onAction = useCallback((action: ClickAction) => {
  const delay = idleTime ?? 1000;
  setTimeout(() => {
    actionPressRef.current?.(action);
  }, delay);
}, [actionPressRef, idleTime]);

  return (
    <PopupContext.Provider value={{ showPopup,closePopup }}>
      {children}
      <PopupModel
        action={data.action}
        visible={data.show}
        modalVisible={modalVisible}
        title={data.title}
        message={data.message}
        onClose={closePopup}
        actionPress={onAction}
      />
    </PopupContext.Provider>
  );
};

const PopupModel = ({
  action,
  visible,
  modalVisible,
  title,
  message,
  onClose,
  actionPress
}: {
  action: PopupAction
  visible: boolean;
  modalVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  actionPress: (action : ClickAction)=> void
}) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animation.value, [0, 1], [0.8, 1], Extrapolation.CLAMP);
    const opacity = interpolate(animation.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    return {
      transform: [{ scale }],
      //opacity,
    };
  });

 const containerStyle = useAnimatedStyle(() => {
  const backgroundColor = interpolateColor(
    animation.value,
    [0, 1],
    ['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']
  );
  return {
    backgroundColor,
  };
});

const onOk=useCallback(()=>{
  onClose && onClose();
  actionPress && actionPress(ClickAction.ok);
},[actionPress,onClose]);

const onCancel=useCallback(()=>{
  onClose && onClose();
  actionPress && actionPress(ClickAction.cancel);
},[actionPress,onClose]);

const renderFooter = useMemo(()=>{
  if(
    action === PopupAction.OK ||
    action === PopupAction.QUERY_WITH_OK
  ){
    return (
      <View>
        <Divider/>
        <ActionButton title="Ok" onPress={onOk} />
      </View>
    );
  }
  if(action === PopupAction.QUERY_WITH_OK_CANCEL_HORIZONTAL){
    return (
      <View>
        <Divider/>
        <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <ActionButton width="50%" title="Close" isDismissible onPress={onCancel} />
        <View style={{height: "100%", width: 1,backgroundColor: colors.border}}/>
        <ActionButton width="50%" title="OK" onPress={onOk} />
      </View>
      </View>
    );
  }
  if(action === PopupAction.QUERY_WITH_OK_CANCEL_VERTICAL){
    return (
      <View>
        <Divider/>
        <ActionButton title="Close" isDismissible onPress={onCancel} />
        <Divider/>
        <ActionButton  title="OK" onPress={onOk} />
      </View>
    );
  }
  return null;
},[action])

  if (!modalVisible) return null;

  return (
    <Modal transparent visible animationType="none">
      <Animated.View style={[styles.container,containerStyle]}>
        <Animated.View style={[styles.popup, animatedStyle]}>
          <View style={{padding: 20}}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
          </View>
          {renderFooter}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};


interface ActionButtonProps {
  title:string;
  onPress: Function;
  isDismissible?: boolean;
  width?: any
}

const ActionButton=({
  title,
  onPress,
  isDismissible,
  width
}:ActionButtonProps)=>{
  return (
    <TouchableOpacity activeOpacity={.8} onPress={onPress as any}
    style={{
      width,
      alignItems: 'center',
      height: 45,
      justifyContent: 'center'
    }}
    >
      <Text style={styles.buttonText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}


interface FooterContainerProps {
 children: ReactNode
} 


const Divider=()=>{
  return (
    <View
    style={{
      width: "100%",
      height: 1,
      backgroundColor: colors.border
    }}
    />
  )
}

const FooterContainer=({
children
}:FooterContainerProps)=>{
  return (
    <View style={{
      justifyContent: 'center', alignItems: 'center',
      width: "100%",
      borderWidth: 1,
      borderColor: colors.border,
      height: 45
    }}>
      {children}
    </View>
  )
}

export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: "#000"
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: "#000"
  },
  buttonText:{
    fontSize: 14,
    color: "#000",
    textTransform: 'none'
  }
});
