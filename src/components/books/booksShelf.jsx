"use client"
import React, { useState, useEffect } from "react";
import BookCard from "@/components/books/bookCard";

export default function BooksShelf() {
    const [books, setBooks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useState({ bookName: "", author: "" });
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSearch = ({ bookName, author }) => {
        setSearchParams({ bookName, author });
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleSearchUpdate = (event) => {
            setSearchParams(event.detail);
        };

        window.addEventListener('updateSearch', handleSearchUpdate);
        return () => window.removeEventListener('updateSearch', handleSearchUpdate);
    }, []);

    useEffect(() => {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams({
            ...searchParams,
            page: currentPage,
            pageSize: 10
        });
        fetch(`${apiUrl}/api/v1/books/public/list?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(response => {
                if (response.code === '200' && response.data) {
                    setBooks(response.data.records || []);
                    setTotalPages(response.data.pages || 1);
                    setError(null);
                } else {
                    throw new Error(response.message || '获取数据失败');
                }
            })
            .catch(error => {
                console.error('Error fetching books:', error);
                setError(error.message || '获取数据失败，请稍后重试');
                setBooks([]);
                setTotalPages(1);
            })
            .finally(() => setLoading(false));
    }, [searchParams, currentPage, apiUrl]);

    return (
        <div className="p-4 rounded mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            )}
            {error && (
                <div className="col-span-full text-center text-red-500 py-4">
                    {error}
                </div>
            )}
            {!loading && !error && books.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-4">
                    暂无数据
                </div>
            )}
            {books.map((book, index) => (
                <BookCard 
                    key={book.id || index}
                    title={book.bookName}
                    author={book.author}
                    cover={book.cover}
                    country={book.country}
                    id={book.id}></BookCard>
            ))}
        </div>
  )
}