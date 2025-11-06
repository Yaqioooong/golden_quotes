"use client"
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Heart, BookMarked } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { get } from "@/lib/request";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalQuotes: 0,
    totalFavorites: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
      try {
        setLoading(true);
        
        const response = await get(`${apiUrl}/api/v1/admin/admin/dashboard`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setStats({
            totalBooks: data.data.bookCount,
            totalUsers: data.data.userCount,
            totalQuotes: data.data.quotesCount,
            totalFavorites: data.data.totalFavorites,
          });
        } else {
          toast({
                variant: "destructive",
                title: "获取系统统计失败",
                description: data.message || "获取数据失败",
            });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "获取系统统计失败",
          description: "网络错误，请稍后重试",
        });
      } finally {
        setLoading(false);
      }
    };

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">系统概览</h2>
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          错误: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">系统概览</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">书籍总数</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "加载中..." : stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              系统中的书籍总数
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">用户总数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "加载中..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              注册用户总数
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">金句总数</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "加载中..." : stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              系统中的金句总数
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">收藏总数</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "加载中..." : stats.totalFavorites}</div>
            <p className="text-xs text-muted-foreground">
              用户收藏金句总数
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>最近活跃</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              这里可以放置最近活跃用户或操作的图表
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>热门书籍</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              这里可以放置热门书籍的统计图表
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}