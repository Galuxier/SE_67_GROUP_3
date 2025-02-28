import React from 'react'

const Login = () => {
  return (
    <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h1 className='text-3xl block text-center font-semibold py-2'>Login</h1>
        <hr></hr>
        <div className='mb-4'>
          <input
            type='text'
            className='w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500'
            placeholder='Email/Username'
          />
        </div>

        <div className='mb-4'>
          <input
            type='password'
            className='w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:border-pink-500'
            placeholder='Password'
          />
        </div>

        <div>
          <button className='w-full bg-rose-600 border rounded py-2 px-3 focus:outline-none'>
            <label className='text-white'>LOGIN</label>
          </button>
        </div>

        <div>
          <label className='block text-center py-2 text-rose-600'>Forgot Password</label>
        </div>
        <hr className='bg-red-500 border-red-500'></hr>
        <div>
          <labele className='block text-center py-2 text-rose-600'>Regist</labele>
        </div>
      </div>
  )
}

export default Login;
