import Link from 'next/link';
import SignInButton from './SignInButton';
import { getAuthSession } from '@/lib/nextAuth';
import UserAccountNav from './UserAccountNav';
import { ThemeToggle } from './ThemeToggle';

type Props = {};

const Navbar = async (props: Props) => {
  const session = await getAuthSession();
  console.log(session);
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300 py-2">
      <div className="max-w-7xl h-full mx-auto px-8 flex justify-between items-center gap-2">
        {/* Logo */}
        <Link href="/">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:translate-y-[2px] md:block dark:border-white">
            Smarty Quiz
          </p>
        </Link>
        <div className="flex items-center">
          <ThemeToggle className="mr-4" />
          {session?.user ? (
            <UserAccountNav user={session?.user} />
          ) : (
            <SignInButton text="Sign In" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
