"use client"
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePagination } from "@/lib/pagination";
import { Search, UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
    username: z.string().min(3, "用户名至少3个字符"),
    password: z.string().min(6, "密码至少6个字符"),
    role: z.string().min(1, "请选择角色"),
});

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [open, setOpen] = useState(false);
    const pageSize = 10;
    const { toast } = useToast();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [banDialogOpen, setBanDialogOpen] = useState(false);
    const [userToBan, setUserToBan] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            role: "user",
        },
    });

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');
            const headers = {
                'Content-Type': 'application/json'
            };
            headers[tokenName] = tokenValue;

            const searchParams = new URLSearchParams({
                page: currentPage,
                pageSize: pageSize
            });
            if (searchTerm) {
                searchParams.append('keyword', searchTerm);
            }

            const response = await fetch(`${apiUrl}/api/v1/user/admin/list?${searchParams}`, {
                headers
            });

            const data = await response.json();
            if (data.success) {
                setUsers(data.data.items);
                setTotalPages(data.data.totalPages);
            } else {
                throw new Error(data.message || '获取用户列表失败');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast({
                variant: "destructive",
                title: "获取用户列表失败",
                description: error.message || "请稍后重试",
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

            const response = await fetch(`${apiUrl}/gq/api/v1/user/admin/add`, {
                method: 'POST',
                headers,
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (data.success) {
                toast({
                    title: "操作成功",
                    description: "用户已添加",
                });
                form.reset();
                setOpen(false);
                fetchUsers();
            } else {
                throw new Error(data.message || '添加用户失败');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast({
                variant: "destructive",
                title: "添加失败",
                description: error.message || "网络错误，请稍后重试",
            });
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');
            const headers = {
                'Content-Type': 'application/json'
            };
            headers[tokenName] = tokenValue;

            const response = await fetch(`${apiUrl}/api/v1/user/admin/update-role`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    userId,
                    role: newRole
                })
            });

            const data = await response.json();
            if (data.success) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                ));

                toast({
                    title: "操作成功",
                    description: "用户角色已更新",
                });
                setRoleDialogOpen(false);
            } else {
                throw new Error(data.message || '更新角色失败');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            toast({
                variant: "destructive",
                title: "更新失败",
                description: error.message || "网络错误，请稍后重试",
            });
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchUsers();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openRoleDialog = (user) => {
        setSelectedUser(user);
        setRoleDialogOpen(true);
    };

    const handleBanUser = async (userId, isBanned) => {
        try {
            const tokenName = localStorage.getItem('tokenName');
            const tokenValue = localStorage.getItem('tokenValue');
            const headers = {
                'Content-Type': 'application/json'
            };
            headers[tokenName] = tokenValue;
    
            const response = await fetch(`${apiUrl}/api/v1/user/admin/ban`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    userId,
                    banned: !isBanned
                })
            });
    
            const data = await response.json();
            if (data.success) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, banned: !isBanned } : user
                ));
    
                toast({
                    title: "操作成功",
                    description: `用户已${!isBanned ? '封禁' : '解封'}`,
                });
                setBanDialogOpen(false);
            } else {
                throw new Error(data.message || '操作失败');
            }
        } catch (error) {
            console.error('Error updating user ban status:', error);
            toast({
                variant: "destructive",
                title: "操作失败",
                description: error.message || "网络错误，请稍后重试",
            });
        }
    };
    
    const openBanDialog = (user) => {
        setUserToBan(user);
        setBanDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <CardTitle>用户列表</CardTitle>
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex items-center space-x-2">
                            <Input
                                type="search"
                                placeholder="搜索用户..."
                                className="w-[200px]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button type="submit" size="icon" variant="ghost">
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    添加用户
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>添加新用户</DialogTitle>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>用户名</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="请输入用户名" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>密码</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="请输入密码" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="role"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>角色</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="选择角色" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="user">普通用户</SelectItem>
                                                            <SelectItem value="admin">管理员</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">添加</Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            {/* 用户列表表格 */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-center">用户名</TableHead>
                            <TableHead className="w-[100px] text-center">角色</TableHead>
                            <TableHead className="w-[150px] text-center">创建时间</TableHead>
                            <TableHead className="w-[100px] text-center">状态</TableHead>
                            <TableHead className="w-[200px] text-center">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="text-center font-medium">{user.username}</TableCell>
                                <TableCell className="text-center">{user.role}</TableCell>
                                <TableCell className="text-center">{new Date(user.createTime).toLocaleDateString()}</TableCell>
                                <TableCell className="text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status === 1 ? '正常' : '禁用'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setRoleDialogOpen(true);
                                            }}
                                        >
                                            修改角色
                                        </Button>
                                        <Button
                                            variant={user.banned ? "outline" : "destructive"}
                                            size="sm"
                                            onClick={() => {
                                                setUserToBan(user);
                                                setBanDialogOpen(true);
                                            }}
                                        >
                                            {user.banned ? '解封' : '封禁'}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* 分页 */}
            <div className="flex justify-center">
                <Pagination>
                    <PaginationContent>
                        {currentPage > 1 && (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                />
                            </PaginationItem>
                        )}
                        {generatePagination(currentPage, totalPages).map((page, i) => (
                            <PaginationItem key={i}>
                                {page === '...' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() => setCurrentPage(page)}
                                        isActive={currentPage === page}
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}
                        {currentPage < totalPages && (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                />
                            </PaginationItem>
                        )}
                    </PaginationContent>
                </Pagination>
            </div>
            {/* 角色修改对话框 */}
            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>修改用户角色</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>用户名</Label>
                                <div className="text-sm text-gray-600">{selectedUser?.username}</div>
                            </div>
                            <div className="space-y-2">
                                <Label>当前角色</Label>
                                <div className="text-sm text-gray-600">{selectedUser?.role}</div>
                            </div>
                            <div className="space-y-2">
                                <Label>新角色</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="选择角色" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="super_admin">超级管理员</SelectItem>
                                        <SelectItem value="admin">管理员</SelectItem>
                                        <SelectItem value="user">普通用户</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>取消</Button>
                                <Button onClick={() => handleRoleChange(selectedUser.id, selectedUser.role)}>确定</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            {/* 封禁/解封对话框 */}
            <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{userToBan?.banned ? '解封用户' : '封禁用户'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            确定要{userToBan?.banned ? '解封' : '封禁'}用户 {userToBan?.username} 吗？
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                onClick={() => setBanDialogOpen(false)}
                            >
                                取消
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleBanUser(userToBan?.id)}
                            >
                                确定
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}