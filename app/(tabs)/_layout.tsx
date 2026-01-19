import "@/src/polyfills";

import { Tabs } from "expo-router";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { NexusProvider } from "@/src/nexus/NexusProvider";
import { WalletConnectModal } from "@walletconnect/modal-react-native";

const projectId = process.env.EXPO_PUBLIC_WC_PROJECT_ID!;

const providerMetadata = {
  name: "Nexus Native Demo",
  description: "Expo + Nexus Core + WalletConnect",
  url: "https://docs.availproject.org",
  icons: ["https://docs.availproject.org/favicon.ico"],
  redirect: {
    native: "nexusdemo://nexus-react-native-demo", // must match your Expo scheme
    universal: "https://docs.availproject.org", // can be your site (optional but required by type in some versions)
  },
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NexusProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
      </Tabs>

      {/* WalletConnect modal must be mounted once */}
      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </NexusProvider>
  );
}
