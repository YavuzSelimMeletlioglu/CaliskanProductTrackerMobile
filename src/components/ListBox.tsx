import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TotalPerformanceType, UnitPerformanceType } from "@/src/types/types";
import { Button } from "react-native-paper";
import Colors from "../assets/Colors";

type ListBoxProps = {
  text: string;
  data: TotalPerformanceType[] | UnitPerformanceType[];
  selectionTexts?: string[];
  rowInfoData: string[];
  isRefreshing?: boolean;
  handlePress?: (index: number) => void;
  hasSelection: boolean;
};

export function ListBox({
  text,
  data,
  selectionTexts,
  isRefreshing,
  rowInfoData,
  handlePress,
  hasSelection,
}: ListBoxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{text}</Text>
      <Text style={styles.text}>İlk 5</Text>
      {hasSelection && (
        <View style={styles.buttonContainer}>
          {selectionTexts!.map((text, index) => (
            <StyledButton
              key={index}
              label={text}
              isActive={selectedIndex === index}
              onPress={() => {
                handlePress!(index);
                setSelectedIndex(index);
              }}
            />
          ))}
        </View>
      )}
      <View style={styles.tableTextsContainer}>
        <Text style={styles.tableTexts}>{rowInfoData[0]}</Text>
        <Text style={[styles.tableTexts, { width: "35%" }]}>
          {rowInfoData[1]}
        </Text>
        <Text style={styles.tableTexts}>{rowInfoData[2]}</Text>
      </View>
      {isRefreshing ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={data} renderItem={renderItem} scrollEnabled={false} />
      )}
    </View>
  );
}

const StyledButton = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  return (
    <Button
      style={[
        styles.button,
        { backgroundColor: isActive ? Colors.custom.general : "#fff" },
      ]}
      onPress={onPress}
      labelStyle={{ fontWeight: "bold" }}>
      {label}
    </Button>
  );
};

function renderItem({
  item,
  index,
}: {
  item: TotalPerformanceType | UnitPerformanceType;
  index: number;
}) {
  return (
    <View style={styles.renderStyle}>
      <Text style={styles.text}>{item.company_name}</Text>
      <View style={styles.brand}>
        <Text style={styles.brandText}>{item.product_name}</Text>
      </View>
      <Text style={styles.text}>
        {item.total_time_minutes ?? item.avg_minutes_per_unit} dk
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    width: "90%",
    padding: 10,
    borderRadius: 10,
  },
  renderStyle: {
    flexDirection: "row",
    columnGap: 10,
    marginBottom: 7,
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
  },
  text: {
    width: "25%",
    fontWeight: "300",
    fontSize: 17,
    alignSelf: "flex-start",
  },
  tableTextsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableTexts: {
    width: "20%",
    fontWeight: "600",
    fontSize: 17,
  },
  brand: {
    width: "50%",
    flexDirection: "row",
    columnGap: 10,
    justifyContent: "center",
  },
  brandText: {
    fontSize: 16,

    width: "80%",
    alignSelf: "flex-start",
  },
  button: {
    minWidth: "40%",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    marginVertical: 8,
  },
});
