import { ScrollView, View } from "react-native";
import { AcidBathCard } from "../modals/AcidBathCard";
import { get } from "../api/api";
import { useEffect, useState } from "react";
import { AcidBath } from "../types/types";
import { Appbar } from "react-native-paper";
import { logout } from "../functions";

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
    <>
      <Appbar.Header>
        <Appbar.Content title="" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}>
        {baths.map((item, index) => (
          <AcidBathCard
            key={item.pool_number}
            pool_number={item.pool_number ?? index}
            remainingTime={item.remaining_time ?? 0}
            isOccupied={item.is_active}
            onPress={() => null}
            company_name={item.company_name ?? ""}
            product_name={item.product_name ?? ""}
          />
        ))}
      </ScrollView>
    </>
  );
}

{
  /**
 
  */
}
