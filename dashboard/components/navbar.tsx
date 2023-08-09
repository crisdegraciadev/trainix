'use client'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@radix-ui/react-navigation-menu'
import { navigationMenuTriggerStyle } from './ui/navigation-menu'
import { nanoid } from 'nanoid'

const NAV_ITEMS = [
  { transKey: 'Dashboard', path: '/' },
  { transKey: 'Workouts', path: '/workouts' },
  { transKey: 'Exercises', path: '/exercises' },
  { transKey: 'History', path: '/history' },
]

export function Navbar() {
  return (
    <div className="border-b px-8 py-4 flex gap-4">
      <h1 className="text-3xl font-semibold">Trainix</h1>
      <NavigationMenu>
        <NavigationMenuList className="flex">
          {NAV_ITEMS.map(({ transKey, path }, idx) => (
            <NavigationMenuItem key={nanoid()}>
              <Link legacyBehavior passHref href={path}>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {transKey}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>{' '}
    </div>
  )
}
