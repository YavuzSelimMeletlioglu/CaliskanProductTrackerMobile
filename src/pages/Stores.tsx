import { get } from "@/src/api/api";
import { Store } from "@/src/types/types";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Appbar } from "react-native-paper";
import { dateConfig, logout, massConfig } from "../functions";
import { AddMovement } from "../modals/AddMovement";

export function Stores() {
  const [products, setProducts] = useState<Store[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [outgoingModalVisible, setOutgoingModalVisible] = useState(false);
  const [incomingModalVisible, setIncomingModalVisible] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const fetchData = async () => {
    const response = await get("operations/stores");

    if (response && response.success) {
      setProducts(response.data);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    setIsRefreshing(true);
    fetchData();
  }, []);

  const renderItem = ({ item }: { item: Store }) => {
    return (
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => {
          setSelectedCompanyId(item.company_id);
          setSelectedProductId(item.product_id);
          console.log(item.company_id, " ", selectedCompanyId);
          setOutgoingModalVisible(true);
        }}>
        <AddMovement
          visible={outgoingModalVisible}
          onDismiss={() => setOutgoingModalVisible(false)}
          movementType="outgoing"
          company_id={selectedCompanyId || 0}
          product_id={selectedProductId || 0}
        />
        <View style={styles.rowContainer}>
          <Text style={styles.itemText}>{item.company_name}</Text>
          <Text style={styles.itemText}>{item.product_name}</Text>
        </View>
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <Text>Adet: </Text>
            <Text style={styles.itemText}>{item.quantity} adet</Text>
          </View>
          <View style={{ flex: 1, maxWidth: "50%" }}>
            <Text>Hazırlanma Zamanı:</Text>
            <Text style={styles.itemText}>
              {item.created_at.toLocaleString("tr", {
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Appbar.Action
          icon="plus"
          onPress={() => setIncomingModalVisible(true)}
        />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <View style={styles.container}>
        <AddMovement
          visible={incomingModalVisible}
          onDismiss={() => setIncomingModalVisible(false)}
          movementType="incoming"
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
    </>
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
