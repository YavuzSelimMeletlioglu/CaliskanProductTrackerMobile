import { AcidBaths } from "@/src/pages/AcidBaths";
import AssignedJobs from "@/src/pages/AssignedJobs";
import { InnerProducts } from "@/src/pages/InnerProducts";
import { Processes } from "@/src/pages/Processes";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { BottomNavigation } from "react-native-paper";

type RouteProps = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export default function CleaningOverlooker() {
  const [index, setIndex] = useState(0);

  const routes: RouteProps[] = [
    { key: "process", title: "İşlemdekiler", icon: "autorenew" },
  ];

  const renderScene = ({ route }: { route: RouteProps }) => {
    switch (route.key) {
      case "process":
        return <Processes />;
      default:
        return <Processes />;
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
