import { View } from "react-native";
import { AcidBathCard } from "../modals/AcidBathCard";

export function AcidBaths() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <AcidBathCard
        id={1}
        remainingTime={30}
        isOccupied={true}
        onPress={() => null}
        company_name="ERL"
        product_name="U Profil"
      />
      <AcidBathCard
        id={2}
        remainingTime={10}
        isOccupied={true}
        onPress={() => null}
        company_name="C Profil"
        product_name="Boru"
      />
      <AcidBathCard
        id={3}
        remainingTime={5}
        isOccupied={true}
        onPress={() => null}
        company_name="C Profil"
        product_name="Boru"
      />
      <AcidBathCard
        id={4}
        remainingTime={0}
        isOccupied={false}
        onPress={() => null}
        company_name="C Profil"
        product_name="Boru"
      />
    </View>
  );
}
