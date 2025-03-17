"use client"
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Heart } from "lucide-react";

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 添加导航到 /books 页面的函数
    const navigateToBooks = () => {
        router.push('/books');
    };

    useEffect(() => {
        const tokenName = localStorage.getItem('tokenName');
        const tokenValue = localStorage.getItem('tokenValue');
        setIsLoggedIn(!!(tokenName && tokenValue));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('tokenName');
        localStorage.removeItem('tokenValue');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
      <header className="fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-16 relative">
                  <div className="col-span-1 flex items-center justify-start">
                      <Logo onClick={navigateToBooks}/>
                  </div>
                  <nav className="col-span-1 sm:col-span-1 md:col-span-4 flex items-center justify-end gap-4">
                      {isLoggedIn ? (
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 bg-amber-100 hover:bg-amber-200 transition-colors duration-200">
                                      <User className="h-5 w-5" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-40 backdrop-blur-lg bg-white/80 border border-white/40">
                                  <DropdownMenuItem onClick={() => router.push('/favorites')} className="cursor-pointer">
                                      <Heart className="mr-2 h-4 w-4 text-red-500" />
                                      <span>我的收藏</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => router.push('/admin')} className="cursor-pointer">
                                      <Settings className="mr-2 h-4 w-4" />
                                      <span>个人中心</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                                      <LogOut className="mr-2 h-4 w-4" />
                                      <span>退出</span>
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      ) : (
                          <Button variant="ghost" className="hover:bg-amber-100 transition-colors duration-200" asChild>
                              <a href="/login">登录</a>
                          </Button>
                      )}
                  </nav>
              </div>
          </div>
          {/* 径向渐变背景 */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/100 via-white/50 to-white/0 pointer-events-none -z-10"></div>
      </header>
  );
}
