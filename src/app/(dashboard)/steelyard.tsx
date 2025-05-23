import { Stores } from "@/src/pages/Stores";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { BottomNavigation } from "react-native-paper";

type RouteProps = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export default function Steelyard() {
  const [index, setIndex] = useState(0);

  const routes: RouteProps[] = [
    { key: "stores", title: "Hazır", icon: "check-circle-outline" },
  ];

  const renderScene = ({ route }: { route: RouteProps }) => {
    switch (route.key) {
      case "stores":
        return <Stores />;
      default:
        return <Stores />;
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
