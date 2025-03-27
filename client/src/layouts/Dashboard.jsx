import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className='bg-white'>
      <div className="container mx-auto p-3 grid lg:grid-cols-[250px,1fr]">
          {/* left */}
          <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto hidden lg:block border-r'>
            <UserMenu />
          </div>
          {/* right */}
          <div className='bg-white min-h-[75px]'>
            <Outlet />
          </div>
      </div>
    </section>
  )
}

export default Dashboard