import {StyleSheet, Text, View} from "react-native";
import {Colors} from "../theme/colors";

export default function RoutinesEmptyState() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>No routines yet</Text>
            <Text style={styles.subtitle}>Start building your habits.{'\n'}Tap the + button to add your first routine.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 80,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.textMuted,
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
});