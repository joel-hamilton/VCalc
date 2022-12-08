import React from 'react';
import {
    FlatList, Modal, Pressable, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View,
    ViewStyle
} from 'react-native';

import { useHeaderHeight } from '@react-navigation/elements';

import { useTheme } from '../themes';

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
      top: headerHeight - statusBarHeight,
      right: 5,
      borderRadius: 5,
      elevation: 3,
    },
    itemPressable: ({ pressed }) => ({
      backgroundColor: pressed ? colors.button : colors.buttonPressed,
      flexDirection: "row",
      alignItems: "center",
    }),
    itemText: {
      width: 150,
      alignItems: "center",
      paddingLeft: 15,
      paddingTop: 10,
      paddingBottom: 10,
      color: colors.text,
      fontSize: 18,
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
        <Text style={styles.itemText}>{item.title}</Text>
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
