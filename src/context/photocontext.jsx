import React from 'react'
import { ProfileProvider } from './UserContext'
import Navbar from '../Components/Navbarcomponent/navbar'
import Profile from '../pages/Profile/profile'

const photocontext = () => {
  return (
    <>
   <ProfileProvider>
     <Navbar/>
     <Profile/>
     
   </ProfileProvider>
    </>
  )
}

export default photocontext
