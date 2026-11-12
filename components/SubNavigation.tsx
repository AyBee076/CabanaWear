"use client";

import { usePathname, useRouter } from "next/navigation";
import type { Category, Section } from "@/types";
import { Button } from "@/components/ui/button";

interface SubNavigationProps {
  section: Section;
  categories: Category[];
}

export default function SubNavigation({
  section,
  categories,
}: SubNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  const handleCategory = (href: string) => {
    router.push(href);
  };

  return (
    <div className="mb-5">
      <ul className="flex gap-1 font-fredoka text-2xl">
        <li>
          <Button
            variant={isActive(`/${section}`) ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleCategory(`/${section}`)}
          >
            All
          </Button>
        </li>
        {categories.map((item) => {
          const href = `/${section}/categories/${item.slug}`;
          return (
            <li key={item.slug}>
              <Button
                variant={isActive(href) ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleCategory(href)}
              >
                {item.displayName}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}