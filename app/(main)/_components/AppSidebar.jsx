import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
} from '@/components/ui/sidebar'
import Image from 'next/image'

export function AppSidebar () {
    return (
        <Sidebar>
            <SidebarHeader className='flex items-center mt-5'>
                <Image src={'/logo.png'} alt='logo' width={200} height={100} className='w-[150px] mb-4'/>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup/>
                <SidebarGroup/>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}