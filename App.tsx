import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import RoutineScreen from "./screens/RoutineScreen";
import AddEditRoutineScreen from "./screens/AddEditRoutineScreen";
import {Colors} from "./theme/colors";
import {Routine} from "./types/routine";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Todo} from "./types/todo";
import {useState} from "react";
import {View} from "react-native";
import AppToggle from "./components/AppToggle";
import TodoScreen from "./screens/TodoScreen";
import AddEditTodoScreen from "./screens/AddEditTodoScreen";

export type ActiveTab = 'routines' | 'todos';

export type RootStackParamList = {
    Main: undefined,
    AddEditRoutine: {routine?: Routine};
    AddEditTodo: {todo? : Todo};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainScreen() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("routines");

    return (
        <View style={{flex: 1, backgroundColor: Colors.background}}>
            <AppToggle
                activeTab={activeTab}
                onToggle={setActiveTab}
            />
            {activeTab === 'routines' ? <RoutineScreen /> : <TodoScreen />}
        </View>
    );
}

export default function App() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {backgroundColor: Colors.background},
                        headerTintColor: Colors.textPrimary,
                        headerTitleStyle: {fontWeight: 'bold'},
                    }}
                >
                    <Stack.Screen
                        name="Main"
                        component={MainScreen}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen name="AddEditRoutine" component={AddEditRoutineScreen} />
                    <Stack.Screen name="AddEditTodo" component={AddEditTodoScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}