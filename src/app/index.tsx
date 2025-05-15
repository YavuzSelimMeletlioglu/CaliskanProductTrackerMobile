import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { post } from "../api/api";
import Feather from "@expo/vector-icons/Feather";

export default function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onPress = async () => {
    if (username.length > 0 && password.length > 0) {
      const response = await post("/auth", { username, password });
      if (response.success) {
        switch (response.data.user_role) {
          case 1:
            router.push({
              pathname: "/(dashboard)/owner",
              params: {
                email: response.data.email,
              },
            });
            break;
          case 2:
            router.push("/(dashboard)/admin");
            break;
          case 3:
            router.push("/(dashboard)/steelyard");
            break;
          case 4:
            router.push({
              pathname: "/(dashboard)/crane-overlooker",
              params: {
                user_id: response.data.user_id,
              },
            });
            break;
          case 5:
            router.push("/(dashboard)/cleaning-overlooker");
            break;
          default:
            Alert.alert("Uyarı", "Kullanıcı rolü atanmamış!");
            break;
        }
      }
      if (response.error) {
        alert(response.error);
      }
    } else {
      alert("Lütfen tüm alanları doldurun.");
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Giriş Yap",
          headerStyle: {
            backgroundColor: "#555",
          },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Kullanıcı Adı"
          placeholderTextColor="#999"
          onChangeText={(text) => setUsername(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            placeholder="Şifre"
            placeholderTextColor="#999"
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePassword}>
            <Feather
              style={styles.icon}
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
  },
  contentContainer: {
    width: "90%",
    alignItems: "center",
    paddingVertical: 20,
    rowGap: 20,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
  },
  inputs: {
    padding: 10,
    width: "90%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#999",
  },
  button: {
    padding: 7,
    backgroundColor: "#555",
    borderRadius: 7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: "90%",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  icon: {
    marginLeft: 10,
  },
});
