import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image,TextInput, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function API_Screen_01({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require('./assets/book_header.png')} style={{width:271, height:271}} />
      <Text style={{textAlign:'center'}}>MANAGE YOUR {'\n'} TASK</Text>
      <View>
        
        <TextInput style={{}} placeholder='Name'></TextInput>
        <Image style={{width:20,height:20, position:'absolute'}} source={require('./assets/Frame.png')} />
      </View>
      <Button
        title="Go to Screen 02"
        onPress={() => navigation.navigate('API_Screen_02')}
      />
    </View>
  );
}
function API_Screen_02({ navigation }) {
  const [data, setData] = useState([]);
  const [editedItemIndex, setEditedItemIndex] = useState(-1);
  const [deleteItemIndex, setDeleteItemIndex] = useState(-1); // Thêm trạng thái để xóa mục
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    fetch('https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App')
      .then((response) => response.json())
      .then((json) => {
        setData(json);
      });
  }, []);

  const updateItemName = () => {
    if (editedItemIndex !== -1) {
      const updatedData = [...data];
      updatedData[editedItemIndex].plan = newItemName;

      // Update the API data
      fetch(`https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App/${updatedData[editedItemIndex].id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData[editedItemIndex]),
      })
        .then((response) => response.json())
        .then(() => {
          setData(updatedData);
          setEditedItemIndex(-1);
          setNewItemName('');
        })
        .catch((error) => {
          console.error('Error updating item:', error);
        });
    }
  };

  const deleteItem = (index) => {
      const itemToDelete = data.find((item) => item.id === item.id);
      if (index !== -1) {
        const itemToDelete = data[index];
    
        // Xóa mục khỏi API
        fetch(`https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App/${itemToDelete.id}`, {
          method: 'DELETE',
        })
          .then(() => {
            // Cập nhật trạng thái dữ liệu sau khi xóa thành công
            const updatedData = data.filter((item) => item.id !== itemToDelete.id);
            setData(updatedData);
          })
          .catch((error) => {
            console.error('Lỗi khi xóa mục:', error);
          });
      }
  };
  
  
  
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={item.id} style={{ paddingTop: 13, height: 48, width: 335, backgroundColor: '#DEE1E6', borderRadius: 20, paddingHorizontal: 15, marginBottom: 10, paddingRight: 59, flexDirection: 'row', alignItems: 'center' }}>
          {editedItemIndex === index ? (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 100 }}>
              <TextInput
                style={{ flex: 1 }}
                value={newItemName}
                onChangeText={(text) => setNewItemName(text)}
              />
              <TouchableOpacity onPress={() => deleteItem(index)}>
                <Image source={require('./assets/delete.png')} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={updateItemName}>
                <Image source={require('./assets/save.png')} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, flex: 1 }}>{item.plan}</Text>
              <TouchableOpacity onPress={() => setEditedItemIndex(index)}>
                <Image source={require('./assets/edit.png')} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
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
            headerTitle: 'Custom Header Title',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%',
  },
  editImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
    position:'absolute',
    right:0,
  },
});
