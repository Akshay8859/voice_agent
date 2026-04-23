import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'
import { AppSidebar } from './_components/AppSidebar'

function DashboardProvider({children}) {
  return (
    <SidebarProvider> 
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger/>
        <div className='w-full p-5'>
          <WelcomeContainer />
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}

export default DashboardProvider
