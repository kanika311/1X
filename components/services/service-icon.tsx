"use client";

import { SERVICE_ICONS, type ServiceIconKey } from "@/lib/service-icons";
import { FiShield } from "react-icons/fi";
import { cn } from "@/lib/utils";

type ServiceIconProps = {
  name: ServiceIconKey;
  className?: string;
};

export function ServiceIcon({ name, className }: ServiceIconProps) {
  const Icon = SERVICE_ICONS[name] ?? FiShield;
  return <Icon className={cn(className)} />;
}
