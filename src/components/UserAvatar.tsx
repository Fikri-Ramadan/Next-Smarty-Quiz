import { User } from 'next-auth';
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';
import { type AvatarProps } from '@radix-ui/react-avatar';

interface Props extends AvatarProps {
  user: Pick<User, 'name' | 'image'>;
}

const UserAvatar = ({ user, ...props }: Props) => {
  return (
    <Avatar {...props}>
      {user?.image ? (
        <div className="aspect-square relative w-full h-full">
          <Image
            src={user.image}
            fill
            alt="profile image"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
};
export default UserAvatar;
