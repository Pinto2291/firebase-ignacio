// Importar elementos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";

import { 
    getFirestore, 
    collection, 
    getDocs,
    addDoc,
} from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

let user_role = '';
let user_email = '';

export {user_role, user_email};

/*
import { firebaseConfig } from '../firebaseConfig.js';*/

const firebaseConfig = {
    apiKey: "AIzaSyAbZFytkjLNm4yT7UrOQLmizi6J-uq8utU",
    authDomain: "login-firebase-ignacio.firebaseapp.com",
    projectId: "login-firebase-ignacio",
    storageBucket: "login-firebase-ignacio.appspot.com",
    messagingSenderId: "321284691457",
    appId: "1:321284691457:web:7f52eed26549b590b81200",
};

// Inicializando Firebase
const app = initializeApp(firebaseConfig);

// llamar a la base de datos 
const db = getFirestore(app);

async function getUsers(database) {
    const userCollection = collection(database, 'users');
    const result = await getDocs(userCollection);
    const userList = result.docs.map(doc => doc.data());
    return userList;
}

try {
    getUsers(db).then(response => console.log(response));
} catch (err) {
    console.log(err);
}

// ======================= CODIGO DE PERPLEXITY ===========================

// Add login form submit event listener

const login_form = document.getElementById('loginForm');

login_form.addEventListener('submit', async (event) => {
    
    event.preventDefault();
    let email = document.getElementById('emailField').value;
    let password = document.getElementById('passwordField').value;
    let role = document.getElementById('roleField').value;

    try {

        // Check if the email already exists in the database
        const dbRef = collection(db, 'users');
        const snapshot = await getDocs(dbRef);
        const docs = snapshot.docs;

        for (const doc of docs) {

            if (doc.data().email === email) {

                if(doc.data().password === password && doc.data().role === role) {
                        // Email already exists, initiate login and show the other page
                        console.log('Usuario ya registrado. Iniciando sesión...');
                        alert("¡Bienvenido de nuevo! Correo: " + email);
                        // Redirect to new page
                        window.location.href = '../pantalla-inicio/pantalla-inicio.html';

                        user_role = doc.data().role;
                        user_email = doc.data().email;
                    
                        return ; // Exit the function
                    }
                    else {
                        alert("Contraseña o rol incorrectos");
                        return; // Exit the function
                    }
                } 
            }

        // Si el correo electronico no existe, proceder con el registro en la base de datos
        const docRef = await addDoc(collection(db, 'users'), {
            email: email,
            password: password,
            role: role,
        });

        console.log('documento escrito con ID', docRef.id);
        alert("¡Bienvenido! Correo: " + email);
        // Redirigir a la nueva pagina
        window.location.href = '../pantalla-inicio/pantalla-inicio.html';

    } catch(e) {
        console.error('error adding document:', e);
        alert("Error en el registro");
    }
});