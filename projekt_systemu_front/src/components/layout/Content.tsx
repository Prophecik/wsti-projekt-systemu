import type { ReactNode } from "react";
import { Card } from "@/components/ui/card"

interface ContentProps {
  children: ReactNode;
}

const Content = ({ children }: ContentProps) => {
  return <Card className="flex-1 overflow-scroll h-full">{children}</Card>;
};

export default Content;

