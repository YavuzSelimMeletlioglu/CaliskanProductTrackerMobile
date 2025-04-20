import { get } from "@/src/api/api";
import { ProductMovements } from "@/src/types/types";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const dateConfig: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

const massConfig: Intl.NumberFormatOptions = {
  style: "unit",
  unit: "kilogram",
  unitDisplay: "narrow",
};

export default function Owner() {
  const [products, setProducts] = useState<ProductMovements[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const router = useRouter();
  const fetchData = async () => {
    const response = await get("/movements");

    if (response && response.success) {
      const modifiedData: ProductMovements[] = response.data.map(
        (item: any) => {
          return {
            ...item,
            last_movement_date: new Date(item.last_movement_date),
            total_incoming: parseInt(item.total_incoming),
            total_outgoing: parseInt(item.total_outgoing),
            remaining_mass: parseInt(item.remaining_mass),
            percentage:
              parseInt(item.total_incoming) <= 0
                ? 0
                : (parseInt(item.remaining_mass) /
                    parseInt(item.total_incoming)) *
                  100,
          };
        }
      );
      setProducts(modifiedData);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    setIsRefreshing(true);
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: ProductMovements }) => {
    return (
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor:
              item.last_movement_type === "incoming" ? "green" : "red",
          },
        ]}>
        <View style={styles.rowContainer}>
          <Text style={styles.itemText}>{item.company_name}</Text>
          <Text style={styles.itemText}>{item.product_name}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text>Toplam Gelen:</Text>
            <Text style={styles.itemText}>
              {item.total_incoming.toLocaleString("tr", massConfig)}
            </Text>
          </View>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <Text>Son Hareket Tarihi:</Text>
            <Text style={styles.itemText}>
              {item.last_movement_date.toLocaleDateString("tr", dateConfig)}
            </Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text>Toplam Giden:</Text>
            <Text style={styles.itemText}>
              {item.total_outgoing.toLocaleString("tr", massConfig)}
            </Text>
          </View>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <Text>% Alınan Çinko:</Text>
            <Text style={styles.itemText}>{item.percentage}%</Text>
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
  };

  const logout = () => {
    router.canDismiss() && router.dismissAll();
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerRight: () => (
            <MaterialIcons
              name="logout"
              size={24}
              color="black"
              onPress={logout}
            />
          ),
        }}
      />
      <FlatList
        data={products}
        renderItem={({ item }) => renderItem({ item })}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.itemText}>Liste Boş</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#ddd",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    rowGap: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  rowContainer: {
    width: "100%",
    alignItems: "center",
    columnGap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
});
