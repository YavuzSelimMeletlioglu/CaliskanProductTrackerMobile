import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Appbar, Menu, Provider } from "react-native-paper";
import { BiDirectional } from "../components/BiDirectionalGraph";
import { logout } from "../functions";
import { LineGraph } from "../components/LineGraph";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import { get, post } from "../api/api";
import { Company, GraphScreenProps } from "../types/types";

export function NetGraph({ email }: GraphScreenProps) {
  const [selectedCompany, setSelectedCompany] = useState(0);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [graphType, setGraphType] = useState<"monthly" | "yearly">("monthly");
  const [menuVisible, setMenuVisible] = useState(false);

  const fetchCompanies = async () => {
    const response = await get("companies");
    setCompanies(response.data);
    setSelectedCompany(response.data[0]?.id);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const extractPdf = async () => {
    await post("send-multi-company-report", {
      email: email,
      endpoint_type: "net",
    });
  };

  return (
    <Provider>
      <Appbar.Header>
        <Appbar.Content title="Net Ürün Girdi-Çıktı" />
        <Appbar.Action icon="file-pdf-box" onPress={extractPdf} />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 10,
          rowGap: 10,
        }}>
        <View style={{ marginVertical: 10 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
              Şirket Bazlı Giden-Gelen Kilo
            </Text>
            <View style={styles.selectContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setMenuVisible(true)}
                    style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      {selectedCompany
                        ? companies.find((c) => c.id === selectedCompany)?.name
                        : "Firma Seçin"}
                    </Text>
                    <MaterialIcons
                      name="keyboard-arrow-down"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                }>
                {companies.map((company) => (
                  <Menu.Item
                    key={company.id}
                    onPress={() => {
                      setSelectedCompany(company.id);
                      setMenuVisible(false);
                    }}
                    title={company.name}
                  />
                ))}
              </Menu>
            </View>
          </View>
          <LineGraph
            api_url={`/net-graph-data?company_id=${selectedCompany}&type=${graphType}`}
            graphType={graphType}
          />
          <View style={styles.dateContainer}>
            <TouchableOpacity onPress={() => setGraphType("monthly")}>
              <Text
                style={{
                  fontWeight: graphType === "monthly" ? "bold" : "normal",
                }}>
                Aylık
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGraphType("yearly")}>
              <Text
                style={{
                  fontWeight: graphType === "yearly" ? "bold" : "normal",
                }}>
                Yıllık
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Ürün Bazlı Giden-Gelen Kilo
          </Text>
          <BiDirectional
            api_url={`/net-graph-data-by-product?company_id=${selectedCompany}&type=${graphType}`}
            graphType={graphType}
          />
        </View>
      </ScrollView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 330,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  selectContainer: {
    alignSelf: "flex-end",
    flexShrink: 1,
    marginRight: 10,
    padding: 5,
    borderColor: "#ccc",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    columnGap: 10,
  },
  chartText: {
    textAlign: "center",
    alignSelf: "center",
    width: 70,
  },
});
