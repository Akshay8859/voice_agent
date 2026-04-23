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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { LogOut, CreditCard, Bell, User, Sparkles } from "lucide-react"

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
            className='w-10 h-9 mx-auto mt-2 mb-2'
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
                <Button className="w-full cursor-pointer">
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

      {/* <SidebarFooter className="p-3">
        <div className="flex items-center gap-3">
          <Image
            src={user?.picture || '/ai.png'}
            alt="user"
            width={35}
            height={35}
            className="rounded-full"
          />

        {state === 'expanded' && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
        )}
        </div>
      </SidebarFooter> */}

      <SidebarFooter className="p-3">
        <DropdownMenu>
            {/* CLICKABLE USER AREA */}
            <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer rounded-md p-2 hover:bg-muted transition">
                <Image
                src={user?.picture || "/ai.png"}
                alt="user"
                width={35}
                height={35}
                className="rounded-full"
                />

                {state === "expanded" && (
                <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">
                    {user?.email}
                    </span>
                </div>
                )}
            </div>
            </DropdownMenuTrigger>

            {/* DROPDOWN CONTENT */}
            <DropdownMenuContent
            align="end"
            className="w-64 rounded-lg"
            >
            {/* USER INFO */}
            <div className="flex items-center gap-3 p-2">
                <Image
                src={user?.picture || "/ai.png"}
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

            <DropdownMenuSeparator />

            {/* MENU ITEMS */}
            <DropdownMenuItem className="cursor-pointer">
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Account
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
            </DropdownMenuItem>

            <DropdownMenuItem className="cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
