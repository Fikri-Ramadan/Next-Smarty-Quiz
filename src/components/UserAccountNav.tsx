'use client';

import { User } from 'next-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import UserAvatar from './UserAvatar';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

type Props = {
  user: Pick<User, 'name' | 'image' | 'email'>;
};
const UserAccountNav = ({ user }: Props) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar
            className="w-10 h-10"
            user={{ name: user.name || null, image: user.image || null }}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user?.name && <p className="font-medium">{user.name}</p>}
              {user?.email && (
                <p className="w-[200px] truncate text-sm text-zinc-700">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-red-600 cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              signOut().catch(console.error);
            }}
          >
            Sign Out <LogOut className="w-4 h-4 ml-2" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default UserAccountNav;
