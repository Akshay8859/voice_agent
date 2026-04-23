// "use client"
// import { Button } from '@/components/ui/button'
// import {
//     Sidebar,
//     SidebarContent,
//     SidebarGroup,
//     SidebarHeader,
//     SidebarFooter,
//     SidebarMenu,
//     SidebarMenuItem,
//     SidebarMenuButton,
// } from '@/components/ui/sidebar'
// import { SideBarOptions } from '@/services/Constants'
// import Image from 'next/image'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'

// export function AppSidebar () {
//     const path = usePathname();
//     return (
//         <Sidebar>
//             <SidebarHeader className='flex items-center'>
//                 <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[150px]'/>
//                 <Button className='w-full mt-5 cursor-pointer'>+ Create New Interview</Button>
//             </SidebarHeader>
//             <SidebarContent>
//                 <SidebarGroup>
//                     <SidebarContent>
//                         <SidebarMenu>
//                             {SideBarOptions.map((option, index) => (
//                                 <SidebarMenuItem key={index} className='p-1'>
//                                     <SidebarMenuButton asChild className={`p-5 ${path == option.path && 'bg-primary/10'}`}>
//                                         <Link href={option.path}>
//                                             <option.icon className={`${path == option.path && 'text-primary'}`}/>
//                                             <span className={`text-[16px] font-medium ${path == option.path && 'text-primary'}`}>{option.name}</span> 
//                                         </Link>
//                                     </SidebarMenuButton>
//                                 </SidebarMenuItem>
//                             ))}
//                         </SidebarMenu>
//                     </SidebarContent>
//                 </SidebarGroup>
//             </SidebarContent>
//             <SidebarFooter />
//         </Sidebar>
//     )
// }






"use client"

import { useUserDetail } from "@/app/provider"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

import { SideBarOptions } from "@/services/Constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const path = usePathname();
  const {user} = useUserDetail();
  const { state } = useSidebar(); // 'expanded' or 'collapsed'

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col items-center px-3 py-4">
        {state === 'collapsed' ? (
          <Image
            src={'/icon.png'}
            alt='logo icon'
            width={40}
            height={40}
            className='w-12 h-10 mx-auto mt-2 mb-2'
          />
        ) : (
            <>
                <Image
                    src="/logo.png"
                    alt="logo"
                    width={150}
                    height={80}
                    className="w-[140px] mt-2 mb-2"
                />
                <Button className="w-full mt-5 cursor-pointer">
                    + Create New Interview
                </Button>
            </>
        )}
      </SidebarHeader>
      <SidebarContent>
        {SideBarOptions.map((section, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>

            <SidebarMenu>
              {section.items.map((option, index) => {
                const isActive = path === option.path

                return (
                  <SidebarMenuItem key={index} className="py-1">
                    <SidebarMenuButton
                      asChild
                      className={`flex items-center gap-3 p-4 rounded-md transition-all
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                    >
                      <Link href={option.path}>
                        <option.icon
                          className={`h-5 w-5 ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-[15px] font-medium">
                          {option.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3">
          <Image
            src={user?.picture || '/ai.png'}
            alt="user"
            width={35}
            height={35}
            className="rounded-full"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
