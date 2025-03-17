"use client"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { generatePagination } from "@/lib/pagination";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";

const formSchema = z.object({
    bookName: z.string().min(1, "书名不能为空"),
    author: z.string().min(1, "作者不能为空"),
    cover: z.string().min(1, "封面链接不能为空").url("请输入有效的URL"),
    country: z.string().min(1, "国家不能为空"),
});

export default function BooksManagement() {
    const [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            bookName: "",
            author: "",
            cover: "",
            country: "",
        },
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBooks();
    }, [currentPage]);

    const fetchBooks = async () => {
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');

            const headers = {
                'Content-Type': 'application/json'
            };
            headers[tokenName] = tokenValue;

            const response = await fetch(`${apiUrl}/api/v1/books/public/list?page=${currentPage}&pageSize=${pageSize}${searchTerm ? `&search=${searchTerm}` : ''}`, {
                method: 'GET',
                headers,
                credentials: 'include'
            });

            const data = await response.json();
            if (data.success && data.data) {
                setBooks(data.data.records || []);
                setTotalPages(data.data.pages || 1);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            toast({
                variant: "destructive",
                title: "获取书籍列表失败",
                description: "请稍后重试",
            });
        }
    };

    const onSubmit = async (values) => {
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');

            const headers = {
                'Content-Type': 'application/json'
            };
            headers[tokenName] = tokenValue;

            const response = await fetch(`${apiUrl}/api/v1/books/admin/add`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (data.success) {
                // 重置页码到第一页
                setCurrentPage(1);
                // 刷新书籍列表
                fetchBooks();

                // 重置表单并关闭对话框
                form.reset();
                setOpen(false);
                toast({
                    title: "操作成功",
                    description: "书籍已添加",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "添加失败",
                    description: data.msg || "请稍后重试",
                });
            }
        } catch (error) {
            console.error('Error adding book:', error);
            toast({
                variant: "destructive",
                title: "添加失败",
                description: "网络错误，请稍后重试",
            });
        }
    };

    const handleBookClick = (bookId) => {
        router.push(`/admin/quotes?bookId=${bookId}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks();
    };

    return (
        <div className="space-y-6">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>书籍列表</CardTitle>
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex items-center space-x-2">
                            <Input
                                type="search"
                                placeholder="搜索书籍..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-[200px]"
                            />
                            <Button type="submit" size="icon" variant="ghost">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    添加新书
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>添加新书</DialogTitle>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="bookName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>书名</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入书名" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="author"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>作者</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入作者" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cover"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>封面链接</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入封面图片链接" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>国家</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入国家" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full">提交</Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">书名</TableHead>
                                <TableHead className="w-[30%]">作者</TableHead>
                                <TableHead className="w-[20%]">添加时间</TableHead>
                                <TableHead className="w-[10%] text-right">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.length > 0 ? (
                                books.map((book) => (
                                    <TableRow key={book.id}>
                                        <TableCell className="font-medium">{book.bookName}</TableCell>
                                        <TableCell>{book.author}</TableCell>
                                        <TableCell>{new Date(book.addTime).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleBookClick(book.id)}
                                            >
                                                管理金句
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                                        暂无书籍数据
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-center space-x-2 py-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {generatePagination(currentPage, totalPages).map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === '...' ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            isActive={page === currentPage}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </div>
    );
}