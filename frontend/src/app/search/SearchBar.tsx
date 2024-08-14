"use client"
import React from 'react'
import {useState, useEffect, useRef} from 'react';
import { getSearchedUsers } from '@/lib/actions';
import SearchedUsersContainer from './SearchedUsersContainer';

type User = {
  id: string;
  username: string;
  avatar: string | null;
};

const SearchBar = () => {

  const [searchedUsers, setSearchUsers] = useState<User[]>([]);
  const [searchedText, setSearchText] = useState<string>("")
  const [isSearchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  const handleChange = async()=>{
    const users = await getSearchedUsers(searchedText);
    if(users){
      setSearchUsers(users);
    }
  }

  useEffect(()=>{
    setSearchText("");
    setSearchUsers([]);
  }, [isSearchOpen])

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex p-3 bg-white items-center rounded-xl shadow-lg"
        onClick={() => setSearchOpen((prev)=> !prev)}
      >
        <input
          type="text"
          value={searchedText}
          placeholder="Search for other users..."
          className="h-8 bg-transparent outline-none w-full"
          onChange={(e) => {
            setSearchText(e.target.value);
            handleChange();
          }}
          spellCheck="false"
        />
        <img src="/search.png" alt="" className="w-6 h-6" />
      </div>

      {isSearchOpen && (
        <div className="bg-white flex flex-col p-8 gap-8 h-auto rounded-lg  shadow-lg">
          {searchedText.length>0 && searchedUsers?.length == 0 ? (
            <span className="text-2xl text-center">No User Found</span>
          ) : (
            searchedUsers.map((User1) => (
              <SearchedUsersContainer
                key={User1.id}
                Username={User1.username}
                Avatar={User1.avatar || ""}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar
