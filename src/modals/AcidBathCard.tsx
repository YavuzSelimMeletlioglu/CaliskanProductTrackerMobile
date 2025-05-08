import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type AcidBathCardProps = {
  pool_number: number;
  remainingTime: number;
  company_name: string;
  product_name: string;
  isOccupied: boolean;
  onPress: (id: number) => void;
};

export const AcidBathCard: React.FC<AcidBathCardProps> = ({
  pool_number,
  remainingTime,
  isOccupied,
  company_name,
  product_name,
  onPress,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => onPress(pool_number)}
        style={styles.container}>
        <View
          style={[
            styles.status,
            { backgroundColor: isOccupied ? "red" : "green" },
          ]}
        />

        <View>
          <Text style={styles.text}>Banyo {pool_number}</Text>
          {isOccupied && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 20,
              }}>
              <Text style={styles.text}>{company_name}</Text>
              <Text style={styles.text}>{product_name}</Text>
            </View>
          )}
          <Text style={{ fontSize: 14, color: "#555" }}>
            {isOccupied && remainingTime > 0
              ? `Kalan Süre: ${remainingTime} dk`
              : isOccupied && remainingTime <= 0
              ? "Süre Bitti"
              : "Banyo Boş"}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#ccc",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  status: {
    width: 6,
    height: "100%",
    borderRadius: 3,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
