import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets} from '../assets/assets'

const MyProfile = () => {

  
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)
  const [preview, setPreview] = useState(null)
  const [imageFile, setImagefile] = useState(null)
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'addressLine1' || name === 'addressLine2') {
      setUserData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name === 'addressLine1' ? 'line1' : 'line2']: value
        }
      }))
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagefile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  //remove photo (restore default photo)
  const handleRemovePhoto = async () => {
    try {
      const { data } = await axios.delete(backendUrl + '/api/user/remove-photo', {
      headers: { token }});


      if (data.success) {

        // clear preview and imageFile
        setPreview(null); 
        setImagefile(null);
        // restore to default image
        setUserData((prev) => ({
          ...prev,
          image: assets.upload_area,
        }))

        // reload fresh user data from backend if needed
        loadUserProfileData();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
   
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      const form = new FormData()
      form.append('name', userData.name)
      form.append('phone', userData.phone)
      form.append('address',
        JSON.stringify({
          line1: userData.address.line1,
          line2: userData.address.line2
        }))
      form.append('gender', userData.gender)
      form.append('dob', userData.dob)
      if (imageFile) form.append('image', imageFile);

      //send request to backend API
      const { data } = await axios.post(backendUrl + '/api/user/update-profile', form, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)

        //reload updated user data from backend
        loadUserProfileData();

        //update image preview immdediately
        if (preview) {
          setUserData((prev) => ({
            ...prev, image: preview,
          }))
        }
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message);
      
    }
  }

  //user default image if userData.image is missing
 const currentImage =
  preview ||
  (userData?.image && userData.image.trim() !== '' && userData.image !== 'undefined'
    ? userData.image
    : assets.upload_area);



  return userData && (
    <div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <div>
           <img className='w-36 rounded' src={currentImage} alt="" />
          
        </div>         
        <div className='flex flex-col items-start gap-6 md:w2/4 text-sm text-gray-600'>
          <p className='text-3xl text-neutral-800 font-medium mt-4'>{userData.name}</p> 
        </div>
      </div>


      <hr className='bg-zinc-400 h-[1px] border-none' />
      <div>
        <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Email id:</p>
          <p className='text-blue-500'>{userData.email}</p>
          <p className='font-medium'>Phone:</p>
          <p className='text-blue-400'>{userData.phone}</p>
          <p className='font-medium'>Address:</p>
          <p className='text-gray-500'>
            {userData.address.line1}
            <br />
            {userData.address.line2}
          </p>
        </div>
        <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
        <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
          <p className='font-medium'>Gender:</p>
          <p className='text-gray-500'> {userData.gender}</p>
          <p className='font-medium'>Birthday:</p>
          <p className='text-gray-500'> {userData.dob}</p>
        </div>
      </div>

      

      <div>
        <button onClick={() => setIsEdit(true)} className='border-primary border px-5 py-1 text-md rounded mt-10 overflow-hidden cursor-pointer hover:bg-primary hover:text-white transition-all'>Edit</button>
        {
          isEdit && (
            <div className='fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50 h-screen overflow-y-auto touch-auto'>
              <div className='bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-300'>
                <h2 className='text-xl font-semibold mb-4'>Update User Info</h2>
                <form onSubmit={handleSubmit} className='space-y-4' action="">

                  {/* Image Upload section */}
                  <div className="flex flex-col items-center">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      id="photoInput"
                      className="hidden"
                    />

                    {/* Clickable image */}
                    <label htmlFor="photoInput" className="cursor-pointer relative group">
                      <img
                        src={currentImage}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover border border-gray-300 transition-opacity group-hover:opacity-70"
                      />
                      {/* Camera icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7h4l2-3h6l2 3h4a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1zm9 3a4 4 0 100 8 4 4 0 000-8z"
                          />
                        </svg>
                      </div>
                    </label>

                     {/* Remove button (only show if user uploaded a custom image) */}
                     {(preview || (userData?.image && userData.image.trim() !== '')) && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="mt-2 px-3 py-1 text-sm border border-gray-400 rounded hover:bg-gray-200"
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input type="text"
                      name='name'
                      value={userData.name}
                      onChange={handleChange}
                      className='mt-1 w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <input 
                      name='phone'
                      value={userData.phone}
                      onChange={handleChange}
                      className='mt-1 w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Address</label>
                    <input
                      type="text"
                      name='addressLine1'
                      value={userData.address.line1}
                      onChange={handleChange}
                      className='mt-1 w-full border border-gray-300 rounded-md p-2'
                    />
                    <input
                      type="text"
                      name='addressLine2'
                      value={userData.address.line2}
                      onChange={handleChange}
                      className='mt-1 w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Gender </label>
                    <select name="gender" value={userData.gender} onChange={handleChange} className='mt-1 w-full border border-gray-300 rounded-md p-2'>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Birthday</label>
                    <input type="date"
                      name='dob'
                      value={userData.dob}
                      onChange={handleChange}
                      className='mt-1 w-full border border-gray-300 rounded-md p-2'
                    />
                  </div>

                  <div className='flex justify-end space-x-2'>
                    <button
                      type='button'
                      onClick={() => setIsEdit(false)}
                      className='px-4 py-2 bg-gray-300 hover:bg-red-400 hover:text-gray-950 transition-all rounded-md'>
                        Cancel
                    </button>
                    <button
                      type='submit'
                      className='px-4 py-2cursor-pointer bg-blue-300 hover:bg-primary hover:text-white transition-all rounded-md'>
                      Save
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )
        }
      </div>

    </div>
  )
}

export default MyProfile

