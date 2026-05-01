"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutGrid, 
  UserRound, 
  Box, 
  ArrowLeftRight, 
  ClipboardList,
  PieChart,
  Warehouse
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Panel de Control",
    url: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Trabajadores",
    url: "/trabajadores",
    icon: UserRound,
  },
  {
    title: "Análisis Personal",
    url: "/analisis-personal",
    icon: PieChart,
  },
  {
    title: "Inventario",
    url: "/inventario",
    icon: Box,
  },
  {
    title: "Movimientos",
    url: "/movimientos",
    icon: ArrowLeftRight,
  },
  {
    title: "Historial",
    url: "/historial",
    icon: ClipboardList,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Warehouse strokeWidth={1.5} className="h-6 w-6" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-bold tracking-tight text-primary">Gestor Stock</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Enterprise v1.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden font-bold text-[10px] uppercase tracking-wider px-4 mb-2">Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="h-10 rounded-lg transition-all duration-200 hover:bg-primary/5 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                  >
                    <Link href={item.url}>
                      <item.icon strokeWidth={1.5} className="h-5 w-5" />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4 text-[10px] text-muted-foreground font-medium group-data-[collapsible=icon]:hidden">
        <p>© 2024 Gestor de Stock</p>
      </SidebarFooter>
    </Sidebar>
  )
}
