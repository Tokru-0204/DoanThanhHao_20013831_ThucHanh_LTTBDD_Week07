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
  ScrollView,
  Platform,
  RadioButton,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CheckBox from "@react-native-community/checkbox";

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
            // borderColor: "#9095A0",
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
          GET STARTED ->
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
  const [data, setData] = useState([]);
  const [editedItemIndex, setEditedItemIndex] = useState(-1);
  const [deleteItemIndex, setDeleteItemIndex] = useState(-1);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    fetch("https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App")
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((user) => user.email === userEmail);
        setUser(user.id);
        setData(user);
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
      //console.log("userId:", userId);

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

      // console.log("Updated job:", newItemName);

      fetch(`https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: updatedData,
        }),
      })
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

  const deleteJob = (jobId) => {
    const UserId = user;
    const updatedData = [...userPlan];
    updatedData.splice(jobId, 1);

    fetch(`https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App/${UserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan: updatedData,
      }),
    })
      .then((response) => {
        if (!response || !response.ok) {
          const status = response ? response.status : "unknown";
          throw new Error(`HTTP error! Status: ${status}`);
        }
        return response.json();
      })
      .then(() => {
        // Update the React state with the modified data
        setUserPlan(updatedData);
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };
  const loadData = async () => {
    try {
      const response = await fetch(
        `https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const user = data.find((user) => user.email === userEmail);

      if (user) {
        setUserPlan(user.plan);
        setUser(user.id);
        setData(user);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "focus",
      () => {
        loadData();
      },
      [userEmail]
    );
    return unsubscribe;
  }, [navigation]);

  const Item = ({ job }) => (
    <View>
      <Text>{job}</Text>
    </View>
  );
  const handleRadioToggle = (index) => {
    const updatedUserPlan = [...userPlan];
    updatedUserPlan[index].status = !updatedUserPlan[index].status;
    setUserPlan(updatedUserPlan);
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("API_Screen_01")}
          style={{ paddingRight: 20, paddingLeft: 10, paddingTop: 10 }}
        >
          <Image
            source={require("./assets/back.png")}
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1, paddingLeft: 80 }}>
            <Image
              source={{ uri: data?.image }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 80 / 2,
                resizeMode: "cover",
              }}
            />
          </View>
          <View styles={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                color: "#9095A0, #DEE1E6 17%",
                fontWeight: "bold",
                paddingLeft: 22,
                paddingTop: 17,
              }}
            >
              Hi {data?.user_Name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "Epilogue",
                textAlign: "center",
                color: "#171A1F",
                opacity: 0.75,
                paddingLeft: 10,
              }}
            >
              Have agrate day a head
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 5,
          marginBottom: 60,
          width: 335,
          height: 44,
        }}
      >
        <Image
          source={require("./assets/search.png")}
          style={{ width: 22, height: 22, marginRight: 10, marginLeft: 10 }}
        />
        <TextInput
          style={{ flex: 1, height: 44, width: 335, borderRadius: 4 }}
          placeholder="Search"
          // onChangeText={(text) => setSearchText(text)}
          // value={searchText}
        />
      </View>
      <ScrollView style={{ height: 290 }}>
        {userPlan.map((item, index) => (
          <View
            key={item.id_plan}
            style={{
              // flex: 1,
              height: 48,
              width: 335,
              backgroundColor: "#DEE1E6",
              borderRadius: 24,
              paddingHorizontal: 15,
              marginBottom: 10,
              paddingRight: 59,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 5,
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
                <TouchableOpacity onPress={() => deleteJob(index)}>
                  <Image
                    source={require("./assets/delete.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={updateItemName}
                  style={{ paddingLeft: 7 }}
                >
                  <Image
                    source={require("./assets/save.png")}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                {/* <CheckBox
                  value={item.status}
                  onValueChange={() => handleCheckBoxToggle(index)}
                ></CheckBox> */}
                {/* <RadioButton
                  value={item.status}
                  status={item.status ? "checked" : "unchecked"}
                  onPress={() => handleRadioToggle(index)}
                /> */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flẽx-start",
                  }}
                >
                  {item.status ? (
                    <Image
                      source={require("./assets/check_true.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <Image
                      source={require("./assets/check_false.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  )}

                  <View style={{ paddingLeft: 8 }}>
                    <Item style={{}} job={item.job} />
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setEditedItemIndex(index)}
                    style={{ marginRight: -30 }}
                  >
                    <Image
                      source={require("./assets/edit.png")}
                      style={{ width: 20, height: 20 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={{
          flex: 2,
          flexDirection: "row",
          alignItems: "center",
          marginTop: -15,
        }}
        onPress={() =>
          navigation.navigate("API_Screen_03", { userEmail: userEmail })
        }
      >
        <Image
          source={require("./assets/add.png")}
          style={{ width: 55, height: 55 }}
        />
      </TouchableOpacity>
    </View>
  );
}
function API_Screen_03({ navigation, route }) {
  const [newItemName, setNewItemName] = useState("");
  const [userPlan, setUserPlan] = useState([]);
  const [user, setUser] = useState();
  const { userEmail } = route.params; // Extracting userEmail from the route params
  const reloadUserData = async () => {
    try {
      const response = await fetch(
        "https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      const user = data.find((user) => user.email === userEmail);

      if (user) {
        setUserPlan(user.plan);
        setUser(user);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  // useEffect(() => {
  //   // Load dữ liệu khi màn hình được tạo ra hoặc mỗi khi userEmail thay đổi
  //   reloadUserData();
  // }, [userEmail]);
  const addItem = async () => {
    try {
      if (newItemName.trim() !== "") {
        const newItem = {
          status: "true",
          job: newItemName,
          id_plan: String(userPlan.length), // Sử dụng độ dài mảng plan để tạo id mới
        };

        const response = await fetch(
          `https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App/${user.id}`, // Updated this line
          {
            method: "PUT", // Changed method to PUT since you're updating an existing resource
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...user, // Updated this line
              plan: [...user.plan, newItem], // Thêm mục mới vào mảng plan
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add item");
        }

        // Cập nhật trạng thái dữ liệu sau khi thêm thành công
        setUserPlan((prevData) => {
          const updatedUserPlan = prevData.map((u) => {
            if (u.email === userEmail) {
              return {
                ...u,
                plan: [...u.plan, newItem],
              };
            }
            return u;
          });
          return updatedUserPlan;
        });

        setNewItemName("");

        // Load lại dữ liệu từ API để cập nhật dữ liệu mới nhất
        reloadUserData();

        // Chuyển hướng sau khi cập nhật dữ liệu
        navigation.navigate("API_Screen_02", { userEmail: userEmail });
      }
    } catch (error) {
      console.error("Lỗi khi thêm mục:", error);
    }
  };

  useEffect(() => {
    // Load dữ liệu khi màn hình được tạo ra hoặc mỗi khi userEmail thay đổi
    reloadUserData();
  }, [userEmail]);
  return (
    <View style={styles.container}>
      <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "row", paddingRight: 60 }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Image
              source={{ uri: user?.image }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 80 / 2,
                resizeMode: "cover",
              }}
            />
            <View styles={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: "#9095A0, #DEE1E6 17%",
                  fontWeight: "bold",
                  paddingLeft: 22,
                  paddingTop: 17,
                }}
              >
                Hi {user?.user_Name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "Epilogue",
                  textAlign: "center",
                  color: "#171A1F",
                  opacity: 0.75,
                  paddingLeft: 10,
                }}
              >
                Have agrate day a head
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("API_Screen_02", { userEmail: userEmail })
          }
          style={{ paddingRight: 10, paddingLeft: 10, paddingTop: 10 }}
        >
          <Image
            source={require("./assets/back.png")}
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 8, justifyContent: "center", alignItems: "center" }}>
        <View style={{ flex: 1.5 }}>
          <Text
            style={{
              fontFamily: "Epilogue",
              fontWeight: 700,
              fontSize: 32,
              lineHeight: 48,
              textAlign: "center",
            }}
          >
            ADD YOUR JOB
          </Text>
        </View>
        <View style={{ flex: 1.5, marginRight:40, marginTop:-20}}>
          <TextInput
            style={{
              height: 44,
              width: 335,
              marginLeft: 40,
              borderWidth:1,
              borderRadius: 4,
              paddingLeft: 40,
              borderColor: "#9095A0",
            }}
            placeholder="input your job"
            onChangeText={(text) => setNewItemName(text)}
            value={newItemName}
          ></TextInput>
          <Image
            source={require("./assets/add_icon.png")}
            style={{
              width: 24,
              height: 24,
              position: "absolute",
              marginLeft: 50,
              top:10
            }}
          />
        </View>
        <View style={{ flex: 1.5 }}>
          <TouchableOpacity onPress={addItem} style={{width:190,height:44,backgroundColor:"#00BDD6", borderRadius:12}}>
            <Text style={{fontFamily:"Inter", fontWeight:400, fontSize:16, lineHeight:26, textAlign:"center",top:10, color:"#FFFFFF"}}>FINISH -></Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 3.5 }}>
          <Image
            source={require("./assets/book_header.png")}
            style={{ width: 170, height: 150 }}
          />
        </View>
      </View>
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
