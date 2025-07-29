"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutGrid, Users, Calendar, ShoppingBag, HelpCircle, Menu } from "lucide-react"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const categories = [
    {
      id: "local-news",
      title: "Local News & Events",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      subcategories: ["Announcements", "Upcoming Events", "Local Politics", "School News"],
    },
    {
      id: "recommendations",
      title: "Recommendations",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      subcategories: ["Restaurants", "Contractors", "Healthcare", "Entertainment"],
    },
    {
      id: "community-projects",
      title: "Community Projects",
      icon: <Users className="h-4 w-4 mr-2" />,
      subcategories: ["Volunteering", "Fundraisers", "Neighborhood Improvement", "Education"],
    },
    {
      id: "buy-sell-trade",
      title: "Buy, Sell & Trade",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      subcategories: ["For Sale", "Wanted", "Free Items", "Services Offered"],
    },
    {
      id: "general-discussion",
      title: "General Discussion",
      icon: <LayoutGrid className="h-4 w-4 mr-2" />,
      subcategories: ["Introductions", "Off-Topic", "Hobbies", "Tech Talk"],
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground",
                pathname === "/" && "text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Accordion type="single" collapsible className="w-full">
              {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center">
                      {category.icon}
                      <span>{category.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      <Link
                        href={`/category/${category.id}`}
                        className="text-sm text-muted-foreground hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        All Topics
                      </Link>
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory}
                          href={`/category/${category.id}/${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-sm text-muted-foreground hover:text-primary"
                          onClick={() => setOpen(false)}
                        >
                          {subcategory}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Link
              href="/members"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground",
                pathname === "/members" && "text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              Members
            </Link>
            <Link
              href="/activity"
              className={cn(
                "flex items-center text-sm font-medium text-muted-foreground",
                pathname === "/activity" && "text-primary",
              )}
              onClick={() => setOpen(false)}
            >
              Recent Activity
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
