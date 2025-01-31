import { Boxes, Shield, Banknote, Calculator, PenIcon as UserPen, FolderKanban, Network, Wallet, Globe, SquareUser, Landmark, SmartphoneNfc, SquareTerminal, Receipt, MonitorIcon as MonitorCog, Hand, Handshake, Layers, LucideNotebookTabs, NotebookIcon } from 'lucide-react'

export const userData = {
  name: "Fahad Khan",
  email: "fahad@example.com",
  avatar: "/avatars/shadcn.jpg",
  role: "Product Manager"
}

export const solutionItems = [
  {
    name: "Insights",
    logo: Boxes,
    plan: "Enterprise",
    url: "#",
  },
  {
    name: "Master Portal",
    logo: Shield,
    plan: "Startup",
    url: "#",
  },
  {
    name: "Payments",
    logo: Banknote,
    plan: "Free",
    url: "#",
  },
  {
    name: "Merchant and POS",
    logo: Calculator,
    plan: "Free",
    url: "#",
  },
  {
    name: "ATM Manager",
    logo: SquareTerminal,
    plan: "Free",
    url: "/ATMManager/ATM",
  },
  {
    name: "Personalization",
    logo: UserPen,
    plan: "Free",
    url: "#",
  },
  {
    name: "Product Manager",
    logo: FolderKanban,
    plan: "Free",
    url: "#",
  },
  {
    name: "Distribution Network",
    logo: Network,
    plan: "Free",
    url: "#",
  },
  {
    name: "Wallet Management",
    logo: Wallet,
    plan: "Free",
    url: "#",
  },
  {
    name: "Remittance",
    logo: Globe,
    plan: "Free",
    url: "#",
  },
  {
    name: "Customer Management",
    logo: SquareUser,
    plan: "Free",
    url: "#",
  },
  {
    name: "Digital Banking",
    logo: Landmark,
    plan: "Free",
    url: "#",
  },
  {
    name: "Payment Gateway",
    logo: SmartphoneNfc,
    plan: "Free",
    url: "#",
  },
];

export const functionItems = [
  {
    name: "Security",
    logo: Shield,
    plan: "Enterprise",
    url: "#",
  },
  {
    name: "Configuration",
    logo: MonitorCog,
    plan: "Enterprise",
    url: "#",
  },
  {
    name: "Monitoring",
    logo: Network,
    plan: "Enterprise",
    url: "/Monitoring/Transactions",
  },
  {
    name: "Settlement",
    logo: Handshake,
    plan: "Enterprise",
    url: "#",
  },
  {
    name: "Bulk Operations",
    logo: Layers,
    plan: "Enterprise",
    url: "#",
  },
  {
    name: "Reports",
    logo: LucideNotebookTabs,
    plan: "Enterprise",
    url: "#",
  },
  {
    name: "Ticket Manager",
    logo: NotebookIcon,
    plan: "Enterprise",
    url: "#",
  },
]

export const navMainItems = [
  {
    title: "PBIs",
    url: "#",
    icon: SquareTerminal,
    isActive: true,
    items: [
      {
        title: "PBI Management",
        url: "/PBI",
      },
      {
        title: "Assigned To Me",
        url: "/ATMManager/ATM",
      },
      
    ],
  }
]
