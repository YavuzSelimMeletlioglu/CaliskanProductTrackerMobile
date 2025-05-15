import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type AcidBathCardProps = {
  pool_number: number;
  remainingTime: number; // artık saniye cinsinden
  company_name: string;
  product_name: string;
  isOccupied: boolean;
  onPress: (id: number) => void;
};

function secondsToMMSS(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds)); // negatif olmasın
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
}

export const AcidBathCard: React.FC<AcidBathCardProps> = ({
  pool_number,
  remainingTime,
  isOccupied,
  company_name,
  product_name,
  onPress,
}) => {
  const [localTime, setLocalTime] = useState(remainingTime);

  useEffect(() => {
    setLocalTime(remainingTime); // prop güncellenirse state de güncellenir
  }, [remainingTime]);

  useEffect(() => {
    if (!isOccupied || localTime <= 0) return;

    const interval = setInterval(() => {
      setLocalTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOccupied, localTime]);

  return (
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
          {isOccupied && localTime > 0
            ? `Kalan Süre: ${secondsToMMSS(localTime)}`
            : isOccupied && localTime <= 0
            ? "Süre Bitti"
            : "Banyo Boş"}
        </Text>
      </View>
    </TouchableOpacity>
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
