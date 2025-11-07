"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchArea({ onSearch }) {
  const [bookName, setBookName] = useState("");
  const [author, setAuthor] = useState("");

  const handleSearch = () => {
    onSearch?.({ bookName, author });
  };

  return (
    <div className="p-4 rounded mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
      <div className="col-start-1 col-end-6 sm:col-start-1 sm:col-end-3 md:col-start-2 md:col-end-5">
        <div className="flex flex-col sm:flex-row w-full items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Input
            type="text"
            placeholder="书籍名称"
            className="flex-1 bg-white/30 backdrop-blur-sm border-black/40 placeholder:text-black/70 text-white focus:bg-white/40 focus:border-white/60 transition-all duration-300"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="作者名字"
            className="flex-1 bg-white/30 backdrop-blur-sm border-black/40 placeholder:text-black/70 text-white focus:bg-white/40 focus:border-white/60 transition-all duration-300"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <Button
            type="button"
            className="w-full sm:w-24"
            onClick={handleSearch}
          >
            搜索
          </Button>
        </div>
      </div>
    </div>
  );
}