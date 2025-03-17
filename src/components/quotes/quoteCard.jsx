"use client"
import { useState, useEffect, useRef } from "react";
import { Heart, Share2, Download, Copy, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import Logo from "../common/logo";

export default function QuoteCard({ quote, chapter, id, likes: initialLikes, isFavorite: initialIsFavorite, isLoggedIn, onFavoriteChange, bookName, author }) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite || false);
    const [isLoading, setIsLoading] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikes || 0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);
    const [copyImageSuccess, setCopyImageSuccess] = useState(false);
    const shareCardRef = useRef(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();

    // 当传入的收藏状态变化时更新内部状态
    useEffect(() => {
        if (initialIsFavorite !== undefined) {
            setIsFavorite(initialIsFavorite);
        }
        
        if (initialLikes !== undefined) {
            setLikesCount(initialLikes);
        }
    }, [initialIsFavorite, initialLikes]);

    const toggleFavorite = () => {
        if (!id || isLoading) return;
        
        // 如果用户未登录，跳转到登录页面
        if (!isLoggedIn) {
            router.push('/login');
            return;
        }
        
        // 更新收藏状态UI
        const newFavoriteStatus = !isFavorite;
        setIsFavorite(newFavoriteStatus);
        
        // 通知父组件收藏状态变化
        if (onFavoriteChange) {
            onFavoriteChange(id, newFavoriteStatus);
        }
        
        // 发送API请求
        sendFavoriteRequest(newFavoriteStatus);
    };
    
    const sendFavoriteRequest = async (newFavoriteStatus) => {
        setIsLoading(true);
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');
            
            const headers = { 
                'Content-Type': 'application/json'
            };
            headers[tokenName] = tokenValue;
            
            // 使用新的API接口
            const endpoint = newFavoriteStatus 
                ? `${apiUrl}/api/v1/userFavorites/add`
                : `${apiUrl}/api/v1/userFavorites/remove`;
                
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify({ quoteId: id }),
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                // 只在API请求成功时更新likes数值
                setLikesCount(currentLikes => {
                    const newCount = newFavoriteStatus 
                        ? currentLikes + 1 
                        : Math.max(0, currentLikes - 1);
                    return newCount;
                });
            } else {
                // 如果请求失败，回滚UI状态
                setIsFavorite(!newFavoriteStatus);
                
                // 通知父组件收藏状态变化回滚
                if (onFavoriteChange) {
                    onFavoriteChange(id, !newFavoriteStatus);
                }
                
                console.error('Failed to toggle favorite status');
            }
        } catch (error) {
            // 如果发生错误，回滚UI状态
            setIsFavorite(!newFavoriteStatus);
            
            // 通知父组件收藏状态变化回滚
            if (onFavoriteChange) {
                onFavoriteChange(id, !newFavoriteStatus);
            }
            
            console.error('Error toggling favorite:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const closeShareModal = () => {
        setShowShareModal(false);
        setCopySuccess(false);
        setDownloadSuccess(false);
    };

    const downloadShareCard = async () => {
        if (!shareCardRef.current) return;
        
        try {
            const canvas = await html2canvas(shareCardRef.current, {
                scale: 2,
                backgroundColor: null,
                logging: false,
                useCORS: true,
                allowTaint: true,
                windowHeight: shareCardRef.current.scrollHeight + 20,
                height: shareCardRef.current.scrollHeight + 20
            });
            
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `quote-${id || "share"}.png`;
            link.click();
            
            setDownloadSuccess(true);
            setTimeout(() => setDownloadSuccess(false), 2000);
        } catch (error) {
            console.error("下载分享卡片失败:", error);
        }
    };

    const copyToClipboard = () => {
        if (!shareCardRef.current) return;
        
        const textToCopy = `"${quote}"`;
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(err => {
                console.error("复制到剪贴板失败:", err);
            });
    };

    const copyImageToClipboard = async () => {
        if (!shareCardRef.current) return;
        
        try {
            const canvas = await html2canvas(shareCardRef.current, {
                scale: 2,
                backgroundColor: null,
                logging: false,
                useCORS: true,
                allowTaint: true,
                windowHeight: shareCardRef.current.scrollHeight + 20,
                height: shareCardRef.current.scrollHeight + 20
            });
            
            canvas.toBlob(async (blob) => {
                try {
                    // 尝试使用现代 Clipboard API
                    if (navigator.clipboard && navigator.clipboard.write) {
                        const item = new ClipboardItem({
                            'image/png': blob
                        });
                        await navigator.clipboard.write([item]);
                        setCopyImageSuccess(true);
                        setTimeout(() => setCopyImageSuccess(false), 2000);
                    } else {
                        // 回退方法：创建一个临时的图片元素并复制
                        const data = canvas.toDataURL('image/png');
                        const tempImg = document.createElement('img');
                        document.body.appendChild(tempImg);
                        tempImg.src = data;
                        tempImg.style.position = 'fixed';
                        tempImg.style.opacity = '0';
                        
                        // 创建一个临时的文本区域来触发复制
                        const textArea = document.createElement('textarea');
                        textArea.value = '图片已复制';
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        
                        // 清理临时元素
                        document.body.removeChild(tempImg);
                        document.body.removeChild(textArea);
                        
                        setCopyImageSuccess(true);
                        setTimeout(() => setCopyImageSuccess(false), 2000);
                    }
                } catch (err) {
                    console.error("复制图片到剪贴板失败:", err);
                }
            }, 'image/png');
        } catch (error) {
            console.error("生成图片失败:", error);
        }
    };

    // 渲染按钮状态
    const renderButtonState = (isSuccess, defaultText, successText, icon, successIcon) => {
        return (
            <div className="flex items-center justify-center gap-2 w-full relative">
                {/* 默认图标 */}
                <span className={`transition-all duration-300 ${isSuccess ? 'opacity-0 absolute left-0' : 'opacity-100'}`}>
                    {icon}
                </span>
                
                {/* 成功图标 - 放在左侧 */}
                <span className={`transition-all duration-300 ${isSuccess ? 'opacity-100' : 'opacity-0 absolute left-0'}`}>
                    {successIcon}
                </span>
                
                {/* 文字 */}
                <span className="text-sm">{isSuccess ? successText : defaultText}</span>
            </div>
        );
    };

    return (
        <>
            <div className="break-inside-avoid mb-4 p-6 rounded-xl shadow-lg bg-white/20 backdrop-filter backdrop-blur-lg border-2 border-white/40 ring-1 ring-white/5 flex flex-col items-center justify-center font-serif relative transition-all duration-300 will-change-transform hover:shadow-xl hover:bg-white/30 hover:backdrop-blur-xl hover:transform hover:scale-[1.02] hover:-translate-y-1 hover:border-white/20 hover:ring-white/10">
                <div className="absolute top-2 left-2 text-4xl text-gray-400/70">"</div>
                <p className="text-left font-bold text-xl w-full text-gray-800">{quote}</p>
                
                <div className="w-full flex justify-between items-center mt-4">
                    <div className="flex items-center">
                        {id && (
                            <>
                                <button 
                                    onClick={toggleFavorite}
                                    disabled={isLoading}
                                    className="p-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center"
                                >
                                    <Heart 
                                        className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} 
                                    />
                                    <span className="ml-1 font-sans text-gray-600">
                                        {likesCount}
                                    </span>
                                </button>
                                <button 
                                    onClick={handleShare}
                                    className="p-2 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center ml-2"
                                >
                                    <Share2 className="w-5 h-5 text-gray-400" />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="text-right">
                        {chapter && <p className="text-sm text-gray-600">— {chapter}</p>}
                    </div>
                </div>
                
            </div>

            {showShareModal && (
                <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[9999]" style={{ margin: 0 }}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative mx-4">
                        <button 
                            onClick={closeShareModal}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-4">分享金句</h3>
                        
                        <div 
                            ref={shareCardRef}
                            className="p-8 pb-4 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-md border border-white/40 mb-4 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="text-5xl text-purple-300/70 absolute -top-6 -left-2">"</div>
                                
                                <p className="text-xl font-bold font-serif text-gray-800 mb-6 pt-4 leading-relaxed">{quote}</p>
                                <div className="flex flex-col items-end space-y-1 mb-4">
                                    {bookName && (
                                        <p className="text-right text-sm font-medium text-gray-700">「{bookName}」</p>
                                    )}
                                    {author && (
                                        <p className="text-right text-sm font-medium text-gray-600">— {author}</p>
                                    )}
                                </div>
                                
                                {/* Logo 放在左下角 */}
                                <div className="bottom-0 left-0 right-0 flex items-center justify-center opacity-60">
                                    <div className="py-1 rounded-t-md backdrop-blur-sm bg-white/20 flex items-center gap-1">
                                        <div className="transform scale-75">
                                            <Logo />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600">Golden Quotes</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] z-0"></div>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button 
                                onClick={downloadShareCard}
                                className={`flex-1 relative flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 overflow-hidden text-sm ${
                                    downloadSuccess 
                                    ? 'bg-green-500 text-white shadow-md' 
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                            >
                                {renderButtonState(
                                    downloadSuccess,
                                    "下载卡片",
                                    "已下载",
                                    <Download className="w-3.5 h-3.5" />,
                                    <Check className="w-3.5 h-3.5" />
                                )}
                            </button>
                            
                            <button 
                                onClick={copyImageToClipboard}
                                className={`flex-1 relative flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 overflow-hidden text-sm ${
                                    copyImageSuccess 
                                    ? 'bg-green-500 text-white shadow-md' 
                                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                }`}
                            >
                                {renderButtonState(
                                    copyImageSuccess,
                                    "拷贝卡片",
                                    "拷贝成功",
                                    <Copy className="w-3.5 h-3.5" />,
                                    <Check className="w-3.5 h-3.5" />
                                )}
                            </button>
                            
                            <button 
                                onClick={copyToClipboard}
                                className={`flex-1 relative flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 overflow-hidden text-sm ${
                                    copySuccess 
                                    ? 'bg-green-500 text-white shadow-md' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                                }`}
                            >
                                {renderButtonState(
                                    copySuccess,
                                    "拷贝文本",
                                    "拷贝成功",
                                    <Copy className="w-3.5 h-3.5" />,
                                    <Check className="w-3.5 h-3.5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}