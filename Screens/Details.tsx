import {Button, TextInput,View, Text } from 'react-native'
import React,{useState,useEffect} from 'react'
import {onAuthStateChanged, User } from 'firebase/auth';
import Tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Entypo} from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../firebaseConfig';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { SelectId, SelectName } from '../Redux/NoteSlice';

const Details = () => {
    const [text,setText]=useState('');
    const [todos,setTodos]=useState<any[]>([]);
    const [saved,setSaved]=useState(false);
    const [user,setUser]= useState<User | null>(null);
    // const [noteName , setNoteName] = useState('');
    const NoteName = useSelector(SelectName);
    const NoteId = useSelector(SelectId);
    // console.log(" HEHEH THIS IS NAME : " + NoteName);
    // console.log(" This is ID " + NoteId);
    //  user?.email

    useEffect(()=>{
        onAuthStateChanged(FIREBASE_AUTH, (user)=>{
        console.log('user ' ,user?.uid);
        setUser(user);
        });
    },[]);

    useEffect(() => {
      
      const todoRef = collection(FIRESTORE_DB , 'TODO - DATA');

      // using snapshot to get real time data form the hosted database 
      const subscriber = onSnapshot(todoRef , {
          next: (snapshot) =>{
              const todos: any [] =[];
              snapshot.docs.forEach((doc)=>{
                  // console.log(doc.data().userid);
                  // console.log(doc.data());
                  if (doc.data().userid == user?.uid && doc.data().title == NoteName){
                      todos.push({
                          id: doc.id,
                          ...doc.data(),
                      });
                  }
              }); 
              setTodos(todos);
              // console.log("this")
              // console.log(todos[0].BigText);
          },
      });

      // overhere need to set text as -- todos.text
      
      return ()=> subscriber();

    }, [user]);
    
    useEffect(()=>{
      if (todos.length >0){
      setText(todos[0].BigText);
      }
    },[todos]);
    
    const deletetext =()=>{
      setText('');
    }

    const saveButtonPress= async ()=>{
      setSaved(true);
      // gotta update database here bruh
      const ref = doc(FIRESTORE_DB,`TODO - DATA/${NoteId}`);
      updateDoc(ref, {BigText : text});

    }

    const changeText=()=>{
      setSaved(false);
    }

  return (
    <View style={Tw`p-2  items-center`}>

      <View style={Tw`bg-white rounded-lg shadow p-4 w-98 border `}>
        <Text style={Tw`text-[#00CCBB] text-lg font-bold `}> Email : <Text style={Tw`text-black`}>{user?.email} </Text></Text>
        <Text style={Tw`text-[#00CCBB] text-lg font-bold`}> Note  : <Text style={Tw`text-black`}> {NoteName}</Text></Text>
      </View>

      <View style={Tw``}>
        <View style={Tw`bg-gray-300 mt-5 rounded w-98 border h-8 shadow `}>
          <View style={Tw`flex-row p-1 items-center`}> 
              <Ionicons style={Tw`flex-1 mx-3`} name='albums' size={24} color="black"></Ionicons>
              {/* <Ionicons ></Ionicons> */}
              <Ionicons name='trash-bin-outline' size={24} color={"black"} onPress={deletetext}></Ionicons>
          </View>
        </View>
        <TextInput 
          style={Tw`bg-white rounded p-4  w-98 border shadow h-140 font-semibold `}
          multiline
          placeholder='Type Something ...'
          onChange={changeText}
          value={text}
          onChangeText={(text)=> setText(text)}
          textAlignVertical='top'
        >
        </TextInput>

        <View style={Tw`w-20 ml-75 shadow rounded-lg mt-1  h-10`}>
          <Button  title={saved ? 'Saved' : 'Save'} onPress={saveButtonPress} ></Button>
        </View>

      </View>
      
    </View>
  )
}

export default Details