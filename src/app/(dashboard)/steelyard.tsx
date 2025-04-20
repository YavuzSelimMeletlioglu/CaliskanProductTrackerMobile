import { get } from "@/src/api/api";
import { InnerProducts, Product } from "@/src/types/types";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Pressable,
} from "react-native";
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
    const response = await get("/products/inners");

    if (response && response.success) {
      const modifiedData: InnerProducts[] = response.data.map((item: any) => {
        return {
          ...item,
          total_incoming: parseFloat(item.total_incoming),
          total_outgoing: parseFloat(item.total_outgoing),
          remaining_mass: parseFloat(item.remaining_mass),
          last_movement: item.last_movement
            ? new Date(item.last_movement)
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
      <Pressable
        style={[
          styles.contentContainer,
          {
            backgroundColor:
              item.last_movement_type === "incoming" ? "green" : "red",
          },
        ]}
        onPress={() =>
          router.push({
            pathname: "/operations/add-product",
            params: {
              company_id: item.company_id,
              product_id: item.product_id,
            },
          })
        }>
        <View style={styles.rowContainer}>
          <Text style={styles.itemText}>{item.company_name}</Text>
          <Text style={styles.itemText}>{item.product_name}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text>Kalan: </Text>
            <Text style={styles.itemText}>
              {item.remaining_mass.toLocaleString("tr", massConfig)}
            </Text>
          </View>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <Text>Son teslimat Tarihi:</Text>
            <Text style={styles.itemText}>
              {item.last_movement !== null
                ? item.last_movement.toLocaleDateString("tr", dateConfig)
                : "NULL"}
            </Text>
          </View>
        </View>
      </Pressable>
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
            <AntDesign
              name="plus"
              size={24}
              color="black"
              onPress={() => router.push("/operations/add-product")}
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
