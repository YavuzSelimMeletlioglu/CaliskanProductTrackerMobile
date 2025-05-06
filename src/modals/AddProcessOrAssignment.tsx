import React, { useEffect, useState } from "react";
import { Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { deleteRequest, post } from "@/src/api/api";
import { Portal, Dialog } from "react-native-paper";
import { ListModalProps, OperationPostBody } from "../types/types";

export function AddProcessorAssignment({
  company_id,
  product_id,
  isAssignment,
  visible,
  onDismiss,
}: ListModalProps) {
  const [companyId, setCompanyId] = useState<number>(0);
  const [productId, setProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");

  const handleSubmit = async () => {
    if (!quantity) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }
    let response;
    const payload: OperationPostBody = {
      company_id: companyId,
      product_id: productId,
      quantity: parseInt(quantity),
    };
    if (isAssignment) {
      response = await post("assignments", payload);
    } else {
      await deleteRequest("assignments", payload);
      response = await post("operations/processes", payload);
    }

    if (response.success) {
      Alert.alert("Başarılı", "Hareket eklendi");
      setQuantity("");
      onDismiss();
    } else {
      Alert.alert("Hata", "Hareket eklenemedi");
    }
  };

  useEffect(() => {
    setCompanyId(company_id);
    setProductId(product_id);
  }, [company_id, product_id]);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>İşlem Ekle</Dialog.Title>
        <Dialog.Content>
          <Text>Miktar (adet):</Text>
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
  input: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
