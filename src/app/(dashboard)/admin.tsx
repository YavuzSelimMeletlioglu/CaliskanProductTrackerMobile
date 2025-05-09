import { AcidBaths } from "@/src/pages/AcidBaths";
import AssignedJobs from "@/src/pages/AssignedJobs";
import { InnerProducts } from "@/src/pages/InnerProducts";
import { Processes } from "@/src/pages/Processes";
import { Stores } from "@/src/pages/Stores";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import Performance from "@/src/pages/Performance";

type RouteProps = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export default function Admin() {
  const [index, setIndex] = useState(0);

  const routes: RouteProps[] = [
    { key: "inners", title: "İçeridekiler", icon: "inbox" },
    { key: "performance", title: "Performans", icon: "access-time" },
    { key: "process", title: "İşlem dekiler", icon: "autorenew" },
    { key: "acid_baths", title: "Asit Banyoları", icon: "calendar-view-week" },
    { key: "stores", title: "Hazır", icon: "check-circle-outline" },
  ];

  const renderScene = ({ route }: { route: RouteProps }) => {
    switch (route.key) {
      case "process":
        return <Processes />;
      case "acid_baths":
        return <AcidBaths />;
      case "inners":
        return <InnerProducts isAdmin={true} />;
      case "stores":
        return <Stores />;
      case "performance":
        return <Performance />;
      default:
        return <AssignedJobs />;
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
