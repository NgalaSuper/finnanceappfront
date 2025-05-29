import React from 'react'
import { useNavigate } from 'react-router-dom'

const CancelButton = () => {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate('/')
  }
  return (
    <div>
      <button type="text"
          onClick={handleCancel}
      className='lg:bg-backgroundButtonCancel border-borderButtonCancel pt-2 pb-2 py-6 px-6  mb-4 mt-4 text-textColorCancel hover:bg-[#EEEDF3] float-right border  sm:rounded-sm' style={{ borderRadius: '5px' }} >Cancel</button>
    </div>
  )
}

export default CancelButton
