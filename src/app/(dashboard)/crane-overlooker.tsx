import { AcidBaths } from "@/src/pages/AcidBaths";
import AssignedJobs from "@/src/pages/AssignedJobs";
import { InnerProducts } from "@/src/pages/InnerProducts";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { BottomNavigation } from "react-native-paper";

type RouteProps = {
  key: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export default function CraneOverlooker() {
  const [index, setIndex] = useState(0);
  const { user_id } = useLocalSearchParams<{ user_id: string }>();
  const routes: RouteProps[] = [
    { key: "inners", title: "İçeridekiler", icon: "inbox" },
    { key: "assigned_jobs", title: "Atanan Ürünler", icon: "assignment" },
    { key: "acid_baths", title: "Asit Banyoları", icon: "calendar-view-week" },
  ];

  const renderScene = ({ route }: { route: RouteProps }) => {
    switch (route.key) {
      case "assigned_jobs":
        return <AssignedJobs user_id={user_id} />;
      case "acid_baths":
        return <AcidBaths />;
      case "inners":
        return <InnerProducts isAdmin={false} />;
      default:
        return <AssignedJobs />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
}
