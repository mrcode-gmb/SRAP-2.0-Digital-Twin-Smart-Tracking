import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const roleConfig = {
  admin: {
    name: 'Administrator',
    color: 'bg-red-500',
    dashboard: '/dashboard/admin',
    permissions: ['manage_users', 'view_all', 'system_settings']
  },
  researcher: {
    name: 'Researcher',
    color: 'bg-blue-500',
    dashboard: '/dashboard/researcher',
    permissions: ['upload_data', 'view_research', 'create_reports']
  },
  data_analyst: {
    name: 'Data Analyst',
    color: 'bg-green-500',
    dashboard: '/dashboard/analyst',
    permissions: ['view_analytics', 'create_charts', 'export_data']
  },
  cybersecurity_specialist: {
    name: 'Cybersecurity Specialist',
    color: 'bg-purple-500',
    dashboard: '/dashboard/security',
    permissions: ['view_security', 'manage_api', 'security_alerts']
  },
  ai_developer: {
    name: 'AI Developer',
    color: 'bg-orange-500',
    dashboard: '/dashboard/ai',
    permissions: ['ai_models', 'anomaly_detection', 'chatbot_interface']
  }
};

export function getRoleConfig(role) {
  return roleConfig[role] || roleConfig.researcher;
}

export function formatRole(role) {
  return getRoleConfig(role).name;
}
