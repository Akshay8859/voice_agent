import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from './_components/AppSideBar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'

function DashboardProvider({children}) {
  return (
    <SidebarProvider> 
      <AppSidebar />
<<<<<<< Updated upstream
      <SidebarTrigger/>
      <div className='w-full p-10'>
        <WelcomeContainer />
=======
      <div className='w-full'>
        <SidebarTrigger />
>>>>>>> Stashed changes
        {children}
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
