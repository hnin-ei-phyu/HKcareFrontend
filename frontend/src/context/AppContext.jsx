// AppContext.jsx
import { createContext, useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    //state variables to store user Autentication token
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    //to store User data
    const [userData, setUserData] = useState(false)


    

    //arrow function to fetch data from backend
    const getDoctorsData = async () => { 
        try {
            
            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else { 
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
            
        }
    }

    //function to get user data from backend
    const loadUserProfileData = async () => {
        try {
            
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            
            if (data.success) {
                setUserData(data.data)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    }



    //call the function when the component mounts
    useEffect(() => {
        getDoctorsData()
    }, [])
    
    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider