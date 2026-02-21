import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import AddActivityScreen from "./screens/AddActivityScreen";

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
                    headerStyle: {backgroundColor: '#121212'},
                    headerTintColor: '#efefef',
                    headerTitleStyle: {fontWeight: 'bold'},
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddActivity" component={AddActivityScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}