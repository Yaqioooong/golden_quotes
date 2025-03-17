import React from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function BookCard({ cover, title, author, country, id }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/quotes?bookId=${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white/20 backdrop-filter backdrop-blur-lg border border-white/40 ring-1 ring-white/5 p-4 rounded-lg shadow-lg flex flex-row space-x-6 min-h-[180px] h-auto transition-all duration-300 hover:shadow-xl hover:bg-white/30 hover:backdrop-blur-xl hover:transform hover:scale-[1.02] hover:-translate-y-1 hover:border-white/20 hover:ring-white/10 cursor-pointer">
            <div className="w-1/3 flex-shrink-0">
                <div className="relative pt-[140%] w-full overflow-hidden rounded-lg shadow-md">
                    <img
                        src={cover}
                        alt={`${title} 封面`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2 mb-2 leading-tight">{title}</h2>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <p className="text-sm text-gray-600 font-medium">作者</p>
                            <p className="text-sm text-gray-700 ml-2 flex-1">{author}</p>
                        </div>
                        <div className="flex items-center">
                            <p className="text-sm text-gray-600 font-medium">国家</p>
                            <p className="text-sm text-gray-700 ml-2 flex-1">{country}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}