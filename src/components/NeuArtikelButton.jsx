import React from 'react'

const NeuArtikelButton = ({handleSubmit}) => {

  return (
    <div className="flex space-x-4  justify-end">
            <div className="flex flex-col justify-end mb-1 mr-2">
              <button type="button"
              className='lg:bg-backgroundButton pt-2 pb-2 py-6 px-6 mb-4 mt-4 text-textColorButton hover:text-white hover:bg-[#2e85c5] float-right border rounded-lg !important sm:rounded-sm' style={{ borderRadius: '5px' }}
             onClick={handleSubmit}
              >Add Item</button>
            </div>

            
          </div>
  )
}

export default NeuArtikelButton
