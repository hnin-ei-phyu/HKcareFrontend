import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const navigate = useNavigate()

    const { token, setToken, userData } = useContext(AppContext)

    const [showMenu, setShowMenu] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)

    //get user image
    const getUserImage = () => {
        return userData?.image && userData.image.trim() !== null ? userData.image : assets.upload_area;
    }

    //for logout functionality
    const logout = () => { 
        setToken(false)
        localStorage.removeItem('token')
        navigate('/')
    }

  return (
    <div className='relative'>
        <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 md:px-10'>
              <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
              
              

              {/* Desktop menu */}
             <ul className='hidden md:flex items-flex-start gap-5 '>
              <NavLink to='/'>
                  <li className='py-1'>HOME</li>
                  <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
              </NavLink>
              <NavLink to='/doctors'>
                  <li className='py-1'>ALL DOCTORS</li>
                  <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
              </NavLink>
              <NavLink to='/about'>
                  <li className='py-1'>ABOUT</li>
                  <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
              </NavLink>
              <NavLink to='/contact'>
                  <li className='py-1'>CONTACT</li>
                  <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
              </NavLink>
             </ul>
              
            {/* Profile / Login button */}
            <div className='flex items-center gap-4'>
              {
                  token && userData
                     ? (
                        <div className='flex items-center gap-2 cursor-pointer relative' onClick={()=> setDropdownOpen((prev) => !prev)}>
                          <img className='w-8 rounded-full' src={getUserImage()} alt="" />   
                          <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                              
                          {/* Dropdown */}
                              {
                                  dropdownOpen && (
                                    <div className='absolute top-12 right-0 text-base font-medium text-gray-600 z-20'>
                                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                                            <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer' >My Profile</p>
                                            <p onClick={()=>navigate('/my-appointment')} className='hover:text-black cursor-pointer' >My Appointment</p>
                                            <p onClick={logout} className='hover:text-black cursor-pointer' >Log Out</p>
                                        </div>
                                    </div>
                                  )
                            }
                        </div>
                          ) : (
                               <button onClick={()=>navigate('/login')} className='bg-primary text-white px-4 py-3 rounded-full font-light'>Create account</button>
                      )
              }
              </div>
              
              {/* Hamburger menu for small screens */}
              <div className='md:hidden cursor-pointer' onClick={() => setShowMenu(!showMenu)}>
                  <img className='w-6' src={assets.menu_icon} alt="" />
              </div>
          </div>
          
          {/* Mobile nav menu */}
          {showMenu && (
              <ul>
                  <NavLink to='/' onClick={() => setShowMenu(false)}>
                      <li className='py-2'>HOME</li>
                  </NavLink>
                  <NavLink to='/doctors' onClick={() => setShowMenu(false)}>
                      <li className='py-2'>ALL DOCTORS</li>
                  </NavLink>
                  <NavLink to='/about' onClick={() => setShowMenu(false)}>
                      <li className='py-2'>ABOUT</li>
                  </NavLink>
                  <NavLink to='/contact' onClick={() => setShowMenu(false)}>
                      <li className='py-2'>CONTACT</li>
                  </NavLink>
              </ul>
          )}
    </div>
  )
}

export default Navbar
