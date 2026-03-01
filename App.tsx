import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import {HomeScreen} from "./screens/HomeScreen";
import AddEditActivityScreen from "./screens/AddEditActivityScreen";
import {Colors} from "./theme/colors";
import {Activity} from "./types/activity";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export type RootStackParamList = {
    Home: undefined;
    AddEditActivity: {activity?: Activity};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: {backgroundColor: Colors.background},
                        headerTintColor: Colors.textPrimary,
                        headerTitleStyle: {fontWeight: 'bold'},
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="AddEditActivity" component={AddEditActivityScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}