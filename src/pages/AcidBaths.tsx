import { ScrollView, View } from "react-native";
import { AcidBathCard } from "../modals/AcidBathCard";
import { get } from "../api/api";
import { useEffect, useState } from "react";
import { AcidBath } from "../types/types";

export function AcidBaths() {
  const [baths, setBaths] = useState<AcidBath[]>([]);

  const fetchData = async () => {
    const response = await get("pools/list-pools");
    if (response && response.success) {
      setBaths(response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}>
      {baths.map((item, index) => (
        <AcidBathCard
          pool_number={item.pool_number ?? index}
          remainingTime={item.remaining_time ?? 0}
          isOccupied={item.is_active}
          onPress={() => null}
          company_name={item.company_name ?? ""}
          product_name={item.product_name ?? ""}
        />
      ))}
    </ScrollView>
  );
}

{
  /**
 
  */
}
