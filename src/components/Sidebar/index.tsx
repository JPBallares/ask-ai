'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar-wrapper w-64 p-4">
      <nav>
        <ul>
          <li className="dark:text-white">
            <Link
              className={`rounded p-2 w-full inline-block ${
                pathname === '/' ? 'bg-slate-800' : 'hover:bg-slate-800'
              }`}
              href="/"
            >
              Chat
            </Link>
          </li>
          <li className="dark:text-white">
            <Link
              className={`rounded p-2 w-full inline-block ${
                pathname === '/image' ? 'bg-slate-800' : 'hover:bg-slate-800'
              }`}
              href="/image"
            >
              Generate Image
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
