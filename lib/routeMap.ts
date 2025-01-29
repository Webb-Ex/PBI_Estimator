export const routeMap: Record<
  string,
  { name: string; link: string; parent?: string; group?: string }
> = {
  "/ATMManager": {
    name: "ATM Manager",
    link: "/ATMManager",
    group: "Solutions",
  },
  "/ATMManager/ATM": {
    name: "ATM Profiles",
    link: "/ATMManager/ATM",
    parent: "/ATMManager",
    group: "ATMs",
  },
  "/ATMManager/ATMSchedules": {
    name: "ATM Schedules",
    link: "/ATMManager/ATMSchedules",
    parent: "/ATMManager",
    group: "ATMs",
  },
  "/ATMManager/ATMTemplates": {
    name: "ATM Templates",
    link: "/ATMManager/ATMTemplates",
    parent: "/ATMManager",
    group: "ATMs",
  },
  "/ATMManager/DynamicMsg": {
    name: "Dynamic Messages",
    link: "/ATMManager/DynamicMsg",
    parent: "/ATMManager",
    group: "ATMs",
  },
  "/Monitoring/Transactions": {
    name: "Transactions",
    link: "/Monitoring/Transactions",
    parent: "/Monitoring",
    group: "Monitoring",
  },
};
