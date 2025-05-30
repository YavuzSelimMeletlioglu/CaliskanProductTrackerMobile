import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { LineChart, lineDataItem } from "react-native-gifted-charts";
import { get } from "../api/api";
import { GraphProps } from "../types/types";
import { monthlyDateConfig, yearlyDateConfig } from "../functions";

export function LineGraph({ api_url, graphType }: GraphProps) {
  const [data, setData] = useState<lineDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [max, setMax] = useState(-Infinity);

  const fetchData = async () => {
    if (!api_url) return;
    setLoading(true);
    try {
      const response = await get(api_url);

      const formattedData: lineDataItem[] = response.data.map((item: any) => ({
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
  }, [api_url, graphType]);

  return loading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <View style={styles.container}>
      <View>
        <LineChart
          data={data}
          maxValue={max < 0 ? 1000 : max + (max * 2) / 10}
          width={(Dimensions.get("screen").width * 8) / 10}
          xAxisLabelTextStyle={styles.chartText}
          disableScroll
          yAxisLabelWidth={50}
          initialSpacing={10}
          spacing={graphType === "monthly" ? data.length * 3 : data.length * 10}
          noOfSections={5}
          showVerticalLines
          hideRules
          areaChart
          xAxisTextNumberOfLines={0}
          dataPointsRadius={0}
          startFillColor="#8282F0"
          color="#8282F0"
          xAxisThickness={0}
          yAxisThickness={0}
          isAnimated
          animationDuration={3000}
          showTextOnFocus
          pointerConfig={{
            autoAdjustPointerLabelPosition: true,
            showPointerStrip: false,
            pointerLabelHeight: 60,
            pointerLabelWidth: 80,
            pointerVanishDelay: 2000,
            radius: 4,
            pointerLabelComponent: (items: lineDataItem[]) => {
              return (
                <View
                  style={{
                    backgroundColor: "#282C3E",
                    borderRadius: 4,
                    justifyContent: "center",
                    padding: 8,
                  }}>
                  <Text
                    style={{
                      color: "lightgray",
                      fontSize: 15,
                      fontWeight: "bold",
                    }}>
                    {items[0].label}
                  </Text>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {items[0].value}
                  </Text>
                </View>
              );
            },
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: "#fff",
    justifyContent: "center",
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
