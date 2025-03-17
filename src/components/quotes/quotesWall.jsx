"use client"
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QuoteCard from "@/components/quotes/quoteCard";
import { ArrowLeft } from "lucide-react";

export default function QuotesWall() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookId = searchParams.get('bookId');

    const handleBack = () => {
        router.push('/books');
    };
    const [quotes, setQuotes] = useState([]);
    const [bookInfo, setBookInfo] = useState({ bookName: '', author: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [favoriteQuoteIds, setFavoriteQuoteIds] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const pageSize = 10;

    // 检查用户是否登录
    useEffect(() => {
        const tokenName = localStorage.getItem('tokenName');
        const tokenValue = localStorage.getItem('tokenValue');
        setIsLoggedIn(!!(tokenName && tokenValue));
    }, []);

    // 获取用户收藏的quotes
    const loadUserFavorites = async () => {
        if (!bookId || !isLoggedIn) return;
        
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (tokenName && tokenValue) {
                headers[tokenName] = tokenValue;
            }
            
            const response = await fetch(`${apiUrl}/api/v1/userFavorites/list?bookId=${bookId}`, {
                method: 'GET',
                headers,
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.data && data.data.items) {
                // 提取收藏的quote ids
                const favoriteIds = data.data.items.map(item => item.id);
                setFavoriteQuoteIds(favoriteIds);
            }
        } catch (error) {
            console.error('Error fetching user favorites:', error);
        }
    };

    const loadQuotes = async (page) => {
        if (!bookId || isLoading || !hasMore) return;
        
        setIsLoading(true);
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (tokenName && tokenValue) {
                headers[tokenName] = tokenValue;
            }
            const response = await fetch(`${apiUrl}/api/v1/quotes/public/list?bookId=${bookId}&page=${page}&pageSize=${pageSize}`, {
                method: 'GET',
                headers,
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success && data.data) {
                const newQuotes = data.data.quotesList.records || [];
                setQuotes(prev => page === 1 ? newQuotes : [...prev, ...newQuotes]);
                setBookInfo({
                    bookName: data.data.bookName || '',
                    author: data.data.author || ''
                });
                setHasMore(newQuotes.length === pageSize);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setQuotes([]);
        setHasMore(true);
        loadQuotes(1);
        
        // 如果用户已登录，加载用户收藏
        if (isLoggedIn) {
            loadUserFavorites();
        }
    }, [bookId, isLoggedIn]);

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
            loadQuotes(currentPage);
        }
    }, [currentPage]);

    // 处理收藏状态变化
    const handleFavoriteChange = (quoteId, isFavorite) => {
        if (isFavorite) {
            // 添加到收藏
            setFavoriteQuoteIds(prev => [...prev, quoteId]);
        } else {
            // 从收藏中移除
            setFavoriteQuoteIds(prev => prev.filter(id => id !== quoteId));
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
            <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">{bookInfo.bookName}</h1>
            <p className="text-lg font-serif text-gray-600">{bookInfo.author}</p>
        </div>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 p-4 mt-8 space-y-4 relative z-10">
            {quotes.map((quote, index) => (
                <QuoteCard 
                    key={quote.id || index} 
                    quote={quote.content}
                    chapter={quote.srcChapter}
                    id={quote.id}
                    likes={quote.likes}
                    isFavorite={favoriteQuoteIds.includes(quote.id)}
                    onFavoriteChange={handleFavoriteChange}
                    isLoggedIn={isLoggedIn}
                    bookName={bookInfo.bookName}
                    author={bookInfo.author}
                />
            ))}
        </div>
      </div>
  )
}