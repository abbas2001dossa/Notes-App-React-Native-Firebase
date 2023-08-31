import {TouchableOpacity, FlatList,View,Button ,Text,TextInput , StyleSheet } from 'react-native';
import React,{useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Entypo} from '@expo/vector-icons';
import Tw from 'twrnc';
import {onAuthStateChanged, User } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { setId, setName } from '../Redux/NoteSlice';

const List = () => {

  const navigation = useNavigation();
  const [todo,setTodo]=useState('');
  const [todos,setTodos]=useState<any[]>([]);
  const [user,setUser]= useState<User | null>(null);
  const dispatch = useDispatch();

  useEffect(()=>{
    onAuthStateChanged(FIREBASE_AUTH, (user)=>{
    //   console.log('user ' ,user?.uid);
      setUser(user);
    });
  },[]);


  useEffect(()=>{
    // created a reference 
    const todoRef = collection(FIRESTORE_DB , 'TODO - DATA');

    // using snapshot to get real time data form the hosted database 
    const subscriber = onSnapshot(todoRef , {
        next: (snapshot) =>{
            const todos: any [] =[];
            snapshot.docs.forEach((doc)=>{
                console.log(doc.data().userid);
                if (doc.data().userid == user?.uid){
                    todos.push({
                        id: doc.id,
                        ...doc.data(),
                    });
                }
            }); 
            setTodos(todos);
            // console.log(" THis ")
        },
    });

    return ()=> subscriber();

  },[user]);

  const display =({item}:any)=> {

    const ref = doc(FIRESTORE_DB,`TODO - DATA/${item.id}`);
    const toggleDone = async ()=>{
        try {
            updateDoc(ref, {done : !item.done });
        }
        catch(error){
            console.log(error);
        }
        
    }
    
    const deleteItem = async ()=>{
        deleteDoc(ref);
    }      
      
    function openDetails(name: string) {
        try {
          // need to maintain redux here
          dispatch(setName(name));
          dispatch(setId(item.id));
          navigation.navigate("Details");
        } catch (error) {
          console.log(error);
        }
      }
      

    return (
        <>
        <View style={Styles.todoContainer}>
            <TouchableOpacity
                onPress={toggleDone}
                style={Styles.touchableOpacityStyle}
            >
                {item.done && <Ionicons name='md-checkmark-circle' color={"green"} size={24}></Ionicons>}
                {!item.done && <Entypo name='circle' size={24} color={"black"}></Entypo>}
                <Text style={Styles.todoText}> {item.title} </Text>
            </TouchableOpacity>
            <Ionicons onPress={()=> openDetails(item.title)} style={Tw`mr-5`} name='book' size={24} color={"grey"}></Ionicons>
            <Ionicons name='trash-bin-outline' size={24} color={"red"} onPress={deleteItem}></Ionicons>
            
        </View>
        
    
        
        </>
    )
  }


  const addtodoList = async ()=>{
    const doc = await addDoc(collection(FIRESTORE_DB,'TODO - DATA'), { title: todo , done: false , userid : user?.uid , BigText:''});
    console.log(" WHEN PRESSED    " + doc);
    setTodo('');
  }


  return (
    <View style={Styles.container}>
      
      <View style={Styles.form}>
        <TextInput style={Styles.input} placeholder='Add New Note ' onChangeText={(text:string)=> setTodo(text)} 
            value={todo}
        />
        <Button  onPress={addtodoList} title='Add Note ' disabled={!todo} />
      </View>

        {/* results */}
        {todos.length > 0 &&(
       <View style={Styles.results}>
            <FlatList data={todos} keyExtractor={(item)=> item.id} renderItem={display}></FlatList>
       </View>
       )}
    

        <View style={Tw`font-bold rounded-md z-50 absolute bottom--20 items-center bg-blue-300 shadow-lg p-4 rounded ml-70`} >            
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Sign Out" />
        </View> 
             
    </View>

    
  )
}

export default List;

const Styles= StyleSheet.create({
    container:{
        marginHorizontal:20,
    },
    form:{
        flexDirection:'row',
        padding:20,
        alignItems:'center',
    },
    input:{
        flex:1,
        height:40,
        borderWidth:1,
        borderRadius:9,
        marginRight:10,
        padding:10,
        backgroundColor:'#fff'
    },
    button:{
        borderRadius:9
    },
    results:{

    },
    touchableOpacityStyle:{
        flexDirection:'row',
        flex:1,
        alignItems:'center'
    },
    todoText:{
        paddingHorizontal:4,
    },
    todoContainer:{
      flexDirection:'row',
      alignItems:'center',
      backgroundColor:'#fff',
      padding:10,
      marginVertical:4
    }


});