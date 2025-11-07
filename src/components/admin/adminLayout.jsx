"use client"
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const tokenName = localStorage.getItem('tokenName');
    const tokenValue = localStorage.getItem('tokenValue');
    setIsLoggedIn(!!(tokenName && tokenValue));
    
    if (!tokenName || !tokenValue) {
      // 重定向到登录页面，并传递当前页面作为来源
      const currentPath = window.location.pathname;
      router.push(`/login?from=${encodeURIComponent(currentPath)}`);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('tokenName');
    localStorage.removeItem('tokenValue');
    router.push('/login');
  };

  const navigateTo = (path) => {
    router.push(path);
  };

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard className="h-5 w-5" />, label: '仪表盘' },
    { path: '/admin/books', icon: <BookOpen className="h-5 w-5" />, label: '书籍管理' },
    { path: '/admin/users', icon: <Users className="h-5 w-5" />, label: '权限管理' },
    { path: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: '系统配置' },
  ];

  const renderNavItems = () => (
    <nav className="space-y-1">
      {menuItems.map(item => (
        <Button 
          key={item.path}
          variant={pathname === item.path ? "secondary" : "ghost"}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-start'}`}
          onClick={() => navigateTo(item.path)}
        >
          <span className={isCollapsed ? '' : 'mr-2'}>{item.icon}</span>
          {!isCollapsed && item.label}
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <Collapsible
        open={!isCollapsed}
        onOpenChange={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex"
      >
        <aside className={`flex flex-col border-r border-dashed fixed h-screen opacity-70 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-48'}`}>
          <div className={`p-3 flex items-center gap-2 h-12 border-b border-dashed ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="transform scale-75">
              <Logo />
            </div>
            {!isCollapsed && <h1 className="font-sans font-semibold text-gray-700">GQ管理台</h1>}
          </div>
          <ScrollArea className="flex-1 py-2">
            {renderNavItems()}
          </ScrollArea>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-3 top-[72px] h-6 w-6 rounded-full border border-dashed bg-background"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <div className="p-2 border-t border-dashed">
            <Button 
              variant="ghost" 
              className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              {!isCollapsed && '退出登录'}
            </Button>
          </div>
        </aside>
      </Collapsible>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed left-4 top-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-48 p-0 opacity-70">
          <div className="p-3 flex items-center gap-2 h-12 border-b border-dashed">
            <div className="transform scale-75">
              <Logo />
            </div>
            <h1 className="font-semibold">金句管理</h1>
          </div>
          <ScrollArea className="flex-1 py-2">
            {renderNavItems()}
          </ScrollArea>
          <div className="p-2 border-t border-dashed">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              退出登录
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-0 lg:ml-48'}`}>
        <main className="min-h-screen pt-4 lg:pt-6 px-4 lg:px-8 overflow-y-auto h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}