// Importeer de zijbalk component
import AppSidebar from "@/components/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// Importeer zijbalk UI-componenten voor de layout
import {
  SidebarInset,        // Container voor de hoofdinhoud naast de zijbalk
  SidebarProvider,     // Context provider voor zijbalkstatus
  SidebarTrigger,      // Knop om de zijbalk te openen/sluiten
} from "@/components/ui/sidebar";

// Dashboard pagina — toont een zijbalk met placeholder inhoudsblokken
export default function Page() {
  return (
    // SidebarProvider beheert de open/dicht staat van de zijbalk
    <SidebarProvider>
      {/* Render de applicatiezijbalk met navigatiemenu */}
      <AppSidebar />

      {/* SidebarInset: het hoofdinhoudsgebied naast de zijbalk */}
      <SidebarInset>
        {/* Paginaheader met de zijbalk trigger knop */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            {/* Knop om de zijbalk in te klappen/uitklappen */}
            <SidebarTrigger className="-ml-1" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>

        {/* Hoofdinhoud: raster van placeholder blokken */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Bovenste rij: 3 kaartplaceholders op desktop */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          {/* Grote inhoudsplaatshouder die de rest van het scherm vult */}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
