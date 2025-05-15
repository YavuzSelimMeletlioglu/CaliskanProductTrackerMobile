import {
  Modal,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { useEffect, useState } from "react";
import { post } from "@/src/api/api";

type Props = {
  company_id: number;
  product_id: number;
  visible: boolean;
  onClose: () => void;
};

export function ProductAssignmentPie({
  company_id,
  product_id,
  visible,
  onClose,
}: Props) {
  const [data, setData] = useState<pieDataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const response = await post("assignments/filter-strict", {
      company_id,
      product_id,
    });

    if (response.success) {
      const chartData: pieDataItem[] = response.data.map(
        (item: any, index: number) => ({
          value: item.quantity,
          text: item.quantity,
          tooltipText: item.user_name,
          focused: index === selectedIndex,
          onPress: () => setSelectedIndex(index),
          color: randomColor(index),
        })
      );
      setData(chartData);
    }
    setLoading(false);
  };

  const randomColor = (index: number) => {
    const colors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#FF9F1C"];
    return colors[index % colors.length];
  };

  useEffect(() => {
    if (visible) {
      setSelectedIndex(null);
      fetchData();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Atama Dağılımı</Text>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <>
              <PieChart
                data={data}
                innerRadius={60}
                radius={115}
                donut
                showText
                textSize={17}
                textColor="#000"
                showTooltip
                tooltipDuration={1000}
                tooltipBackgroundColor="#ccc"
              />
            </>
          )}
          <Text style={styles.closeButton} onPress={onClose}>
            Kapat
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 20,
    width: "90%",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "blue",
  },
  tooltip: {
    marginTop: 16,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
  },
  tooltipText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
