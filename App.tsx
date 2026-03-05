import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import RoutineScreen from "./screens/RoutineScreen";
import AddEditRoutineScreen from "./screens/AddEditRoutineScreen";
import {Colors} from "./theme/colors";
import {Routine} from "./types/routine";
import {GestureHandlerRootView} from "react-native-gesture-handler";

export type RootStackParamList = {
    Routines: undefined;
    AddEditRoutine: {routine?: Routine};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Routines"
                    screenOptions={{
                        headerStyle: {backgroundColor: Colors.background},
                        headerTintColor: Colors.textPrimary,
                        headerTitleStyle: {fontWeight: 'bold'},
                    }}
                >
                    <Stack.Screen name="Routines" component={RoutineScreen} />
                    <Stack.Screen name="AddEditRoutine" component={AddEditRoutineScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}