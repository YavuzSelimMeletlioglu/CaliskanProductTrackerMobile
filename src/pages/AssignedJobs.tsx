import {
  View,
  Text,
  Alert,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { get } from "../api/api";
import { Assignment } from "../types/types";
import { Appbar } from "react-native-paper";
import { logout } from "../functions";
import { AddProcessorAssignment } from "../modals/AddProcessOrAssignment";

const AssignedJobs = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [assignedJobs, setAssignedJobs] = useState<Assignment[]>([]);
  const [visible, setIsVisible] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const fetch = async () => {
    setIsRefreshing(true);
    const response = await get("assignments");
    if (response && response.success) {
      setAssignedJobs(response.data);
    } else {
      Alert.alert("Uyarı", response.error);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const renderItem = ({ item }: { item: Assignment }) => {
    return (
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={() => {
          setSelectedCompanyId(item.company_id);
          setSelectedProductId(item.product_id);
          setIsVisible(true);
        }}>
        <AddProcessorAssignment
          visible={visible}
          onDismiss={() => setIsVisible(false)}
          company_id={selectedCompanyId ?? 1}
          product_id={selectedProductId ?? 1}
          isAssignment={false}
        />
        <View
          style={{
            borderRadius: 10,
            width: "100%",
          }}
        />
        <View style={styles.rowContainer}>
          <Text style={styles.itemText}>{item.company_name}</Text>
          <Text style={styles.itemText}>{item.product_name}</Text>
          <Text style={styles.itemText}>{item.quantity} adet</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <View style={styles.container}>
        <FlatList
          data={assignedJobs}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetch()}
            />
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
};

export default AssignedJobs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: "#ddd",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 5,
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 15,
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
