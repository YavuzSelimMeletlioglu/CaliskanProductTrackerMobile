import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="operations"
        options={{
          headerTitle: "Ürün Ekle",
        }}
      />
    </Stack>
  );
}
