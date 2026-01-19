import { useWalletConnectModal } from "@walletconnect/modal-react-native";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useNexus } from "@/src/nexus/NexusProvider";

export default function HomeScreen() {
  const { open, provider, isConnected, address } = useWalletConnectModal();
  const { initialize, getUnifiedBalances, sdk, isInitialized } = useNexus();

  const [loading, setLoading] = useState<null | "init" | "balances" | "bridge">(
    null
  );

  const shortAddress = useMemo(() => {
    if (!address) return null;
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }, [address]);

  const onInit = async () => {
    try {
      setLoading("init");

      if (!isConnected) await open();
      if (!provider) throw new Error("Wallet provider missing");

      await initialize(provider);
      Alert.alert("Nexus", "SDK initialized");
    } catch (e: any) {
      Alert.alert("Init failed", e?.message ?? String(e));
    } finally {
      setLoading(null);
    }
  };

  const onBalances = async () => {
    try {
      setLoading("balances");

      if (!isInitialized) {
        Alert.alert("Nexus", "Initialize SDK first");
        return;
      }

      const res = await getUnifiedBalances();
      console.log("Unified balances:", res);
      Alert.alert("Balances", "Logged to console");
    } catch (e: any) {
      Alert.alert("Balances failed", e?.message ?? String(e));
    } finally {
      setLoading(null);
    }
  };

  /*const onBridge = async () => {
    try {
      setLoading("bridge");

      if (!isInitialized) {
        Alert.alert("Nexus", "Initialize SDK first");
        return;
      }

      // Example bridge call — change token/amount/toChainId to your needs
      const result = await sdk.bridge(
        { token: "USDC", amount: 1_000_000n, toChainId: 137 },
        { onEvent: (e: any) => console.log("bridge event:", e.name, e.args) }
      );

      console.log("Bridge result:", result);
      Alert.alert("Bridge", "Submitted (check logs for events)");
    } catch (e: any) {
      Alert.alert("Bridge failed", e?.message ?? String(e));
    } finally {
      setLoading(null);
    }
  };*/

  const initDisabled = loading !== null;
  const balancesDisabled = loading !== null || !isInitialized;
  const bridgeDisabled = loading !== null || !isInitialized;

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        {isConnected && shortAddress
          ? `Connected: ${shortAddress}`
          : "Wallet not connected"}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={onInit}
        disabled={initDisabled}
      >
        <Text style={styles.text}>
          {loading === "init" ? "Initializing..." : "Initialize SDK"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, balancesDisabled && styles.disabled]}
        onPress={onBalances}
        disabled={balancesDisabled}
      >
        <Text style={styles.text}>
          {loading === "balances" ? "Fetching..." : "Unified Balance"}
        </Text>
      </TouchableOpacity>

      {/*<TouchableOpacity
        style={[styles.btn, bridgeDisabled && styles.disabled]}
        onPress={onBridge}
        disabled={bridgeDisabled}
      >
        <Text style={styles.text}>
          {loading === "bridge" ? "Bridging..." : "Bridge"}
        </Text>
      </TouchableOpacity>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  statusText: {
    marginBottom: 20,
    fontSize: 14,
    color: "#111827",
  },
  btn: {
    width: "100%",
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  disabled: {
    backgroundColor: "#9ca3af",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
