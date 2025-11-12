import React, { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import OmisePaymentModal from '../components/OmisePaymentModal'

const MyAppointment = () => {

  const [showPayment, setShowPayment] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

   //set date format from number to month name
  const [appointments, setAppointments] = useState([])
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1]) - 1] + ' ' + dateArray[2]
  }
  
  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse()); //recent appointments will be on top
      } else {
        toast.error("No appointments found.");
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)  
    }

  }

  //call backend for cancelling appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })
      if (data.success) {
        toast.success(data.message)
        //update user appointments
        getUserAppointments()
        getDoctorsData()

      } else {
        toast.error(data.message)
      }
      

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

//call API for online payment


  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
   }, [ token ])


  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointments</p>
      <div>
        {
          appointments.map((item,index) => (
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-sm'>{item.docData.address.line1}</p>
                <p className='text-sm'>{item.docData.address.line2}</p>
                <p className='text-sm mt-1'> <span className='text-sm font-medium text-neutral-700'>Date & Time:</span> {slotDateFormat(item.slotDate)} | { item.slotTime }</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && <button className='sm:min-w-49 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment && <button
                    onClick={() => {
                      setSelectedAppointment(item);
                      setPaymentAmount(item.amount);
                      setShowPayment(true);
                    }}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"> Pay Online </button>}
                {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                { item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment cancelled</button>}
              </div>
            </div>
          ))
        }
      </div>

      {/* Payment modal */}
      <OmisePaymentModal
        show={showPayment}
        onClose={() => setShowPayment(false)}
        amount={paymentAmount}
        appointmentId={selectedAppointment?._id}
        jwtToken={token}
        backendUrl={backendUrl}
        onPaymentSuccess={getUserAppointments} 
      />
    </div>
  )
}

export default MyAppointment
