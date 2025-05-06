import { ScrollView, View, Text } from "react-native";
import { Appbar, Provider } from "react-native-paper";
import { DirectionalGraph } from "../components/DirectionalGraph";
import { logout } from "../functions";

export function IncomingGraphsScreen() {
  return (
    <Provider>
      <Appbar.Header>
        <Appbar.Content title="Net Çıkan Ürünler" />
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
          <DirectionalGraph
            api_url="/incoming-graph-data?company_id="
            select_url="companies"
          />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Ürün Bazlı Gelen Ürünler
          </Text>
          <DirectionalGraph
            api_url="/incoming-graph-data-by-product?product_id="
            select_url="products"
          />
        </View>
      </ScrollView>
    </Provider>
  );
}
