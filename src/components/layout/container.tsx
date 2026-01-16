import { useIsMobile } from "@/lib/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContainerSize = "default" | "full" | "narrow";

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  className?: string;
}

const sizeClasses: Record<ContainerSize, string> = {
  default: "max-w-[1210px]",
  full: "max-w-full",
  narrow: "max-w-[936px]",
};

const Container = ({
  children,
  size = "default",
  className,
}: ContainerProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        sizeClasses[size],
        "mx-auto",
        className,
        isMobile && "px-4"
      )}
    >
      {children}
    </div>
  );
};

export default Container;
