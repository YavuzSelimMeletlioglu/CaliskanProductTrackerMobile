import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { BarChart, barDataItem } from "react-native-gifted-charts";
import { get } from "../api/api";
import { GraphProps } from "../types/types";

export function BiDirectional({ api_url, graphType }: GraphProps) {
  const [data, setData] = useState<barDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [max, setMax] = useState(-Infinity);

  const fetchData = async () => {
    if (!api_url) return;
    setLoading(true);
    try {
      const response = await get(api_url);
      const formattedData: barDataItem[] = response.data.map((item: any) => ({
        label: item.label,
        value: parseInt(item.value),
        frontColor: parseInt(item.value) >= 0 ? "blue" : "red",
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
      <BarChart
        data={data}
        maxValue={max < 0 ? 1000 : max + (max * 2) / 10}
        width={(Dimensions.get("screen").width * 8) / 10}
        barWidth={10}
        yAxisLabelWidth={50}
        noOfSections={5}
        showVerticalLines
        labelsDistanceFromXaxis={15}
        barBorderTopLeftRadius={5}
        barBorderTopRightRadius={5}
        xAxisTextNumberOfLines={0}
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        isAnimated
        autoCenterTooltip
        renderTooltip={(item: barDataItem) => (
          <View
            style={{
              backgroundColor: "#282C3E",
              borderRadius: 4,
              justifyContent: "center",
              padding: 8,
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
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    backgroundColor: "#fff",
    justifyContent: "center",
    borderRadius: 10,
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
