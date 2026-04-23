import React from 'react'

function DashboardLayout({children}) {
  return (
    <div>
        <DashboardProvider>
          <div>
            {children}
          </div>
        </DashboardProvider>
    </div>
  )
}

export default DashboardLayout