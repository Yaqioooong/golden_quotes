"use client"
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { get, post } from "@/lib/request";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
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

const formSchema = z.object({
    content: z.string().min(1, "金句内容不能为空"),
    srcChapter: z.string().min(1, "章节不能为空"),
});

export default function QuotesPanel() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookId = searchParams.get('bookId');
    const [quotes, setQuotes] = useState([]);
    const [book, setBook] = useState(null);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingQuote, setEditingQuote] = useState(null);
    const [quoteToDelete, setQuoteToDelete] = useState(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const { toast } = useToast();
    const [tokenName, setTokenName] = useState('');
    const [tokenValue, setTokenValue] = useState('');
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
            srcChapter: "",
        },
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        // 只在客户端访问localStorage
        if (typeof window !== 'undefined') {
            setTokenName(localStorage.getItem('tokenName') || '');
            setTokenValue(localStorage.getItem('tokenValue') || '');
        }
    }, []);

    useEffect(() => {
        const fetchQuotes = async () => {
            if (!bookId) return;
            try {
                const response = await get(`${apiUrl}/api/v1/quotes/public/list?bookId=${bookId}&page=${currentPage}&pageSize=${pageSize}`);
                const data = await response.json();
                if (data.success && data.data) {
                    setQuotes(data.data.quotesList.records || []);
                    setTotalPages(data.data.quotesList.pages || 1);
                    setBook({
                        bookName: data.data.bookName,
                        author: data.data.author
                    });
                }
            } catch (error) {
                console.error('Error fetching quotes:', error);
                toast({
                    variant: "destructive",
                    title: "获取金句列表失败",
                    description: "请稍后重试",
                });
            }
        };
        fetchQuotes();
    }, [bookId, currentPage, apiUrl]);

    const QuoteContent = () => {

        return (
            <div className="backdrop-blur-sm bg-white/50 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[75%] text-center">金句内容</TableHead>
                            <TableHead className="w-[10%]">章节</TableHead>
                            <TableHead className="w-[15%] text-center">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quotes.length > 0 ? (
                            quotes.map((quote) => (
                                <TableRow key={quote.id}>
                                    <TableCell className="font-medium">{quote.content}</TableCell>
                                    <TableCell>{quote.srcChapter || '未标注'}</TableCell>
                                    <TableCell className="text-left">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleEdit(quote)}
                                            >
                                                编辑
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => {
                                                    setQuoteToDelete(quote);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                删除
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-gray-500">
                                    暂无金句数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        );
    };

    const onSubmit = async (values) => {
        if (!bookId) return;
        try {
            const url = editingQuote
                ? `${apiUrl}/api/v1/quotes/admin/update`
                : `${apiUrl}/api/v1/quotes/admin/add`;
            const body = editingQuote
                ? { ...values, id: editingQuote.id }
                : { ...values, bookId: bookId };

            const response = await post(url, body);

            const data = await response.json();
            if (data.success) {
                setCurrentPage(1);
                const quotesResponse = await get(`${apiUrl}/api/v1/quotes/public/list?bookId=${bookId}&page=1&pageSize=${pageSize}`);
                const quotesData = await quotesResponse.json();
                if (quotesData.success && quotesData.data) {
                    setQuotes(quotesData.data.quotesList.records || []);
                    setTotalPages(quotesData.data.quotesList.pages || 1);
                }
                
                form.reset();
                setOpen(false);
                setEditingQuote(null);
                toast({
                    title: "操作成功",
                    description: editingQuote ? "金句已更新" : "金句已添加",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "操作失败",
                    description: data.message || "请稍后重试",
                });
            }
        } catch (error) {
            console.error('Error adding quote:', error);
            toast({
                variant: "destructive",
                title: "操作失败",
                description: "网络错误，请稍后重试",
            });
        }
    };

    const handleDelete = async () => {
        if (!quoteToDelete || !bookId) return;

        try {
            const response = await post(`${apiUrl}/api/v1/quotes/admin/delete`, {
                id: quoteToDelete.id
            });

            const data = await response.json();
            if (data.success) {
                setCurrentPage(1);
                const quotesResponse = await get(`${apiUrl}/api/v1/quotes/public/list?bookId=${bookId}&page=1&pageSize=${pageSize}`);
                const quotesData = await quotesResponse.json();
                if (quotesData.success && quotesData.data) {
                    setQuotes(quotesData.data.quotesList.records || []);
                    setTotalPages(quotesData.data.quotesList.pages || 1);
                }
                
                setDeleteDialogOpen(false);
                setQuoteToDelete(null);
                toast({
                    title: "操作成功",
                    description: "金句已删除",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "删除失败",
                    description: data.message || "请稍后重试",
                });
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            toast({
                variant: "destructive",
                title: "删除失败",
                description: "网络错误，请稍后重试",
            });
        }
    };

    if (!bookId) {
        return <div className="text-center text-gray-500">请选择一本书</div>;
    }

    return (
        <main className="flex-1 w-full max-w-5xl mx-auto mt-4 mb-8 overflow-y-auto h-[calc(100vh-2rem)]">
            <div className="backdrop-blur-md bg-white/30 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-serif font-semibold">{book?.bookName || '加载中...'}</h2>
                        <p className="text-sm font-serif text-gray-600 mt-1">{book?.author || ''}</p>
                    </div>
                    <Dialog open={open} onOpenChange={(open) => {
                        if (!open) {
                            setEditingQuote(null);
                            form.reset();
                        } else if (!editingQuote) {
                            form.reset({
                                content: "",
                                srcChapter: ""
                            });
                        }
                        setOpen(open);
                    }}>
                        <DialogTrigger asChild>
                            <Button>添加金句</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{editingQuote ? '编辑金句' : '添加金句'}</DialogTitle>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>金句内容</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="请输入金句内容" className="min-h-[100px]" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="srcChapter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>章节</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="请输入章节" {...field} />
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

                <Suspense fallback={<div className="text-center py-4">加载中...</div>}>
                    <QuoteContent />
                </Suspense>

                <div className="flex items-center justify-between px-4 py-3 pb-6">
                    <div className="flex items-center gap-2">
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
                </div>
                
                {/* 返回按钮 */}
                <div className="flex justify-center mt-4">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin/books')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回书籍管理
                    </Button>
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>确认删除</DialogTitle>
                        <DialogDescription>
                            确定要删除这条金句吗？此操作无法撤销。
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            取消
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            删除
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}