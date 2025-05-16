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
import { deleteRequest, get, post } from "../api/api";
import { Assignment } from "../types/types";
import { Appbar } from "react-native-paper";
import { dateConfig, logout } from "../functions";
import { AddProcessorAssignment } from "../modals/AddProcessOrAssignment";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  user_id?: string;
};

const AssignedJobs = ({ user_id }: Props) => {
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
    const response = await get(`assignments/${user_id ?? ""}`);
    if (response && response.success) {
      const modifiedData: Assignment[] = response.data.map(
        (item: Assignment) => {
          return {
            ...item,
            last_date_completion: new Date(item.last_date_completion),
          };
        }
      );
      setAssignedJobs(modifiedData);
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
      <View
        style={{ flexDirection: "row", alignItems: "center", columnGap: 5 }}>
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
            assignment_id={item.assignment_id}
            isAdmin={false}
            fromAssignments={true}
          />
          <View style={styles.rowContainer}>
            <View
              style={{
                height: "100%",
                width: 10,
                borderRadius: 10,
                backgroundColor:
                  item.completed_quantity === 0
                    ? "red"
                    : item.completed_quantity === item.quantity
                    ? "green"
                    : "orange",
              }}
            />
            <View>
              <View style={styles.rowContainer}>
                <Text style={styles.itemText}>{item.company_name}</Text>
                <Text style={styles.itemText}>{item.product_name}</Text>
                <Text style={styles.itemText}>
                  {item.last_date_completion.toLocaleDateString(
                    "tr",
                    dateConfig
                  )}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  flex: 1,
                }}>
                <Text style={styles.itemText}>Toplam: {item.quantity}</Text>
                <Text style={styles.itemText}>
                  Kalan: {item.quantity - item.completed_quantity}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <AntDesign
          name="delete"
          size={24}
          color="red"
          onPress={() => {
            deleteRequest("assignments", { assignment_id: item.assignment_id });
            const newList = assignedJobs.filter(
              (value) => item.assignment_id !== value.assignment_id
            );
            setAssignedJobs(newList);
          }}
        />
      </View>
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
    columnGap: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
  },
});
