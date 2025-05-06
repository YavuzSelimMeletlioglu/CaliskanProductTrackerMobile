import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, Alert, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { deleteRequest, get, post } from "@/src/api/api";
import {
  Company,
  OperationPostBody,
  Product,
  TotalIncomingPostBody,
} from "@/src/types/types";
import { Portal, Dialog, Text as PaperText } from "react-native-paper";

type AddMovementProps = {
  visible: boolean;
  onDismiss: () => void;
  movementType: "incoming" | "outgoing";
  store_id?: number;
  incoming_id?: number;
  company_id?: number;
  product_id?: number;
};

export function AddMovement({
  visible,
  onDismiss,
  movementType,
  company_id,
  product_id,
}: AddMovementProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [productId, setProductId] = useState(0);
  const [companyId, setCompanyId] = useState(0);
  const [mass, setMass] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const [showProductList, setShowProductList] = useState(false);
  const [showCompanyList, setShowCompanyList] = useState(false);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showNewCompany, setShowNewCompany] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCompanies();
  }, []);

  useEffect(() => {
    console.log("Comp ", company_id, " Product ", product_id);
    setCompanyId(company_id || 1);
    setProductId(product_id || 1);
  }, [company_id, product_id]);

  const fetchProducts = async () => {
    const res = await get("products/");
    setProducts(res.data);
  };

  const fetchCompanies = async () => {
    const res = await get("companies/");
    setCompanies(res.data);
  };

  const handleSubmit = async () => {
    if (!mass) {
      Alert.alert("Hata", "Lütfen kütle bilgisini doldurun");
      return;
    }
    const total_payload: TotalIncomingPostBody = {
      product_id: productId,
      company_id: companyId,
      mass: parseInt(mass, 10),
    };
    const op_payload: OperationPostBody = {
      product_id: productId,
      company_id: companyId,
      quantity: parseInt(quantity, 10) || 0,
    };

    let response;
    if (movementType === "incoming") {
      response = await post("total-incomings", total_payload);
      await post("operations/incomings", op_payload);
    } else {
      await deleteRequest(`operations/stores`, op_payload);
      response = await post("total-outgoings", total_payload);
    }

    if (response.success) {
      Alert.alert("Başarılı", "Hareket eklendi");
      setMass("");
      setQuantity("");
      onDismiss();
    } else {
      Alert.alert("Hata", "Hareket eklenemedi");
    }
  };

  const addNewProduct = async () => {
    if (!newProductName) return;
    const res = await post("products/add-product", { name: newProductName });
    if (res.success) {
      await fetchProducts();
      setProductId(res.product_id);
      setShowNewProduct(false);
      setNewProductName("");
    } else {
      Alert.alert("Hata", "Ürün eklenemedi");
    }
  };

  const addNewCompany = async () => {
    if (!newCompanyName) return;
    const res = await post("companies/add-company", { name: newCompanyName });
    if (res.success) {
      await fetchCompanies();
      setCompanyId(res.company_id);
      setShowNewCompany(false);
      setNewCompanyName("");
    } else {
      Alert.alert("Hata", "Firma eklenemedi");
    }
  };

  return (
    <Portal>
      {/* Main Movement Dialog */}
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>
          Ürün {movementType === "incoming" ? "Girişi" : "Çıkışı"} Ekle
        </Dialog.Title>
        <Dialog.Content>
          <PaperText style={styles.label}>Firma:</PaperText>
          <Button
            title={
              companies.find((c) => c.id === companyId)?.name || "Firma Seç"
            }
            onPress={() => setShowCompanyList(true)}
          />

          <PaperText style={styles.label}>Ürün:</PaperText>
          <Button
            title={products.find((p) => p.id === productId)?.name || "Ürün Seç"}
            onPress={() => setShowProductList(true)}
          />

          <PaperText style={styles.label}>Miktar (kg):</PaperText>
          <TextInput
            keyboardType="numeric"
            value={mass}
            onChangeText={setMass}
            style={styles.input}
          />

          <PaperText style={styles.label}>Adet:</PaperText>
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

      {/* Company Picker Dialog */}
      <Dialog
        visible={showCompanyList}
        onDismiss={() => setShowCompanyList(false)}
        style={styles.dialog}>
        <Dialog.Title>Firma Seç</Dialog.Title>
        <Dialog.Content>
          <Picker
            selectedValue={companyId.toString()}
            onValueChange={(val) => {
              if (val === "new") {
                setShowCompanyList(false);
                setShowNewCompany(true);
              } else {
                setCompanyId(Number(val));
              }
            }}>
            {movementType.match("incoming") && (
              <Picker.Item label="+ Yeni Firma Ekle" value="new" />
            )}
            {companies.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id.toString()} />
            ))}
          </Picker>
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="Kapat" onPress={() => setShowCompanyList(false)} />
        </Dialog.Actions>
      </Dialog>

      {/* Product Picker Dialog */}
      <Dialog
        visible={showProductList}
        onDismiss={() => setShowProductList(false)}
        style={styles.dialog}>
        <Dialog.Title>Ürün Seç</Dialog.Title>
        <Dialog.Content>
          <Picker
            selectedValue={productId.toString()}
            onValueChange={(val) => {
              if (val === "new") {
                setShowProductList(false);
                setShowNewProduct(true);
              } else {
                setProductId(Number(val));
              }
            }}>
            {movementType.match("incoming") && (
              <Picker.Item label="+ Yeni Firma Ekle" value="new" />
            )}
            {products.map((p) => (
              <Picker.Item key={p.id} label={p.name} value={p.id.toString()} />
            ))}
          </Picker>
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="Kapat" onPress={() => setShowProductList(false)} />
        </Dialog.Actions>
      </Dialog>

      {/* New Company Dialog */}
      <Dialog
        visible={showNewCompany}
        onDismiss={() => setShowNewCompany(false)}
        style={styles.dialog}>
        <Dialog.Title>Yeni Firma Ekle</Dialog.Title>
        <Dialog.Content>
          <TextInput
            placeholder="Firma adı"
            value={newCompanyName}
            onChangeText={setNewCompanyName}
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="İptal" onPress={() => setShowNewCompany(false)} />
          <Button title="Ekle" onPress={addNewCompany} />
        </Dialog.Actions>
      </Dialog>

      {/* New Product Dialog */}
      <Dialog
        visible={showNewProduct}
        onDismiss={() => setShowNewProduct(false)}
        style={styles.dialog}>
        <Dialog.Title>Yeni Ürün Ekle</Dialog.Title>
        <Dialog.Content>
          <TextInput
            placeholder="Ürün adı"
            value={newProductName}
            onChangeText={setNewProductName}
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="İptal" onPress={() => setShowNewProduct(false)} />
          <Button title="Ekle" onPress={addNewProduct} />
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
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
});
