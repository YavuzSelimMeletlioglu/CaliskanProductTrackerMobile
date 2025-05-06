import { IncomingGraphsScreen } from "@/src/pages/TotalIncomings";
import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { OutgoingGraphsScreen } from "@/src/pages/TotalOutgoings";
import { NetGraph } from "@/src/pages/NetGraph";

type RouteProps = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export default function Owner() {
  const [index, setIndex] = useState(0);

  const routes: RouteProps[] = [
    { key: "all", title: "Tüm Gelenler", icon: "login" },
    { key: "outgoings", title: "Tüm Gidenler", icon: "outbox" },
    { key: "net", title: "Net", icon: "align-vertical-bottom" },
  ];

  const renderScene = ({ route }: { route: RouteProps }) => {
    switch (route.key) {
      case "all":
        return <IncomingGraphsScreen />;
      case "outgoings":
        return <OutgoingGraphsScreen />;
      case "net":
        return <NetGraph />;
      default:
        return <IncomingGraphsScreen />;
    }
  };

  return (
    <>
      {renderScene({ route: routes[index] })}
      <BottomNavigation.Bar
        navigationState={{ index, routes }}
        onTabPress={({ route }) => {
          const newIndex = routes.findIndex((r) => r.key === route.key);
          if (newIndex !== -1) {
            setIndex(newIndex);
          }
        }}
        renderIcon={({ route, color }) => (
          <MaterialIcons name={route.icon} size={24} color={color} />
        )}
        getLabelText={({ route }) => route.title}
      />
    </>
  );
}
