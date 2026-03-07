'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, User, Scroll, Dices, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  icon: React.ElementType;
  label: string;
  pattern?: RegExp;
}

const navigationItems: NavigationItem[] = [
  {
    href: '/',
    icon: Home,
    label: 'Home',
    pattern: /^\/$/,
  },
  {
    href: '/personagens',
    icon: User,
    label: 'Personagens',
    pattern: /^\/personagens(?!\/novo)/,
  },
  {
    href: '/magias',
    icon: Scroll,
    label: 'Magias',
    pattern: /^\/magias/,
  },
  {
    href: '/dados',
    icon: Dices,
    label: 'Dados',
    pattern: /^\/dados/,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  // Hide on certain pages
  if (pathname.includes('/novo') || pathname.includes('/login')) {
    return null;
  }

  const isActive = (item: NavigationItem) => {
    if (item.pattern) {
      return item.pattern.test(pathname);
    }
    return pathname === item.href;
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 md:hidden" />

      {/* Bottom Navigation - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="glass-card border-t border-white/10 rounded-t-3xl px-2 py-2 safe-area-inset-bottom">
          <div className="flex items-center justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 rounded-2xl px-4 py-2 transition-all min-w-[60px]',
                    active
                      ? 'bg-gradient-to-br from-purple-600/20 to-violet-600/20 text-purple-400'
                      : 'text-gray-400 hover:text-white active:scale-95'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 transition-transform',
                      active && 'scale-110'
                    )}
                  />
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      active && 'text-purple-300'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
