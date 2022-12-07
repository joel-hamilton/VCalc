import React from "react";
import {
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { setSyntheticLeadingComments } from "typescript";

import { useTheme } from "../themes";
import { IVariable } from "../types";

const createStyles = ({ colors }) =>
  StyleSheet.create({
    modalOverlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "transparent",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      backgroundColor: colors.button,
      borderRadius: 10,
      padding: 20,
      elevation: 5,
    },
    title: {
      fontSize: 24,
      marginBottom: 15,
      color: colors.text,
    },
    textInput: {
      color: colors.text,
      backgroundColor: colors.card,
      padding: 10,
      borderColor: colors.border,
      marginBottom: 15,
      borderWidth: 1,
      borderRadius: 3,
    },
    button: {
      padding: 10,
      borderRadius: 3,
    },
    buttonCancel: {
      backgroundColor: colors.buttonPressed,
      marginRight: 100,
    },
    buttonSave: {
      backgroundColor: colors.buttonHighlightPressed,
      marginLeft: 25,
    },
  } as { [name: string]: ViewStyle });

const EditVariableModal = ({
  variable,
  onUpdate,
  onDelete,
  onClose,
}: {
  variable: IVariable;
  onDelete: () => void;
  onUpdate: (IVariable) => void;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [tempVariable, setTempVariable] = React.useState<IVariable | undefined>(
    variable
  );

  React.useEffect(() => {
    setTempVariable(variable);
  }, [variable]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={!!tempVariable}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      {!!tempVariable && (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.title}>Edit Variable</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              placeholder="variable_name"
              placeholderTextColor={theme.colors.secondaryText}
              style={styles.textInput}
              value={tempVariable.varName}
              selectTextOnFocus={true}
              onChangeText={(varName) =>
                setTempVariable({
                  ...tempVariable,
                  varName: varName.replace(/\s/g, "_"),
                })
              }
            ></TextInput>
            <TextInput
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              placeholder="value"
              placeholderTextColor={theme.colors.secondaryText}
              style={styles.textInput}
              value={tempVariable.value}
              onChangeText={(value) =>
                setTempVariable({ ...tempVariable, value })
              }
            ></TextInput>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Pressable
                style={{ ...styles.button, ...styles.buttonCancel }}
                onPress={onClose}
              >
                <Text style={{ color: theme.colors.text }}>Cancel</Text>
              </Pressable>
              <Pressable>
                <Text
                  style={{ color: theme.colors.danger }}
                  onPress={() => {
                    onDelete();
                    onClose();
                  }}
                >
                  Delete
                </Text>
              </Pressable>
              <Pressable
                style={{ ...styles.button, ...styles.buttonSave }}
                onPress={() => {
                  if (!tempVariable.varName) {
                    return Alert.alert(
                      "Error",
                      "Variable name cannot be empty"
                    );
                  } else if (tempVariable.value === "") {
                    return Alert.alert("Error", "Value cannot be empty");
                  }

                  onUpdate(tempVariable);
                  onClose();
                }}
              >
                <Text style={{ color: theme.colors.text }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );
};

export default EditVariableModal;
