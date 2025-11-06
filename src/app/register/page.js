"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/common/logo';
import { get } from '@/lib/request';

export default function RegisterPage() {
    const [quoteData, setQuoteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        realName: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const fetchDailyQuote = async () => {
            setIsLoading(true);
            try {
                const response = await get(`${apiUrl}/api/v1/quotes/public/daily`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success && data.data) {
                    setQuoteData(data.data);
                } else {
                    throw new Error(data.message || '获取数据失败');
                }
            } catch (err) {
                console.error('获取每日金句失败:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (apiUrl) {
            fetchDailyQuote();
        }
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '两次输入的密码不一致';
        }
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.email = '请输入有效的邮箱地址';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // TODO: Implement register logic here
            console.log('Register attempt:', formData);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-500 to-amber-700 p-12 items-center justify-center">
                <div className="max-w-lg">
                    <div className="col-start-1 col-end-2 row-start-2 row-end-3 sm:col-start-2 sm:col-end-5 sm:row-start-2 sm:row-end-3 text-left">
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
                        <h2 className="font-sans font-bold text-gray-700">注册GOLDEN QUOTES账户</h2>
                    </div>

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
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">确认密码</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                                required
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="realName" className="block text-sm font-medium text-gray-700">真实姓名（选填）</label>
                            <input
                                type="text"
                                id="realName"
                                name="realName"
                                value={formData.realName}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">邮箱</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors text-lg font-medium"
                        >
                            注册
                        </button>
                    </form>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">已有账号？</span>
                        <Link href="/login" className="text-amber-500 hover:text-amber-600 ml-1 font-medium">
                            立即登录
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}