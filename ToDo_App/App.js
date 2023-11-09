import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

function API_Screen_01({ navigation }) {
  const [user, setuser] = useState([]);
  const [email, setEmail] = useState("");
  const [check, setCheck] = useState(false);
  useEffect(() => {
    fetch("https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App")
      .then((response) => response.json())
      .then((json) => {
        setuser(json);
      });
  }, []);
  const loginUser = () => {
    const foundUser = user.find((item) => item.email === email);

    if (foundUser) {
      navigation.navigate("API_Screen_02", { userEmail: email });
      setCheck(false);
    } else {
      setCheck(true);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("./assets/book_header.png")}
        style={{ width: 271, height: 271 }}
      />
      <Text
        style={{
          textAlign: "center",
          color: "#8353E2",
          fontSize: 24,
          fontWeight: "bold",
          lineHeight: 36,
          width: 390,
          height: 72,
          fontFamily: "Epilogue",
        }}
      >
        MANAGE YOUR {"\n"} TASK
      </Text>
      <View style={{}}>
        <TextInput
          style={{
            width: 334,
            height: 43,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: "#9095A0",
            paddingLeft: 35,
          }}
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
        ></TextInput>
        <Image
          style={{
            width: 20,
            height: 20,
            position: "absolute",
            top: 12,
            left: 10,
          }}
          source={require("./assets/Frame.png")}
        />
      </View>
      <TouchableOpacity
        style={{
          width: 190,
          height: 44,
          backgroundColor: "#00BDD6",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 12,
          shadowColor: "#000",
        }}
        onPress={loginUser}
      >
        <Text
          style={{
            color: "white",
            width: 128,
            height: 26,
            fontSize: 16,
            fontFamily: "Inter",
            lineHeight: 26,
            textAlign: "center",
          }}
        >
          Go to Screen 02
        </Text>
      </TouchableOpacity>
      <View>
        {check ? <Text style={{ color: "red" }}>Invalid Email</Text> : null}
      </View>
    </View>
  );
}

function API_Screen_02({ route, navigation }) {
  const { userEmail } = route.params;
  const [userPlan, setUserPlan] = useState([]);
  const [user, setUser] = useState();
  const [editedItemIndex, setEditedItemIndex] = useState(-1);
  const [deleteItemIndex, setDeleteItemIndex] = useState(-1);
  const [newItemName, setNewItemName] = useState("");


  useEffect(() => {
    fetch("https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App")
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((user) => user.email === userEmail);
        setUser(user.id);
        if (user) {
          setUserPlan(user.plan);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }, [userEmail]);
  
  const updateItemName = () => {
    if (editedItemIndex !== -1) {
      const updatedData = [...userPlan];
      const userId = user;
      console.log("userId:", userId);
  
      const updatedJobIndex = updatedData.findIndex(
        (job) => job.id_plan === updatedData[editedItemIndex].id_plan
      );
  
      // console.log("updatedData:", updatedData);
      // console.log("updatedJobIndex:", updatedJobIndex);
  
      if (updatedData[updatedJobIndex].job === newItemName) {
        setEditedItemIndex(-1);
        setNewItemName("");
        return;
      }
  
      updatedData[updatedJobIndex].job = newItemName;
  
      console.log("Updated job:", newItemName);
  
      fetch(
        `https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan: updatedData, 
          }),
        }
      )
        .then((response) => {
          if (!response || !response.ok) {
            const status = response ? response.status : "unknown";
            throw new Error(`HTTP error! Status: ${status}`);
          }
          return response.json();
        })
        .then(() => {
          setUserPlan(updatedData);
          setEditedItemIndex(-1);
          setNewItemName("");
        })
        .catch((error) => {
          console.error("Error updating item:", error);
        });
    }
  };
  
  
  
  
  
  const deleteItem = (index) => {
    if (index !== -1) {
      const itemToDelete = userPlan[index];
  
      // Xóa mục khỏi API
      fetch(
        `https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App/${itemToDelete.id_plan}`,
        {
          method: "DELETE",
        }
      )
        .then(() => {
          // Cập nhật trạng thái dữ liệu sau khi xóa thành công
          const updatedData = [...userPlan];
          updatedData.splice(index, 1);
          setUserPlan(updatedData);
        })
        .catch((error) => {
          console.error("Lỗi khi xóa mục:", error);
        });
    }
  };
  
  
  
  

  return (
    <View style={styles.container}>
      {userPlan.map((item, index) => (
        <View
          key={item.id_plan}
          style={{
            flex: 1,
            paddingTop: 13,
            height: 48,
            width: 335,
            backgroundColor: "#DEE1E6",
            borderRadius: 20,
            paddingHorizontal: 15,
            marginBottom: 10,
            paddingRight: 59,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
         
         {editedItemIndex === index ? (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 100,
              }}
            >
              <TextInput
                style={{ flex: 1 }}
                value={newItemName}
                onChangeText={(text) => setNewItemName(text)}
              />
              <TouchableOpacity onPress={() => deleteItem(index)}>
                <Image
                  source={require("./assets/delete.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={updateItemName}>
                <Image
                  source={require("./assets/save.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16, flex: 1 }}>
                {item.job}
              </Text>
              <TouchableOpacity onPress={() => setEditedItemIndex(index)}>
                <Image
                  source={require("./assets/edit.png")}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function API_Screen_03({ navigation }) {
  const [newItemName, setNewItemName] = useState("");
  const [data, setData] = useState([]);

  const addItem = async () => {
    try {
      if (newItemName !== "") {
        const newItem = {
          plan: newItemName,
        };

        // Thêm mục vào API
        const response = await fetch(
          "https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newItem),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add item");
        }

        const responseData = await response.json();

        // Cập nhật trạng thái dữ liệu sau khi thêm thành công
        setData((prevData) => [...prevData, responseData]);
        setNewItemName("");

        // Chuyển hướng sau khi cập nhật dữ liệu
      }
    } catch (error) {
      console.error("Lỗi khi thêm mục:", error);
    }
    navigation.navigate("API_Screen_02");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          height: 40,
          width: 335,
          backgroundColor: "#DEE1E6",
          borderRadius: 20,
          paddingHorizontal: 15,
          marginBottom: 10,
          paddingRight: 59,
        }}
        placeholder="Enter new item name"
        onChangeText={(text) => setNewItemName(text)}
        value={newItemName}
      />
      <TouchableOpacity onPress={addItem}>
        <Image
          source={require("./assets/add.png")}
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>
    </View>
  );
}
export default function App() {
  var Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="API_Screen_01"
          component={API_Screen_01}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="API_Screen_02"
          component={API_Screen_02}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="API_Screen_03"
          component={API_Screen_03}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  editImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
    position: "absolute",
    right: 0,
  },
});
