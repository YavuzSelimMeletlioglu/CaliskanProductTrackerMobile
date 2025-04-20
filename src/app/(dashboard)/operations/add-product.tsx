import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Pressable,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  ModalProps,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { get, post } from "@/src/api/api";
import { Company, Product } from "@/src/types/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  RadioButton,
  Text as PaperText,
  TouchableRipple,
} from "react-native-paper";

type ListModalProps = {
  itemId: number;
  list: Product[] | Company[];
  type: string;
  onValueChange: (item: string) => void;
  onRequestClose: () => void;
} & ModalProps;

type AddNewModalProps = {
  text: string;
  type: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  onClose: () => void;
} & ModalProps;

export default function SonHareketEkle() {
  const { product_id, company_id } = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [productId, setProductId] = useState(Number(product_id) || 1);
  const [companyId, setCompanyId] = useState(Number(company_id) || 1);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [movementType, setMovementType] = useState("incoming");
  const [mass, setMass] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    fetchProducts();
    fetchCompanies();
  }, []);

  const fetchProducts = async () => {
    const res = await get("products/");
    setProducts(res.data);
  };

  const fetchCompanies = async () => {
    const res = await get("companies/");
    setCompanies(res.data);
  };

  const handleSubmit = async () => {
    if (!productId || !companyId || !mass) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    const payload = {
      product_id: productId,
      company_id: companyId,
      movement_type: movementType,
      mass: parseInt(mass),
    };

    const response = await post("movements/add-movement", payload);

    if (response.success) {
      Alert.alert("Başarılı", "Hareket eklendi");
      setMass("");
      router.back();
    } else {
      Alert.alert("Hata", "Hareket eklenemedi");
    }
  };

  const handleNewProductSubmit = async () => {
    if (!newProductName) return;

    const res = await post("products/add-product", { name: newProductName });

    if (res.success) {
      await fetchProducts();
      setProductId(res.product_id);
      setShowNewProductModal(false);
      setNewProductName("");
    } else {
      Alert.alert("Hata", "Ürün eklenemedi");
    }
  };

  const handleNewCompanySubmit = async () => {
    if (!newCompanyName) return;

    const res = await post("companies/add-company", { name: newCompanyName });

    if (res.success) {
      await fetchCompanies();
      setCompanyId(res.company_id);
      setShowNewCompanyModal(false);
      setNewCompanyName("");
    } else {
      Alert.alert("Hata", "Firma eklenemedi");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <PaperText style={{ marginBottom: 8 }}>Firma Seç:</PaperText>
      <Pressable
        onPress={() => setShowCompanyPicker(true)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
        <Text>
          {companies.find((c) => c.id === companyId)?.name || "Firma seç"}
        </Text>
      </Pressable>
      <ListModal
        itemId={companyId}
        visible={showCompanyPicker}
        type="Firma"
        onRequestClose={() => setShowCompanyPicker(false)}
        list={companies}
        onValueChange={(item) => {
          if (item === "new") {
            setShowCompanyPicker(false);
            setShowNewCompanyModal(true);
          } else {
            setCompanyId(Number(item));
            setShowCompanyPicker(false);
          }
        }}
      />
      <AddNewModal
        visible={showNewCompanyModal}
        onChangeText={setNewCompanyName}
        type="Firma"
        onClose={() => setShowNewCompanyModal(false)}
        onSubmit={handleNewCompanySubmit}
        text={newCompanyName}
      />

      <PaperText style={{ marginBottom: 8 }}>Ürün Seç:</PaperText>
      <Pressable
        onPress={() => setShowProductPicker(true)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
        <Text>
          {products.find((p) => p.id === productId)?.name || "Ürün seç"}
        </Text>
      </Pressable>

      <ListModal
        itemId={productId}
        onRequestClose={() => setShowProductPicker(false)}
        onValueChange={(item) => {
          if (item === "new") {
            setShowProductPicker(false);
            setShowNewProductModal(true);
          } else {
            setProductId(Number(item));
            setShowProductPicker(false);
          }
        }}
        list={products}
        visible={showProductPicker}
        type="Ürün"
      />

      <AddNewModal
        visible={showNewProductModal}
        onChangeText={setNewProductName}
        onClose={() => setShowNewProductModal(false)}
        onSubmit={handleNewProductSubmit}
        text={newProductName}
        type="Ürün"
      />

      <PaperText style={{ marginBottom: 8 }}>Hareket Türü:</PaperText>
      <RadioButton.Group onValueChange={setMovementType} value={movementType}>
        <View style={{ marginBottom: 20, flexDirection: "row" }}>
          {[
            { label: "Giriş", value: "incoming" },
            { label: "Çıkış", value: "outgoing" },
          ].map((option) => (
            <TouchableRipple
              key={option.value}
              onPress={() => setMovementType(option.value)}
              style={{
                flexGrow: 1,
                flexDirection: "row",
                paddingVertical: 8,
              }}
              rippleColor="rgba(0, 0, 0, .1)">
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <RadioButton value={option.value} />
                <PaperText>{option.label}</PaperText>
              </View>
            </TouchableRipple>
          ))}
        </View>
      </RadioButton.Group>

      <Text>Miktar (kg):</Text>
      <TextInput
        keyboardType="numeric"
        value={mass}
        onChangeText={setMass}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button title="Kaydet" onPress={handleSubmit} />
    </ScrollView>
  );
}

const ListModal = ({
  itemId,
  list,
  onValueChange,
  onRequestClose,
  type,
  ...props
}: ListModalProps) => {
  return (
    <Modal
      {...props}
      presentationStyle="formSheet"
      animationType="slide"
      onRequestClose={onRequestClose}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "#00000055",
        }}>
        <View style={{ backgroundColor: "white", padding: 20 }}>
          <Picker
            selectedValue={itemId.toString()}
            onValueChange={onValueChange}>
            <Picker.Item label={`+ Yeni ${type} Ekle`} value="new" />
            {list.map((item) => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );
};

const AddNewModal = ({
  text,
  type,
  onChangeText,
  onSubmit,
  onClose,
  ...props
}: AddNewModalProps) => {
  return (
    <Modal {...props} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "#00000099",
        }}>
        <View
          style={{
            margin: 20,
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
          }}>
          <Text>Yeni {type} Adı:</Text>
          <TextInput
            value={text}
            onChangeText={onChangeText}
            style={{ borderWidth: 1, padding: 10 }}
          />
          <Button title="Kaydet" onPress={onSubmit} />
          <Button title="İptal" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};
