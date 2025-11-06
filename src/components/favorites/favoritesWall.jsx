"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuoteCard from "@/components/quotes/quoteCard";
import { ArrowLeft, Heart } from "lucide-react";
import { get } from "@/lib/request";

export default function FavoritesWall() {
    const router = useRouter();
    const [favorites, setFavorites] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const pageSize = 10;

    // 检查用户是否登录
    useEffect(() => {
        const tokenName = localStorage.getItem('tokenName');
        const tokenValue = localStorage.getItem('tokenValue');
        setIsLoggedIn(!!(tokenName && tokenValue));
    }, []);

    const handleBack = () => {
        router.push('/');
    };

    const loadFavorites = async (page) => {
        if (isLoading || !hasMore) return;
        
        setIsLoading(true);
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');
            
            if (!tokenName || !tokenValue) {
                // 未登录，跳转到登录页
                router.push('/login');
                return;
            }
            
            // 使用新的API接口获取收藏列表
            const response = await get(`${apiUrl}/api/v1/userFavorites/list?page=${page}&pageSize=${pageSize}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                const newFavorites = data.data.items || [];
                setFavorites(prev => page === 1 ? newFavorites : [...prev, ...newFavorites]);
                setHasMore(newFavorites.length === pageSize);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setFavorites([]);
        setHasMore(true);
        loadFavorites(1);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
                if (!isLoading && hasMore) {
                    setCurrentPage(prev => prev + 1);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore]);

    useEffect(() => {
        if (currentPage > 1) {
            loadFavorites(currentPage);
        }
    }, [currentPage]);

    // 处理收藏状态变化
    const handleFavoriteChange = (quoteId, isFavorite) => {
        if (!isFavorite) {
            // 如果取消收藏，从列表中移除
            setFavorites(prev => prev.filter(fav => fav.id !== quoteId));
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <button
                onClick={handleBack}
                className="fixed mt-12 top-4 p-2 rounded-full bg-white/20 backdrop-filter backdrop-blur-lg border border-white/40 ring-1 ring-white/5 text-gray-600 hover:bg-white/30 hover:text-gray-800 transition-all duration-300 z-50"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="text-center mt-14 mb-4 relative z-10">
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2 flex items-center justify-center">
                    我的收藏
                    <Heart className="ml-2 w-8 h-8 text-red-500 fill-red-500" />
                </h1>
                <p className="text-lg font-serif text-gray-600">您收藏的所有精彩语录</p>
            </div>
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 p-4 mt-8 space-y-4 relative z-10">
                {favorites.length > 0 ? (
                    favorites.map((favorite, index) => (
                        <QuoteCard 
                            key={favorite.id || index} 
                            quote={favorite.content}
                            chapter={favorite.srcChapter}
                            id={favorite.id}
                            likes={favorite.likes}
                            isFavorite={true}
                            isLoggedIn={isLoggedIn}
                            onFavoriteChange={handleFavoriteChange}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-10">
                        <p className="text-xl text-gray-600">您还没有收藏任何语录</p>
                        <button 
                            onClick={() => router.push('/books')}
                            className="mt-4 px-6 py-2 bg-white/30 backdrop-filter backdrop-blur-lg border border-white/40 rounded-full text-gray-700 hover:bg-white/50 transition-all duration-300"
                        >
                            浏览书籍
                        </button>
                    </div>
                )}
            </div>
            {isLoading && (
                <div className="text-center py-4">
                    <p className="text-gray-600">加载中...</p>
                </div>
            )}
        </div>
    );
}