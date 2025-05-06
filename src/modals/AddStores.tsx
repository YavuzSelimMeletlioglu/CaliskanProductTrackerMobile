import React, { useState } from "react";
import { TextInput, Button, Alert, StyleSheet } from "react-native";
import { post } from "@/src/api/api";
import { Text, Portal, Dialog } from "react-native-paper";
import { ListModalProps, OperationPostBody } from "../types/types";

export function AddStores({
  company_id,
  product_id,
  visible,
  onDismiss,
}: ListModalProps) {
  const [quantity, setQuantity] = useState<string>("");

  const handleSubmit = async () => {
    if (!quantity) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    const payload: OperationPostBody = {
      company_id: company_id,
      product_id: product_id,
      quantity: parseInt(quantity, 10),
    };
    const response = await post("operations/stores", payload);

    if (response.success) {
      Alert.alert("Başarılı", "Hareket eklendi");
      setQuantity("");
      onDismiss();
    } else {
      Alert.alert("Hata", "Hareket eklenemedi");
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>İşlem Ekle</Dialog.Title>
        <Dialog.Content>
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
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 10,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
