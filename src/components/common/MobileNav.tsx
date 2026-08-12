import React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"

interface NavLink {
  name: string
  href: string
}

export const MobileNav = ({
  links,
  baseUrl,
}: {
  links: NavLink[]
  baseUrl: string
}) => {
  return (
    <div className="flex items-center gap-3 lg:hidden">
      <a
        href={`${baseUrl}register/school`}
        className="bg-orange rounded-full px-5 py-1.5 font-wwf text-lg text-white shadow-md transition-transform active:scale-95 reg-btn"
      >
        REGISTER
      </a>
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-1 text-slate-800" aria-label="Open Menu">
            <Menu className="h-8 w-8" />
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="z-9999 w-75 bg-white px-5 pt-12">
          <SheetHeader className="p-0 text-left">
            <SheetTitle className="font-wwf text-3xl tracking-wide text-slate-900">
              MENU
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-6">
            {links.map((link) => (
              <a
                key={link.name}
                href={`${baseUrl}${link.href}`}
                className="hover:text-coral font-wwf text-2xl text-slate-800 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
