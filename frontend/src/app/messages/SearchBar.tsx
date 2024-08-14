"use client"
import React, { use } from 'react'
import {useState, useEffect, useRef} from 'react';
import { getSearchedUsers } from '@/lib/actions';
import SearchedUsersContainer from './SearchedUsersContainer';

type User = {
  id: string;
  username: string;
  avatar: string | null;
};

interface searchProps {
  onChatSelect: any;
}


const SearchBar: React.FC<searchProps> = ({onChatSelect}) => {

  const [searchedUsers, setSearchUsers] = useState<User[]>([]);
  const [searchedText, setSearchText] = useState<string>("");
  const [isSearchOpen, setSearchOpen] = useState(false);

  const handleChange = async () => {
    const users = await getSearchedUsers(searchedText);
    if (users) {
      setSearchUsers(users);
    }
  };


  useEffect(() =>{
    setSearchText("");
    setSearchUsers([])
  }, [isSearchOpen]);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex p-3 bg-white items-center rounded-xl shadow-lg"
        onClick={() => setSearchOpen((prev) => !prev)}
      >
        <input
          type="text"
          placeholder="Search for friends to chat..."
          className="h-8 bg-transparent outline-none w-full"
          onChange={(e) => {
            setSearchText(e.target.value);
            handleChange();
          }}
          spellCheck="false"
          value={searchedText}
        />
        <img src="/search.png" alt="" className="w-6 h-6" />
      </div>

      {isSearchOpen && (
        <div className="bg-white flex flex-col p-5 gap-4 h-auto rounded-lg  shadow-lg">
          {searchedText.length > 0 && searchedUsers?.length == 0 ? (
            <span className="text-lg text-center">No User Found</span>
          ) : (
            searchedUsers.map((User1) => (
              <SearchedUsersContainer
                key={User1.id}
                Username={User1.username}
                userId={User1.id}
                Avatar={User1.avatar || ""}
                onChatSelect={onChatSelect}
                setSearchOpen={setSearchOpen}
                setSearchText={setSearchText}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar
