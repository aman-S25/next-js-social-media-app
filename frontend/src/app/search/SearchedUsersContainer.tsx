import React from 'react'
import Link from 'next/link';


interface SearchedUsersProps {
  Username: string;
  Avatar: string;
}

const SearchedUsersContainer: React.FC<SearchedUsersProps> = ({
  Username,
  Avatar,
}) => {
  return (
    <Link href={`/profile/${Username}`}>
      <div className="flex gap-6">
        <img
          src={Avatar || "/noAvatar"}
          alt=""
          className="h-8 w-8 rounded-full ring-2-black"
        />
        <span className="text-xl text-gray-800">{Username}</span>
      </div>
    </Link>
  );
};

export default SearchedUsersContainer
