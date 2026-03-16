// NavProjects component — momenteel uitgeschakeld (uitgecommentarieerd)
// Dit component toonde vroeger een lijst van projecten in de zijbalk
// met dropdown acties zoals verwijderen en doorsturen

// "use client";

// import {
//   Folder,
//   Forward,
//   MoreHorizontal,
//   Trash2,
//   type LucideIcon,
// } from "lucide-react";
// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuAction,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";

// // Projecten navigatie component voor de zijbalk
// // projects: lijst van projecten met naam, URL en icoon
// export function NavProjects({
//   projects,
// }: {
//   projects: {
//     name: string;
//     url: string;
//     icon: LucideIcon;
//   }[];
// }) {
//   // Haal de mobiele status op uit de zijbalk context
//   const { isMobile } = useSidebar();

//   return (
//     // Groep verborgen als de zijbalk is ingeklapt naar pictogramweergave
//     <SidebarGroup className="group-data-[collapsible=icon]:hidden">
//       <SidebarGroupLabel>Projects</SidebarGroupLabel>
//       <SidebarMenu>
//         {projects.map((item) => (
//           <SidebarMenuItem key={item.name}>
//             <SidebarMenuButton asChild>
//               <a href={item.url}>
//                 <item.icon />
//                 <span>{item.name}</span>
//               </a>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         ))}
//         <SidebarMenuItem>
//           <SidebarMenuButton className="text-sidebar-foreground/70">
//             <MoreHorizontal className="text-sidebar-foreground/70" />
//             <span>More</span>
//           </SidebarMenuButton>
//         </SidebarMenuItem>
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }
