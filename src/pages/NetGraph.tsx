import { ScrollView, View, Text } from "react-native";
import { Appbar, Provider } from "react-native-paper";
import { BiDirectional } from "../components/BiDirectionalGraph";
import { logout } from "../functions";

export function NetGraph() {
  return (
    <Provider>
      <Appbar.Header>
        <Appbar.Content title="Net Ürün Girdi-Çıktı" />
        <Appbar.Action icon="logout" onPress={logout} />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 10,
          rowGap: 10,
        }}>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Şirket Bazlı Gelen Ürünler
          </Text>
          <BiDirectional
            api_url="/net-graph-data?company_id="
            select_url="companies"
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Ürün Bazlı Gelen Ürünler
          </Text>
          <BiDirectional
            api_url="/net-graph-data-by-product?product_id="
            select_url="products"
          />
        </View>
      </ScrollView>
    </Provider>
  );
}
