import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Pages/Navigation/Navbar'
import Footer from '../Pages/Home/Footer'

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}