//Doctors.jsx
import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useState } from 'react'
import { Search } from 'lucide-react'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const navigate = useNavigate(AppContext)
  const { doctors } = useContext(AppContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilter, setShowFilter] = useState(false)

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
    "Cardiologist"
  ]
  specialities.sort((a,b) => a.localeCompare(b, undefined, { sensitivity: 'base'}))
  
  const applyFilter = () => {

    /* Style 1
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
     setFilterDoc(doctors)
    } */
    //Style2, better for sorting
    let filtered = []
    if (speciality) {
      filtered = doctors.filter(doc => doc.speciality === speciality)
    } else {
      filtered = [...doctors]
    }
    //Sort by speciality, then name
    filtered.sort((a, b) => {
      const specialityCompare = a.speciality.localeCompare(b.speciality)
      if (specialityCompare !== 0) return specialityCompare
      return a.name.localeCompare(b.name)
    })

    //Filter by name search
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilterDoc(filtered)
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality,searchTerm])

  return (
    <div>
      <div className='flex'>
        <p className='text-gray-600 mt-4 mb-2 w-full sm:w-1/2'>Browse through the doctors specialist.</p>
        {/* Add a Search Input Bos to the UI */}
        <div className='relative mt-4 mb-2 w-full sm:w-1/2'>
          <input
            type="text"
            placeholder='Search by name'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-200'
          />
          <Search className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
        </div>
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={() => setShowFilter(prev => !prev)}> Filters</button>
        
        {/* Two methods for specialist filter */}
            {/* <div className='flex flex-col gap-4 texgt-sm text-gray-600'>
              <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={ `w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "General physician" ? "bg-indigo-100 text-black" : ""}`}>General physician</p>
              <p onClick={()=> speciality === 'Gynecologist' ? navigate('/doctors') : navigate('/doctors/Gynecologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""}`}>Gynecologist</p>
              <p onClick={()=> speciality === 'Dermatologist' ? navigate('/doctors') : navigate('/doctors/Dermatologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""}`}>Dermatologist</p>
              <p onClick={()=> speciality === 'Pediatricians' ? navigate('/doctors') : navigate('/doctors/Pediatricians')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""}`}>Pediatricians</p>
              <p onClick={()=> speciality === 'Neuroenterologist' ? navigate('/doctors') : navigate('/doctors/Neuroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Neuroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Neuroenterologist</p>
              <p onClick={()=> speciality === 'Gastroenterologist' ? navigate('/doctors') : navigate('/doctors/Gastroenterologist')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Gastroenterologist" ? "bg-indigo-100 text-black" : ""}`}>Gastroenterologist</p>
            </div> */}
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          {specialities.map((item, index) => (
            <p key={index}
              onClick={() => speciality === item ? navigate('/doctors') : navigate(`/doctors/${item}`)}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === item ? "bg-indigo-100 text-black" : ""}`}
            >
                {item}
              </p>
            ))}
        </div>

        <div className='w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
          {
            filterDoc.map((item,index) => (
                  <div onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                      <img className='bg-blue-50' src={item.image} alt="" />
                      <div className='p-4'>
                           <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'} `}>
                              <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-gray-500'}  rounded-full`}></p><p>{ item.available ? 'Available': 'Unavilable' }</p>
                          </div>
                          <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                          <p className='text-gray-600 text-sm'>{item.speciality}</p>
                      </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors
