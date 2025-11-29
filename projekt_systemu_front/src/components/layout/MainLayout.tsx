import Sidebar from "./Sidebar";
import Content from "./Content";
import type { ReactNode } from "react";

interface Props{
    children: ReactNode;
}



const MainLayout = function MainLayout({children}:Props){
return(
    <div className="flex h-screen overflow-hidden gap-4">
        <Sidebar></Sidebar>
        <Content>{children}</Content>
    </div>
    
)
}

export default MainLayout;