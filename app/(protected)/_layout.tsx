import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDrawer } from "../src/admin/viewmodels/use-drawer";
import { useAuth } from "../src/context/AuthContext";

export default function ProtectedLayout() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const { profile, navigationOptions } = useDrawer();
  const [isInventoryExpanded, setIsInventoryExpanded] = useState(false)

  const handleLogout = async () => {
    await clearSession();
    router.replace("/(public)");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="dashboard"
        screenOptions={{
          headerTintColor: "#006C47"
        }}
        drawerContent={(props) => {
          const activeIndex = props.state.index;
          const activeRouteName = props.state.routeNames[activeIndex];

          return (
            <View style={styles.drawerContainer}>
              {/* HEADER DEL DRAWER */}
              <View style={styles.header}>
                <View style={styles.headerInfoUser}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: profile.avatarUrl }}
                  />
                  <View style={styles.headerInfo}>
                    <Text style={styles.adminName}>{profile.name}</Text>
                    <Text style={styles.adminRole}>{profile.role}</Text>
                  </View>
                </View>
                <View style={styles.versionTag}>
                  <Text>{profile.version}</Text>
                </View>
              </View>

              {/* LISTA DE OPCIONES DEL MENU */}
              <View style={styles.menuList}>
                {navigationOptions.map((option) => {
                  const isSelected = activeRouteName === option.name;
                  const hasSubItems = !!option.subitems;

                  return (
                    <View key={option.name}>
                      {/* Botón principal del menú */}
                      <TouchableOpacity
                        style={[styles.menuItemList, isSelected && styles.menuItemSelected]}
                        onPress={() => {
                          if (hasSubItems) {
                            setIsInventoryExpanded(!isInventoryExpanded);
                          } else {
                            router.push(`/(protected)/${option.name}` as any);
                          }
                        }}
                      >
                        <Feather
                          name={option.icon as any}
                          size={20}
                          color={isSelected ? "#FFF" : "#374151"}
                          style={styles.menuIcon}
                        />
                        <Text style={[styles.menuText, isSelected && styles.menuTextSelect]}>
                          {option.label}
                        </Text>
                        {hasSubItems && (
                          <Feather
                            name={isInventoryExpanded ? "chevron-up" : "chevron-down"}
                            size={16}
                            style={{ marginLeft: "auto" }}
                          />
                        )}
                      </TouchableOpacity>

                      {/* Subitems renderizados como hermanos (fuera del TouchableOpacity del padre) */}
                      {hasSubItems && isInventoryExpanded && option.subitems?.map((sub) => {
                        const isSubSelected = activeRouteName === sub.name;
                        return (
                          <TouchableOpacity
                            key={sub.name}
                            style={[
                              styles.menuItemList,
                              { paddingLeft: 40 },
                              isSubSelected && styles.menuItemSelected
                            ]}
                            onPress={() => router.push(`/(protected)/${sub.name}` as any)}
                          >
                            <Feather
                              name={sub.icon as any}
                              size={16}
                              color={isSubSelected ? "#FFF" : "#4B5563"}
                              style={styles.menuIcon}
                            />
                            <Text style={[styles.menuText, { fontSize: 14 }, isSubSelected && styles.menuTextSelect]}>
                              {sub.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                })}
              </View>

              {/* BOTON LOGOUT */}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Feather name="log-out" size={20} color={"#EF4444"} style={styles.menuIcon} />
                <Text style={styles.logouText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      >
        {/* === AQUI SE REGISTRAN LAS PANTALLAS DEL DRAWER === */}
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
          }}
        />
        <Drawer.Screen
          name="inventory"
          options={{
            drawerLabel: "Inventory",
            title: "Inventario",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    alignItems: "flex-start"
  },
  headerInfoUser: {
    flexDirection: "row"
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 30
  },
  headerInfo: {
    marginLeft: 15,
    marginTop: 5
  },
  adminName: {
    fontSize: 20,
    color: "#006C47",
    fontWeight: "bold"
  },
  adminRole: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#6B7280",
  },
  versionTag: {
    borderWidth: 1,
    paddingHorizontal: 8,
    borderColor: "#D1D5DB",
    paddingVertical: 2,
    marginTop: 8,
    borderRadius: 12
  },
  menuList: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12
  },
  menuItemList: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginVertical: 4
  },
  menuItemSelected: {
    backgroundColor: "#00B074"
  },
  menuIcon: {
    marginRight: 15
  },
  menuText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#374151"
  },
  menuTextSelect: {
    color: "#ffff"
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 15
  },
  logouText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#EF4444"
  }
});