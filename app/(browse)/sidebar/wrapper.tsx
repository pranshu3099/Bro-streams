"use client";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
interface wrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: wrapperProps) => {
  const { collapsed } = useSidebar((state) => state);
  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-60 h-full bg-[#252731] border-r border-[#2D2E35] z-50",
        collapsed && "w-[70px]"
      )}
    >
      {children}
    </aside>
  );
};

export default Wrapper;
