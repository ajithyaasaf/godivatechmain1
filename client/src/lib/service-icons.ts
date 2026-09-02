import React from "react";
import { 
  Globe, Megaphone, Database, Box, Smartphone, 
  Layout, Palette, PenTool, Video, LineChart, ShieldCheck
} from "lucide-react";

export const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  'globe': Globe,
  'web': Globe,
  'website': Globe,
  'web-design': Globe,
  
  'megaphone': Megaphone,
  'marketing': Megaphone,
  'digital-marketing': Megaphone,
  'cloud': Megaphone,

  'database': Database,
  'software': Database,
  'custom-software': Database,
  'crm': Database,

  'box': Box,
  'ecommerce': Box,
  'e-commerce': Box,
  'shop': Box,

  'smartphone': Smartphone,
  'app': Smartphone,
  'mobile': Smartphone,
  'users': Smartphone,

  'layout': Layout,
  'ui': Layout,
  'ux': Layout,
  'ui-ux': Layout,

  'palette': Palette,
  'brand': Palette,
  'branding': Palette,
  'logo': Palette,

  'pentool': PenTool,
  'pen-tool': PenTool,
  'graphic': PenTool,
  'poster': PenTool,

  'video': Video,
  'film': Video,
  'media': Video,

  'linechart': LineChart,
  'analytics': LineChart,
  'data': LineChart,
  'bar-chart': LineChart,

  'shield': ShieldCheck,
  'security': ShieldCheck
};

export const getServiceIcon = (icon?: any, title?: string, slug?: string): React.ElementType => {
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && 'render' in icon)) {
    return icon;
  }

  const iconKey = typeof icon === 'string' ? icon.toLowerCase().trim() : '';
  if (iconKey && SERVICE_ICON_MAP[iconKey]) {
    return SERVICE_ICON_MAP[iconKey];
  }

  const slugKey = typeof slug === 'string' ? slug.toLowerCase().trim() : '';
  if (slugKey && SERVICE_ICON_MAP[slugKey]) {
    return SERVICE_ICON_MAP[slugKey];
  }

  if (title) {
    const t = title.toLowerCase();
    if (t.includes('web')) return Globe;
    if (t.includes('marketing') || t.includes('digital')) return Megaphone;
    if (t.includes('software') || t.includes('crm') || t.includes('erp')) return Database;
    if (t.includes('commerce') || t.includes('store') || t.includes('shop')) return Box;
    if (t.includes('app') || t.includes('mobile')) return Smartphone;
    if (t.includes('ui') || t.includes('ux') || t.includes('interface')) return Layout;
    if (t.includes('logo') || t.includes('brand')) return Palette;
    if (t.includes('graphic') || t.includes('poster') || t.includes('creative')) return PenTool;
    if (t.includes('video') || t.includes('film')) return Video;
    if (t.includes('analytic') || t.includes('data') || t.includes('intelligence')) return LineChart;
  }

  return Globe;
};
