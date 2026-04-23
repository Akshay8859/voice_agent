"use client"
import { Button } from '@/components/ui/button'
import { Menu, ArrowLeft } from 'lucide-react';
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

    const path = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);
    return (
        <div className={`transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} h-full flex flex-col`}>
            <Sidebar className="h-full flex flex-col">
                <SidebarHeader className={`flex items-center relative ${collapsed ? 'justify-center' : ''}`}>
                    <button
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={`absolute left-2 top-2 z-10 p-1 rounded hover:bg-gray-200 transition ${collapsed ? '' : ''}`}
                        onClick={() => setCollapsed((c) => !c)}
                    >
                        {collapsed ? <Menu className="w-6 h-6" /> : <ArrowLeft className="w-6 h-6" />}
                    </button>
                    {!collapsed && (
                        <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[150px] ml-10'/>
                    )}
                    {!collapsed && <Button className='w-full mt-5 cursor-pointer ml-10'>+ Create New Interview</Button>}
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
                                                {!collapsed && <span className={`text-[16px] font-medium ${path == option.path && 'text-primary'}`}>{option.name}</span>}
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
        </div>
    )
}