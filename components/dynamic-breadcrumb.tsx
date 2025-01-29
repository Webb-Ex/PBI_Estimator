"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { routeMap } from "@/lib/routeMap";

function resolveRoute(path: string) {
  // Exact match
  if (routeMap[path]) return routeMap[path];

  // Match base route for dynamic paths
  const basePath = Object.keys(routeMap).find((route) => path.startsWith(route));
  if (basePath) return routeMap[basePath];

  return null;
}

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const breadcrumbs = [];


  let currentPath = pathname;
  while (currentPath) {
    const route = resolveRoute(currentPath);
    if (route) {
      breadcrumbs.unshift(route); 
      currentPath = route.parent || ""; 
    } else {
      break;
    }
  }

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <BreadcrumbItem key={index}>
            {index === breadcrumbs.length - 1 ? (
              <BreadcrumbPage>{item.name}</BreadcrumbPage>
            ) : (
              <>
                <Link href={item.link}>
                  {item.name}
                </Link>
                <BreadcrumbSeparator />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
