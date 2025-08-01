import React from 'react'
import { ProfileProvider } from './UserContext'
import Navbar from '../Components/Navbarcomponent/navbar'
import Profile from '../pages/Profile/profile'
import Menu from '../Components/MenuComponent/menu'

const photocontext = () => {
  return (
    <>
   <ProfileProvider>
     <Navbar/>
     <Profile/>
     <Menu/>
   </ProfileProvider>
    </>
  )
}

export default photocontext
