"use client";
import Header from "@/components/common/header";
import DailyQuote from "@/components/books/dailyQuote";
import SearchArea from "@/components/books/searchArea";
import BooksShelf from "@/components/books/booksShelf";
import Footer from "@/components/common/footer";
import Background from "@/components/common/background";


export default function Books(){
    return (

            <div className="container flex flex-col mx-auto px-4 min-h-screen">
                <Background></Background>
                <Header></Header>
                <DailyQuote></DailyQuote>
                <SearchArea onSearch={(params) => {
                    // 将搜索参数传递给 BooksShelf 组件
                    window.dispatchEvent(new CustomEvent('updateSearch', { detail: params }));
                }}></SearchArea>
                <BooksShelf></BooksShelf>
                <Footer></Footer>
            </div>
    )
}