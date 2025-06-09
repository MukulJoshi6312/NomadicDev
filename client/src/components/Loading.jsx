import React from 'react'

const Loading = () => {
  return (
    <div className='w-screen h-screen fixed top-0 left-0 bg-white flex justify-center items-center z-50'>
      <div className="spinner"></div>
    </div>
  )
}

export default Loading
