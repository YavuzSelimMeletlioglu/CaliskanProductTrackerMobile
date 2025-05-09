import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { get } from "../api/api";
import { TotalPerformanceType, UnitPerformanceType } from "../types/types";
import { ListBox } from "../components/ListBox";

export default function Performance() {
  const [totalData, setTotalData] = useState<TotalPerformanceType[]>([]);
  const [unitData, setUnitData] = useState<UnitPerformanceType[]>([]);
  const bestTotalFive = useRef<TotalPerformanceType[]>([]);
  const worstTotalFive = useRef<TotalPerformanceType[]>([]);
  const bestUnitFive = useRef<UnitPerformanceType[]>([]);
  const worstUnitFive = useRef<UnitPerformanceType[]>([]);

  const fetchData = async () => {
    const bestResponse = await get("performance/best-5");
    const worstResponse = await get("performance/worst-5");
    if (bestResponse && bestResponse.success) {
      bestTotalFive.current = bestResponse.data.map((item: any) => {
        return {
          company_name: item.company_name,
          product_name: item.product_name,
          total_time_minutes: item.total_time_minutes,
        };
      });
      bestUnitFive.current = bestResponse.data.map((item: any) => {
        return {
          company_name: item.company_name,
          product_name: item.product_name,
          avg_minutes_per_unit: item.avg_minutes_per_unit,
        };
      });
    }
    if (worstResponse && worstResponse.success) {
      worstTotalFive.current = worstResponse.data.map((item: any) => {
        return {
          company_name: item.company_name,
          product_name: item.product_name,
          total_time_minutes: item.total_time_minutes,
        };
      });
      worstUnitFive.current = worstResponse.data.map((item: any) => {
        return {
          company_name: item.company_name,
          product_name: item.product_name,
          avg_minutes_per_unit: item.avg_minutes_per_unit,
        };
      });
    }
    setTotalData(worstTotalFive.current);
    setUnitData(worstUnitFive.current);
  };

  const toggleTotalData = (index: number) => {
    if (index === 1) {
      setTotalData(bestTotalFive.current);
    } else {
      setTotalData(worstTotalFive.current);
    }
  };

  const toggleUnitData = (index: number) => {
    if (index === 1) {
      setUnitData(bestUnitFive.current);
    } else {
      setUnitData(worstUnitFive.current);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ paddingVertical: 40, justifyContent: "center" }}>
      <View style={styles.container}>
        <ListBox
          text="Ürünlere Göre Harcanan Süre"
          hasSelection
          rowInfoData={["Şirket", "Ürün", "Toplam Süre"]}
          selectionTexts={["En Çok", "En Az"]}
          data={totalData}
          handlePress={toggleTotalData}
        />

        <ListBox
          text="Adetlere Göre Harcanan Süre"
          hasSelection
          rowInfoData={["Şirket", "Ürün", "Süre/Adet"]}
          selectionTexts={["En Çok", "En Az"]}
          data={unitData}
          handlePress={toggleUnitData}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 20,
  },
});
