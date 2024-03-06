import {initializeApp} from 'firebase/app'
import {
  getFirestore, collection, getDocs, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  getDoc,
  updateDoc
} from 'firebase/firestore'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBREVZY33mwdPbqkhSELwfK1p6Ie6nMYgE",
    authDomain: "fir-tutorial-d1711.firebaseapp.com",
    projectId: "fir-tutorial-d1711",
    storageBucket: "fir-tutorial-d1711.appspot.com",
    messagingSenderId: "302364111314",
    appId: "1:302364111314:web:7572c18e54a82c3bda980b"
  }

  //initialize firbase app
  initializeApp(firebaseConfig)

  //initialize services
  const db = getFirestore()
  const auth = getAuth()

  //collection ref
  const collectionRef = collection(db, 'books')

  //queries: to write the query we call the query() function which accepts two arguments; collectionReference and the where() function.
  //The where() function accepts three string variables, the field to check for, the operator for comparison check and the value of the field to compare with
  const q = query(collectionRef, where("author", "==", "Patrick Rothfuss"))

  //query to find and order query by title
  const qr = query(collectionRef,  where("author", "==", "Patrick Rothfuss"), orderBy('title', 'desc'))

  //query to find and order query by time stamp
  const qT = query(collectionRef, orderBy('createdAt'))

  // //get collection : this gets the data once
  // getDocs(collectionRef)
  // .then((snapshot)=> {
  //   let books = [] //created a arry to store the data from the db
  //   snapshot.docs.forEach((doc) => {  //using forEach to iterate through the data from the db
  //     books.push({...doc.data(), id: doc.id})  //storing the data into the array
  //   })
  //   console.log(books)
  // })
  // .catch(err => {
  //   console.log(err) //catching errors and logging it
  // })

  //get real time collection data: this get the data everytime there is a change.
  // onSnapshot(collectionRef, (snapshot) => {
  //   let books = []
  //   snapshot.docs.forEach((doc) => {  //using forEach to iterate through the data from the db
  //     books.push({...doc.data(), id: doc.id})  //storing the data into the array
  //   })
  //   console.log(books)
  // })

  //getting real time collection with the queries
  // onSnapshot(q, (snapshot) => {
  //   let books = []
  //   snapshot.docs.forEach((doc) => {  //using forEach to iterate through the data from the db
  //     books.push({...doc.data(), id: doc.id})  //storing the data into the array
  //   })
  //   console.log(books)
  // })

  //getting real time collection with the queries and ordering the data
  const unsubCol = onSnapshot(qT, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {  //using forEach to iterate through the data from the db
      books.push({...doc.data(), id: doc.id})  //storing the data into the array
    })
    console.log(books)
  })

  //adding documents
  const addBookForm = document.querySelector('.add') //getting the add book cssSelector, in this case the classname of the add book form
  addBookForm.addEventListener('submit', (e) => { //function for what should be done when the submit event handler is trigger
    e.preventDefault();  // prevent default which is refresh

    addDoc(collectionRef, {
      title: addBookForm.title.value,
      author: addBookForm.author.value,
      createdAt: serverTimestamp()
    })  // use the addDoc function from firestore to add new document to the db. the function takes two argument collection reference and an object. The object contains the fields and the value of the fields for the document. The value of the fields title and author were retrieve from user's input
    .then(()=>{
      addBookForm.reset()
    })
  })

  //deleting documents
  const deleteBookForm = document.querySelector('.delete') //getting the delete book cssSelector, in this case the classname of the delete book form
  deleteBookForm.addEventListener('submit', (e) =>{//function for what should be done when the submit event handler is trigger
    e.preventDefault();  // prevent default which is refresh

    const docRef = doc(db, 'books', deleteBookForm.id.value) 
    // initializing document reference, what helps to identify the document.
    //To do this, we use the doc function from firestore, it accepts three argument: the database, collectionName and the id of the document (this was gotten from user's input)

    deleteDoc(docRef) // using the deleteDoc functionn from firestore, we can delete a document. the deleteDoc() accepts ana rgument which is the docRef.
    .then(() => {
      deleteBookForm.reset()
    })
  })

  //get a single document
  const docRef = doc(db, 'books', '8CMuUwhmMfQfSdWimHh0') //create a documnet reference similiar to the one created for delete function

  // getDoc(docRef)  //use the getDoc() function which accepts docRef to get the document in the db
  // .then((doc) => {  //since the getDoc() returns a promise, use the .then() to await the result form the db and log the result to the console
  //   console.log(doc.data(), doc.id)
  // })

  //the code below will help to get real time data for teh single document we got, i.e. when there is an update on the single document, forebase will return the udpdated document
  const unsubDoc= onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
  })

  //updating a document
  const updateForm = document.querySelector('.update')
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    let docRef = doc(db, 'books', updateForm.id.value)
    
    updateDoc(docRef, {
      title: 'updated title'
    })
    .then(() => {
      updateForm.reset()
    })
  })



  //sign up
  const signupForm = document.querySelector('.signup')
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        console.log('user created: ', cred.user)
        signupForm.reset()
      })
      .catch((err) =>{
        console.log(err.message)
      })
  })

  //logging in and out
  const logoutButton = document.querySelector('.logout')
  logoutButton.addEventListener('click', () => {
    signOut(auth)
      .then(() =>{
        // console.log('the user signed out')
      })
      .catch((err) => {
        console.log(err.message)
      })
  })

  const loginForm = document.querySelector('.login')
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value //email: mario@netninja.com; luigi@netninja.com
    const  password = loginForm.password.value //password: test1234; test12345

    signInWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        // console.log('user logged in: ', cred.user)
      })
      .catch((err) => {
        console.log(err.message)
      })

  })

  //subscribe to auth
  const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user)
  })

  //unsubscribing from changes(auth & db)
  const unsubButton = document.querySelector('.unsub')
  unsubButton.addEventListener('click', ()=>{
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
  })