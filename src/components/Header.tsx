import React from 'react';
import {
    Linking, Platform, Pressable, StatusBar, StyleSheet, Switch, Text, View, ViewStyle
} from 'react-native';
import { DEV_EMAIL } from 'react-native-dotenv';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getHeaderTitle } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

import { Context } from '../Context';
import { useTheme } from '../themes';
import AppMenuModal from './AppMenuModal';

const createStyles = ({ colors }, statusBarHeight) =>
  StyleSheet.create({
    main: {
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "ios" ? 0 : statusBarHeight,
      paddingLeft: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    menuIcon: ({ pressed }) => ({
      padding: 10,
      borderRadius: 50,
      border: colors.border,
      backgroundColor: pressed ? colors.button : "transparent",
    }),
  } as { [name: string]: ViewStyle });

const Header = ({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) => {
  const [appMenuVisible, setAppMenuVisible] = React.useState(false);
  const [context, setContext] = React.useContext(Context);

  const theme = useTheme();
  const styles = createStyles(theme, StatusBar.currentHeight);
  const title = getHeaderTitle(options, route.name);

  const appMenuData = [
    {
      id: "theme",
      title: "Dark Theme",
      component: (
        <Switch
          disabled={true}
          trackColor={{
            false: theme.colors.border,
            true: theme.colors.buttonHighlight,
          }}
          thumbColor={
            !!context.useDarkTheme
              ? theme.colors.primary
              : theme.colors.secondaryText
          }
          value={!!context.useDarkTheme}
        />
      ),
      onPress: () => {
        setContext({ useDarkTheme: !context.useDarkTheme });
      },
    },
    {
      id: "contact",
      title: "Send Feedback",
      onPress: () => {
        setAppMenuVisible(false);
        Linking.openURL(
          `mailto:${DEV_EMAIL}?subject=${encodeURIComponent(
            "VCalc Feedback"
          )}&body=${encodeURIComponent(
            `Platform: ${Platform.OS}\nVersion: ${Platform.Version}`
          )}`
        );
      },
    },
  ];

  return (
    <View style={styles.main}>
      <Text style={styles.title}>{title}</Text>
      <Pressable
        testID="menu-toggle"
        hitSlop={10}
        onPress={() => setAppMenuVisible(!appMenuVisible)}
        style={styles.menuIcon}
      >
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={theme.colors.text}
        />
      </Pressable>
      <AppMenuModal
        data={appMenuData}
        visible={appMenuVisible}
        onClose={() => setAppMenuVisible(false)}
      />
    </View>
  );
};
export default Header;
