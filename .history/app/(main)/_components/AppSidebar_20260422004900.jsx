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

import { useState } from "react"
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
} from "@/components/ui/sidebar"

import { SideBarOptions } from "@/services/Constants"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

export function AppSidebar() {
  const path = usePathname()
  const [openMenu, setOpenMenu] = useState<string | null>("Playground")

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="flex flex-col items-center">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={100}
          className="w-[150px]"
        />
        <Button className="w-full mt-5 cursor-pointer">
          + Create New Interview
        </Button>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        {SideBarOptions.map((section, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>

            <SidebarMenu>
              {section.items.map((item, index) => {
                const isActive = path === item.path

                // 👉 If item has children (like Playground)
                if (item.children) {
                  const isOpen = openMenu === item.name

                  return (
                    <div key={index}>
                      <SidebarMenuItem className="p-1">
                        <SidebarMenuButton
                          onClick={() =>
                            setOpenMenu(isOpen ? null : item.name)
                          }
                          className="p-5"
                        >
                          <item.icon />
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`ml-auto h-4 w-4 transition ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* SUB MENU */}
                      {isOpen && (
                        <div className="ml-6 border-l pl-4 space-y-2">
                          {item.children.map((sub, i) => (
                            <Link
                              key={i}
                              href={sub.path}
                              className={`block text-sm ${
                                path === sub.path
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                // 👉 Normal item
                return (
                  <SidebarMenuItem key={index} className="p-1">
                    <SidebarMenuButton
                      asChild
                      className={`p-5 ${
                        isActive ? "bg-primary/10" : ""
                      }`}
                    >
                      <Link href={item.path}>
                        <item.icon
                          className={isActive ? "text-primary" : ""}
                        />
                        <span
                          className={`text-[16px] font-medium ${
                            isActive ? "text-primary" : ""
                          }`}
                        >
                          {item.name}
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

      {/* FOOTER */}
      <SidebarFooter>
        <div className="flex items-center gap-3 px-2 py-2">
          <Image
            src="https://github.com/shadcn.png"
            alt="user"
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">shadcn</span>
            <span className="text-xs text-muted-foreground">
              m@example.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}