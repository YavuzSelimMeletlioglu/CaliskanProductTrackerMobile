import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Pressable,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { deleteRequest, get, post } from "@/src/api/api";
import { Portal, Dialog } from "react-native-paper";
import { ListModalProps } from "../types/types";
import { Picker } from "@react-native-picker/picker";
import { dateConfig } from "../functions";

export function AddProcessorAssignment({
  company_id,
  product_id,
  assignment_id,
  isAdmin,
  fromAssignments,
  visible,
  onDismiss,
}: ListModalProps) {
  const [companyId, setCompanyId] = useState<number>(0);
  const [productId, setProductId] = useState<number>(0);
  const [showCraneOverlookers, setShowCraneOverlookers] = useState(false);
  const [craneOverlookers, setCraneOverlookers] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
  const [recommendedEmployee, setRecommendedEmployee] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleSubmit = async () => {
    if (
      (isAdmin && (!selectedEmployee || !dueDate || !selectedEmployee)) ||
      !quantity
    ) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    const process_payload: any = {
      company_id: companyId,
      product_id: productId,
      quantity: parseInt(quantity),
    };

    const assignment_payload: any = {
      company_id: companyId,
      product_id: productId,
      quantity: parseInt(quantity),
      user_id: selectedEmployee,
      last_date_completion: dueDate
        ? dueDate.toISOString().split("T")[0]
        : null,
    };

    let response;
    if (isAdmin) {
      response = await post("assignments/add-assignment", assignment_payload);
    } else {
      if (fromAssignments) {
        await post("assignments/update-quantity", {
          assignment_id: assignment_id,
          quantity: quantity,
        });
      }
      response = await post("operations/processes", process_payload);
    }

    if (response.success) {
      Alert.alert("Başarılı", "Hareket eklendi");
      setQuantity("");
      setDueDate(null);
      onDismiss();
    } else {
      Alert.alert("Hata", "Hareket eklenemedi");
    }
  };

  const fetchOverlookers = async () => {
    const response = await get("users/crane_overlookers");
    if (response && response.success) {
      setCraneOverlookers(response.data);
      setSelectedEmployee(response.data[0]?.id || 0);
    }
  };

  const fetchRecommendation = async () => {
    const response = await post("assignments/recommendation", {});
    if (response && response.success) {
      setRecommendedEmployee(response.data.user_id);
    }
  };

  useEffect(() => {
    isAdmin && fetchOverlookers();
    isAdmin && fetchRecommendation();
  }, []);

  useEffect(() => {
    setCompanyId(company_id);
    setProductId(product_id);
  }, [company_id, product_id]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>{isAdmin ? "Görev Ata" : "Süreci Başlat"}</Dialog.Title>
        <Dialog.Content>
          {isAdmin && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  columnGap: 5,
                }}>
                <Text style={styles.recommendad}>En müsait çalışan:</Text>
                <Text
                  style={[
                    styles.recommendad,
                    {
                      color: "green",
                    },
                  ]}>
                  {
                    craneOverlookers.find((c) => c.id === recommendedEmployee)
                      ?.name
                  }
                </Text>
              </View>
              <Text style={styles.label}>Çalışan:</Text>
              <Button
                title={
                  craneOverlookers.find((c) => c.id === selectedEmployee)
                    ?.name || "Çalışan Seç"
                }
                onPress={() => setShowCraneOverlookers(true)}
              />

              <Text style={styles.label}>Son Teslim Tarihi:</Text>
              <Pressable
                onPress={() => setDatePickerVisible(true)}
                style={styles.input}>
                <Text>
                  {dueDate
                    ? dueDate.toLocaleDateString("tr", dateConfig)
                    : "Tarih seçin"}
                </Text>
              </Pressable>
            </>
          )}

          <Text style={styles.label}>Miktar (adet):</Text>
          <TextInput
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="İptal" onPress={onDismiss} />
          <Button title="Kaydet" onPress={handleSubmit} />
        </Dialog.Actions>
      </Dialog>

      <Dialog
        visible={showCraneOverlookers}
        onDismiss={() => setShowCraneOverlookers(false)}
        style={styles.dialog}>
        <Dialog.Title>Çalışan Seç</Dialog.Title>
        <Dialog.Content>
          <Picker
            selectedValue={selectedEmployee.toString()}
            onValueChange={(val) => setSelectedEmployee(Number(val))}>
            {craneOverlookers.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id.toString()} />
            ))}
          </Picker>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            title="Kapat"
            onPress={() => setShowCraneOverlookers(false)}
          />
        </Dialog.Actions>
      </Dialog>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        cancelTextIOS="İptal"
        confirmTextIOS="Onay"
        onConfirm={(date) => {
          setDatePickerVisible(false);
          setDueDate(date);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
  },
  recommendad: {
    fontWeight: "600",
  },
});
