import { get } from "@/src/api/api";
import { Product } from "@/src/types/types";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const dateConfig: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};

export default function Owner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const router = useRouter();
  const fetchData = async () => {
    const response = await get("/urunler");

    if (response && response.success) {
      const modifiedData = response.data.map((item: Product) => {
        return {
          ...item,
          incoming_date: new Date(item.incoming_date),
          outgoing_date: item.outgoing_date
            ? new Date(item.outgoing_date)
            : null,
        };
      });
      setProducts(modifiedData);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    setIsRefreshing(true);
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Product }) => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.itemText}>{item.company_name}</Text>
          <Text style={styles.itemText}>{item.product_type}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.itemText}>
            {item.incoming_mass.toLocaleString("tr", {
              style: "unit",
              unit: "kilogram",
              unitDisplay: "narrow",
            })}
          </Text>
          <Text style={styles.itemText}>
            {item.incoming_date.toLocaleDateString("tr", dateConfig)}
          </Text>
        </View>
        {item.outgoing_date !== null && (
          <View style={styles.rowContainer}>
            <Text style={styles.itemText}>
              {item.outgoing_mass?.toLocaleString("tr", {
                style: "unit",
                unit: "kilogram",
                unitDisplay: "narrow",
              })}
            </Text>
            <Text style={styles.itemText}>
              {item.outgoing_date.toLocaleDateString("tr", dateConfig)}
            </Text>
          </View>
        )}
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
    alignItems: "center",
    columnGap: 10,
    flexDirection: "row",
  },
  itemText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    width: "48%",
  },
});
