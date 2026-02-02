"use client"
import { Button } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar'
import { SideBarOptions } from '@/services/Constants'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AppSidebar () {
    const path = usePathname();
    return (
        <Sidebar>
            <SidebarHeader className='flex items-center'>
                <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[150px]'/>
<<<<<<< Updated upstream
                <Button className='w-full mt-5 cursor-pointer'>+ Create New Interview</Button>
=======
                <Button className='w-full mt-5'>Create New Interview</Button>
>>>>>>> Stashed changes
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarContent>
                        <SidebarMenu>
                            {SideBarOptions.map((option, index) => (
                                <SidebarMenuItem key={index} className='p-1'>
                                    <SidebarMenuButton asChild className={`p-5 ${path == option.path && 'bg-primary/10'}`}>
                                        <Link href={option.path}>
                                            <option.icon className={`${path == option.path && 'text-primary'}`}/>
                                            <span className={`text-[16px] font-medium ${path == option.path && 'text-primary'}`}>{option.name}</span> 
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}