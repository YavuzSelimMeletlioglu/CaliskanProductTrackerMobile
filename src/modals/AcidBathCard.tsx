import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type AcidBathCardProps = {
  id: number;
  remainingTime: number;
  company_name: string;
  product_name: string;
  isOccupied: boolean;
  onPress: (id: number) => void;
};

export const AcidBathCard: React.FC<AcidBathCardProps> = ({
  id,
  remainingTime,
  isOccupied,
  company_name,
  product_name,
  onPress,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => onPress(id)}
        style={{
          width: "90%",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          borderWidth: 0.5,
          borderColor: "#ccc",
          padding: 16,
          marginVertical: 8,
          borderRadius: 8,
        }}>
        <View
          style={{
            width: 6,
            height: "100%",
            backgroundColor: isOccupied ? "red" : "green",
            borderRadius: 3,
            marginRight: 12,
          }}
        />

        {/* Banyo bilgisi */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Banyo {id}</Text>
          {isOccupied && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {company_name}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {product_name}
              </Text>
            </View>
          )}
          <Text style={{ fontSize: 14, color: "#555" }}>
            {remainingTime > 0
              ? `Kalan Süre: ${remainingTime} dk`
              : "Banyo Boş"}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
