"use client"
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save } from "lucide-react";

const generalFormSchema = z.object({
    siteName: z.string().min(1, "网站名称不能为空"),
    siteDescription: z.string(),
    logo: z.string().url("请输入有效的URL").optional(),
    contactEmail: z.string().email("请输入有效的邮箱地址"),
    enableRegistration: z.boolean(),
});

const securityFormSchema = z.object({
    passwordMinLength: z.coerce.number().min(6, "密码最小长度不能小于6"),
    sessionTimeout: z.coerce.number().min(5, "会话超时时间不能小于5分钟"),
    enableCaptcha: z.boolean(),
    maxLoginAttempts: z.coerce.number().min(3, "最大登录尝试次数不能小于3"),
});

export default function SettingsManagement() {
    const { toast } = useToast();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const generalForm = useForm({
        resolver: zodResolver(generalFormSchema),
        defaultValues: {
            siteName: "金句网",
            siteDescription: "分享经典书籍中的金句",
            logo: "https://example.com/logo.png",
            contactEmail: "admin@example.com",
            enableRegistration: true,
        },
    });
    
    const securityForm = useForm({
        resolver: zodResolver(securityFormSchema),
        defaultValues: {
            passwordMinLength: 8,
            sessionTimeout: 30,
            enableCaptcha: true,
            maxLoginAttempts: 5,
        },
    });

    useEffect(() => {
        // 这里应该是从API获取系统配置
        // 以下是模拟数据
        const mockGeneralSettings = {
            siteName: "金句网",
            siteDescription: "分享经典书籍中的金句",
            logo: "https://example.com/logo.png",
            contactEmail: "admin@example.com",
            enableRegistration: true,
        };
        
        const mockSecuritySettings = {
            passwordMinLength: 8,
            sessionTimeout: 30,
            enableCaptcha: true,
            maxLoginAttempts: 5,
        };
        
        generalForm.reset(mockGeneralSettings);
        securityForm.reset(mockSecuritySettings);
    }, []);

    const onGeneralSubmit = async (values) => {
        try {
            // 这里应该是向API发送更新系统配置的请求
            console.log("更新一般设置:", values);
            
            toast({
                title: "保存成功",
                description: "一般设置已更新",
            });
        } catch (error) {
            console.error('Error updating general settings:', error);
            toast({
                variant: "destructive",
                title: "保存失败",
                description: "网络错误，请稍后重试",
            });
        }
    };
    
    const onSecuritySubmit = async (values) => {
        try {
            // 这里应该是向API发送更新安全配置的请求
            console.log("更新安全设置:", values);
            
            toast({
                title: "保存成功",
                description: "安全设置已更新",
            });
        } catch (error) {
            console.error('Error updating security settings:', error);
            toast({
                variant: "destructive",
                title: "保存失败",
                description: "网络错误，请稍后重试",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">系统配置</h2>
                <p className="text-muted-foreground mt-2">
                    管理网站的基本设置和安全配置
                </p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="general">一般设置</TabsTrigger>
                    <TabsTrigger value="security">安全设置</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>一般设置</CardTitle>
                            <CardDescription>
                                配置网站的基本信息和功能
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...generalForm}>
                                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                                    <FormField
                                        control={generalForm.control}
                                        name="siteName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>网站名称</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="请输入网站名称" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    显示在浏览器标签和网站顶部的名称
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={generalForm.control}
                                        name="siteDescription"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>网站描述</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="请输入网站描述" 
                                                        {...field} 
                                                        rows={3}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    用于SEO和网站介绍
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={generalForm.control}
                                        name="logo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Logo URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="请输入Logo URL" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    网站Logo的图片链接
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={generalForm.control}
                                        name="contactEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>联系邮箱</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="请输入联系邮箱" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    用于接收系统通知和用户反馈
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={generalForm.control}
                                        name="enableRegistration"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        开放注册
                                                    </FormLabel>
                                                    <FormDescription>
                                                        允许新用户注册账号
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <Button type="submit" className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        保存设置
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>安全设置</CardTitle>
                            <CardDescription>
                                配置网站的安全相关选项
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...securityForm}>
                                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                                    <FormField
                                        control={securityForm.control}
                                        name="passwordMinLength"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>密码最小长度</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min={6} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    用户密码的最小长度要求
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={securityForm.control}
                                        name="sessionTimeout"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>会话超时时间（分钟）</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min={5} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    用户无操作后自动登出的时间
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={securityForm.control}
                                        name="maxLoginAttempts"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>最大登录尝试次数</FormLabel>
                                                <FormControl>
                                                    <Input type="number" min={3} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    达到此次数后账号将被临时锁定
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <FormField
                                        control={securityForm.control}
                                        name="enableCaptcha"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        启用验证码
                                                    </FormLabel>
                                                    <FormDescription>
                                                        在登录和注册页面显示验证码
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    
                                    <Button type="submit" className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        保存设置
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
} 