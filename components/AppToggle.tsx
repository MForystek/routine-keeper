import {ActiveTab} from "../App";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Colors} from "../theme/colors";
import {Image} from "expo-image";

const favicon = require("../assets/favicon.png");

interface AppToggleProps {
    activeTab: ActiveTab;
    onToggle: (tab: ActiveTab) => void;
}

export default function AppToggle({activeTab, onToggle}: AppToggleProps) {
    return (
        <View style={styles.wrapper}>
            <Image
                style={styles.icon}
                source={favicon}
                contentFit='cover'
            />
            <View style={styles.track}>
                <TouchableOpacity
                    style={[styles.option, activeTab === 'routines' && styles.optionActive]}
                    onPress={() => onToggle('routines')}
                >
                    <Text style={[styles.label, activeTab === 'routines' && styles.labelActive]}>
                        Routines
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.option, activeTab === 'todos' && styles.optionActive]}
                    onPress={() => onToggle('todos')}
                >
                    <Text style={[styles.label, activeTab === 'todos' && styles.labelActive]}>
                        Todos
                    </Text>
                </TouchableOpacity>
            </View>
            <Image
                style={styles.icon}
                source={favicon}
                contentFit='cover'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        paddingTop: 46,
        paddingBottom: 6,
        alignItems: "center",
    },
    track: {
        flexDirection: 'row',
        backgroundColor: Colors.secondary,
        borderRadius: 8,
        padding: 3,
    },
    option: {
        paddingHorizontal: 28,
        paddingVertical: 7,
        borderRadius: 8,
    },
    optionActive: {
        backgroundColor: Colors.primary,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textMuted,
    },
    labelActive: {
        color: Colors.textPrimary,
    },
    icon: {
        flex: 1,
        width: '100%',
        height: '100%',
        borderRadius: 8,
        paddingVertical: 20,
        marginHorizontal: 4,
    },
});