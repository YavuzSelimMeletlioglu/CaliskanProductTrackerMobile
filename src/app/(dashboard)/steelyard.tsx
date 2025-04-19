import { get } from "@/src/api/api";
import { InnerProducts, Product } from "@/src/types/types";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

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

export default function Enterer() {
  const [products, setProducts] = useState<InnerProducts[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const router = useRouter();
  const fetchData = async () => {
    const response = await get("/urunler/iceridekiler");

    if (response && response.success) {
      const modifiedData = response.data.map((item: InnerProducts) => {
        return {
          ...item,
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

  const renderItem = ({ item }: { item: InnerProducts }) => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.itemText}>{item.company_name}</Text>
          <Text style={styles.itemText}>{item.product_type}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text>Gelen: </Text>
          <Text style={styles.itemText}>
            {item.remaining_mass.toLocaleString("tr", massConfig)}
          </Text>

          <Text>Son teslimat :</Text>
          <Text style={styles.itemText}>
            {item.outgoing_date !== null
              ? item.outgoing_date.toLocaleDateString("tr", dateConfig)
              : "NULL"}
          </Text>
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
          headerRight: () => <AntDesign name="plus" size={24} color="black" />,
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
