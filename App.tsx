import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import AddActivityScreen from "./screens/AddActivityScreen";
import {Colors} from "./theme/colors";

export type RootStackParamList = {
    Home: undefined;
    AddActivity: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
    return (
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
                <Stack.Screen name="AddActivity" component={AddActivityScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}