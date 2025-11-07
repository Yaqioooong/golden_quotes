"use client"
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/common/logo';
import { encryptAES } from '@/lib/crypto';
import { get, post } from '@/lib/request';

export default function LoginPage() {
    const [quoteData, setQuoteData] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        // 从URL参数获取来源页面，如果没有则使用document.referrer
        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = urlParams.get('from');
        
        let referrer = fromParam;
        
        // 如果没有URL参数，则使用document.referrer
        if (!referrer) {
            referrer = document.referrer;
        }
        
        // 如果还是没有来源，则使用当前页面URL
        if (!referrer) {
            referrer = window.location.href;
        }
        
        const currentPath = window.location.pathname;
        
        // 如果来源页面不是登录页面本身，则保存来源页面
        if (!referrer.includes(currentPath)) {
            sessionStorage.setItem('loginReferrer', referrer);
        }
    }, []);


    useEffect(() => {
        const fetchDailyQuote = async () => {
            setIsLoading(true);
            try {
                const response = await get(`/api/v1/quotes/public/daily`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // 检查响应内容类型
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('服务器返回了无效的响应格式');
                }
                
                const data = await response.json();
                if (data.success && data.data) {
                    setQuoteData(data.data);
                    setError(null);
                } else {
                    throw new Error(data.message || '获取数据失败');
                }
            } catch (err) {
                console.error('获取每日金句失败:', err);
                setError(err.message || '获取数据时发生错误');
                setQuoteData(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (apiUrl) {
            fetchDailyQuote();
        }
    }, []); // 移除 apiUrl 依赖

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const encryptedPassword = encryptAES(formData.password);
            const response = await post(`${apiUrl}/admin/login`, {
                username: formData.username,
                password: encryptedPassword,
                rememberMe: formData.rememberMe
            });

            // 检查响应内容类型
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('服务器返回了无效的响应格式');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || '登录失败');
            } else {
                // 保存 token 信息到 localStorage
                localStorage.setItem('tokenName', data.data.tokenName);
                localStorage.setItem('tokenValue', data.data.tokenValue);
                localStorage.setItem('isLogin', data.data.isLogin);
                localStorage.setItem('loginId', data.data.loginId);
                
                // 如果选择了记住我，保存用户名
                if (formData.rememberMe) {
                    localStorage.setItem('rememberedUsername', formData.username);
                } else {
                    localStorage.removeItem('rememberedUsername');
                }
                
                // 获取来源页面，如果没有来源页面则跳转到/books
                const referrer = sessionStorage.getItem('loginReferrer');
                const redirectUrl = referrer && !referrer.includes('/login') ? referrer : '/books';
                
                // 清除保存的来源页面信息
                sessionStorage.removeItem('loginReferrer');
                
                // 登录成功，跳转回来源页面或默认页面
                router.push(redirectUrl);
            }


        } catch (err) {
            setError(err.message || '登录过程中发生错误，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-400 to-amber-600 p-12 items-center justify-center">
                <div className="max-w-lg">
                    {/* <p className="text-xl font-serif font-bold text-white/70 mt-8">
                        发现、收藏并分享最珍贵的文字瞬间
                    </p> */}
                    <div
                        className="col-start-1 col-end-2 row-start-2 row-end-3 sm:col-start-2 sm:col-end-5 sm:row-start-2 sm:row-end-3 text-left">
                        {quoteData && (
                            <>
                                <p className={"text-2xl font-serif font-bold text-white/70"}>{quoteData.quotes.content}</p>
                                <p className={"text-xl font-serif font-bold text-white/70 text-right"}>——《{quoteData.bookName}》</p>
                                <p className={"text font-serif text-white/60 text-right mt-2"}>{quoteData.author}</p>
                            </>
                        )}
                        {isLoading && (
                            <p className="text-white/70 text-center">加载中...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="w-full max-w-md space-y-6">
                    
                    <div className="p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl space-y-6">
                        <div className="text-center">
                            <div className="flex flex-col items-center mb-2">
                                <Logo size="medium" color="amber" />
                            </div>
                            <h2 className="text-xl font-sans font-bold text-gray-700">登录到GOLDEN QUOTES</h2>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded transition-colors"
                                    />
                                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                                        记住我
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? '登录中...' : '登录'}
                            </button>
                        </form>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">还没有账号？</span>
                        <Link href="/register" className="text-amber-500 hover:text-amber-600 ml-1 font-medium">
                            立即注册
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

