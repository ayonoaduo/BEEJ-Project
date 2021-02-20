import React from 'react'
import {useState, useEffect} from 'react'
import {firebaseApp} from './firebase'

/* export const UserContext = React.createContext()

export const UserProvider = ( {children}) =>
{
    const [currentUser, setCurrentUser] = useState()
    useEffect(() =>{
        firebaseApp.auth().onAuthStateChanged((user)=>{
            setCurrentUser(user)
        })
    }, []);

    return <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
};
 */
