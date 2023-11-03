import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image,TextInput } from 'react-native';
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
  var [data, setData] = useState([]); 
  useEffect(() => {
    fetch('https://654098fa45bedb25bfc22468.mockapi.io/ToDo_App')
      .then((response) => response.json())  
      .then((json) => {
          data = json;
          setData(json)
      });
  });
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View style={{paddingTop:13,height:48, width:335, backgroundColor:'#DEE1E6', borderRadius:20, paddingHorizontal:15, marginBottom:10, paddingRight:59}}>
          <Image source={require('./assets/check.png')} style={{width:20,height:20}} />
          <Text style={{position:'absolute', paddingLeft:30, fontWeight:'bold',fontSize:16}}>{item.plan}</Text>
        </View>
      )
      )   
    }
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
});
