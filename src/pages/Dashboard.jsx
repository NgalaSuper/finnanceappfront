import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
           <NavBar setSearch={setSearchTerm} 
           setSearchTerm={setSearchTerm}/>
   
      <div className='flex h-full'>
      <SideBar />
      <section className='flex-1 mt-3 h-screen'> 
      <Outlet context={{ searchTerm }} />
      </section>
      </div>
    </>
  )
}

export default Dashboard
