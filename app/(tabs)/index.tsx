import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* TouchableOpacity for custom styling */}
      <TouchableOpacity
        style={styles.customButton}
        //onPress={() => alert("Custom Pressed!")}
      >
        <Text style={styles.buttonText}>Initialize SDK</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        //onPress={() => alert("Custom Pressed!")}
      >
        <Text style={styles.buttonText}>Unified Balance</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.customButton}
        //onPress={() => alert("Custom Pressed!")}
      >
        <Text style={styles.buttonText}>Bridge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  customButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
