"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LayoutGrid, Users, Calendar, ShoppingBag, HelpCircle } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const categories = [
    {
      id: "local-news",
      title: "Local News & Events",
      description: "Latest community happenings",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      subcategories: ["Announcements", "Upcoming Events", "Local Politics", "School News"],
    },
    {
      id: "recommendations",
      title: "Recommendations",
      description: "Find local services and businesses",
      icon: <HelpCircle className="h-4 w-4 mr-2" />,
      subcategories: ["Restaurants", "Contractors", "Healthcare", "Entertainment"],
    },
    {
      id: "community-projects",
      title: "Community Projects",
      description: "Collaborate on local initiatives",
      icon: <Users className="h-4 w-4 mr-2" />,
      subcategories: ["Volunteering", "Fundraisers", "Neighborhood Improvement", "Education"],
    },
    {
      id: "buy-sell-trade",
      title: "Buy, Sell & Trade",
      description: "Local marketplace",
      icon: <ShoppingBag className="h-4 w-4 mr-2" />,
      subcategories: ["For Sale", "Wanted", "Free Items", "Services Offered"],
    },
    {
      id: "general-discussion",
      title: "General Discussion",
      description: "Chat about anything",
      icon: <LayoutGrid className="h-4 w-4 mr-2" />,
      subcategories: ["Introductions", "Off-Topic", "Hobbies", "Tech Talk"],
    },
  ]

  return (
    <div className="mr-4 hidden md:flex">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {categories.map((category) => (
                  <li key={category.id}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/category/${category.id}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center">
                          {category.icon}
                          <div className="text-sm font-medium leading-none">{category.title}</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {category.description}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/members" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Members</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/activity" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Recent Activity</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
