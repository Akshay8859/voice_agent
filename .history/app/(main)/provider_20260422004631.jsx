import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import { AppSidebar } from './_components/AppSideBar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'

function DashboardProvider({children}) {
  return (
    <SidebarProvider> 
      <AppSidebar />
      <main className="flex-1 p-4">
        
      </main>
      <SidebarTrigger/>
      <div className='w-full p-10'>
        <WelcomeContainer />
        {children}
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
