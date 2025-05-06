import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { Menu } from "react-native-paper";
import { get } from "../api/api";
import { GraphProps, Product } from "../types/types";
import { monthlyDateConfig, yearlyDateConfig } from "../functions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function DirectionalGraph({ api_url, select_url }: GraphProps) {
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [graphType, setGraphType] = useState<"monthly" | "yearly">("monthly");
  const [data, setData] = useState<barDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [companies, setCompanies] = useState<Product[]>([]);
  const [max, setMax] = useState(-Infinity);

  const fetchCompanies = async () => {
    const response = await get(select_url);
    setCompanies(response.data);
    setSelectedCompany(response.data[0]?.id);
  };

  const fetchData = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    try {
      const response = await get(
        `${api_url}${selectedCompany}&type=${graphType}`
      );

      const formattedData: barDataItem[] = response.data.map((item: any) => ({
        label: new Date(item.label).toLocaleDateString(
          "tr",
          graphType === "yearly" ? yearlyDateConfig : monthlyDateConfig
        ),
        value: parseInt(item.value),
        frontColor: "green",
      }));
      setData(formattedData);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    var localMax = -Infinity;
    data.forEach((item, index) => {
      if (item.value !== undefined && item.value > localMax) {
        localMax = item.value;
        data[index].value = item.value;
      }
    });
    setMax(localMax);
  }, [data]);

  useEffect(() => {
    fetchData();
  }, [selectedCompany, graphType]);

  return loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <View style={styles.container}>
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
      <View>
        <BarChart
          data={data}
          maxValue={max < 0 ? 1000 : max + (max * 2) / 10}
          width={(Dimensions.get("screen").width * 8) / 10}
          barWidth={10}
          xAxisLabelTextStyle={styles.chartText}
          disableScroll
          yAxisLabelWidth={50}
          noOfSections={5}
          showVerticalLines
          labelsDistanceFromXaxis={15}
          barBorderTopLeftRadius={5}
          barBorderTopRightRadius={5}
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          isAnimated
          autoCenterTooltip
          renderTooltip={(item: barDataItem) => (
            <View
              style={{
                height: 40,
                width: 80,
                backgroundColor: "#282C3E",
                borderRadius: 4,
                justifyContent: "center",
                paddingLeft: 8,
                marginLeft: 30,
              }}>
              <Text
                style={{
                  color: "lightgray",
                  fontSize: 15,
                  fontWeight: "bold",
                }}>
                {item.label}
              </Text>
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {item.value}
              </Text>
            </View>
          )}
        />
      </View>
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
