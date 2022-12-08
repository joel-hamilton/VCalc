import React from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

import { useHeaderHeight } from "@react-navigation/elements";

import { useTheme } from "../themes";

const createStyles = ({ colors }, headerHeight, statusBarHeight) =>
  StyleSheet.create({
    modalOverlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "transparent",
    },
    modalContent: {
      flex: 1,
      justifyContent: "center",
      position: "absolute",
      top:
        Platform.OS === "ios"
          ? headerHeight + 20
          : headerHeight - statusBarHeight,
      right: 15,
      borderRadius: 5,
      elevation: 3,
      ...(Platform.OS === "ios"
        ? {
            shadowColor: "#000",
            shadowOffset: { width: 5, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }
        : {}),
    },
    itemPressable: ({ pressed }) => ({
      backgroundColor: pressed ? colors.button : colors.buttonPressed,
      flexDirection: "row",
      alignItems: "center",
      height: Platform.OS === 'ios' ? 55 : 50,
      paddingLeft: 15,
    }),
    itemText: {
      width: 150,
      color: colors.text,
      fontSize: 18,
      margin: 5,
    },
  } as { [name: string]: ViewStyle });

const AppMenuModal = ({ visible, data, onClose }) => {
  const theme = useTheme();
  const headerHeight = useHeaderHeight();
  const styles = createStyles(theme, headerHeight, StatusBar.currentHeight);

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: theme.colors.button,
      }}
    >
      <Pressable onPress={item.onPress} style={styles.itemPressable}>
        {!!item.component && item.component}
        <Text
          style={{ ...styles.itemText, 
            marginLeft: !!item.component ? Platform.OS === 'ios' ? 15 : 5 : 0 
          }}
        >
          {item.title}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback testID="modal-overlay" onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View testID="menu" style={styles.modalContent}>
        <FlatList
          style={{
            backgroundColor: theme.colors.card,
          }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </Modal>
  );
};

export default AppMenuModal;
