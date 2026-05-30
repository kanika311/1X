import type { IconType } from "react-icons";
import {
  FiActivity,
  FiAward,
  FiClipboard,
  FiEye,
  FiHeart,
  FiHome,
  FiLayers,
  FiMonitor,
  FiSearch,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiUserCheck,
  FiZap,
} from "react-icons/fi";

export const SERVICE_ICON_KEYS = [
  "shield",
  "target",
  "clipboard",
  "search",
  "zap",
  "monitor",
  "layers",
  "eye",
  "trending-up",
  "user-check",
  "activity",
  "heart",
  "home",
  "award",
] as const;

export type ServiceIconKey = (typeof SERVICE_ICON_KEYS)[number];

export const SERVICE_ICONS: Record<ServiceIconKey, IconType> = {
  shield: FiShield,
  target: FiTarget,
  clipboard: FiClipboard,
  search: FiSearch,
  zap: FiZap,
  monitor: FiMonitor,
  layers: FiLayers,
  eye: FiEye,
  "trending-up": FiTrendingUp,
  "user-check": FiUserCheck,
  activity: FiActivity,
  heart: FiHeart,
  home: FiHome,
  award: FiAward,
};
