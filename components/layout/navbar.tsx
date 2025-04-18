"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  MessageSquare,
  User,
  LogOut,
  Search,
  Plus
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white dark:bg-background">
      <div className="container flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span>Forum</span>
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle({ className: pathname === "/" ? "bg-accent" : "" })}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {session && (
                <>
                  <NavigationMenuItem>
                    <Link href="/forums/create">
                      <NavigationMenuLink className={navigationMenuTriggerStyle({ className: pathname === "/forums/create" ? "bg-accent" : "" })}>
                        New Forum
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/profile" >
                      <NavigationMenuLink className={navigationMenuTriggerStyle({ className: pathname === "/profile" ? "bg-accent" : "" })}>
                        My Profile
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button asChild variant="ghost" size="icon" className="md:hidden">
                <Link href="/forums/create">
                  <Plus className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <Link href="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarFallback>{session.user.name?.charAt(0) || "A"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <TooltipProvider >
                    <Tooltip >
                      <TooltipTrigger >
                        <DropdownMenuItem
                          onClick={() => {
                            signOut({ callbackUrl: "/" })
                            setTimeout(() => {
                              toast.success("Signed out Successfully")
                            })
                          }
                          }
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem></TooltipTrigger>
                      <TooltipContent side="left">
                        <p>Log Out</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>


                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="ghost">
                <Link href="/auth">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav >
  );
}