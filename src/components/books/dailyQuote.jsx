
"use client";

import { useEffect, useState } from "react";

export default function DailyQuote() {
  const [quoteData, setQuoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;


  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/v1/quotes/public/daily`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.code === '200' && data.data) {
          setQuoteData(data.data);
          setError(null);
        } else {
          throw new Error(data.message || '获取数据失败');
        }
      } catch (err) {
        console.error('获取每日金句失败:', err);
        setError(err.message || '获取数据时发生错误');
        setQuoteData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyQuote();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 rounded mt-14 text-center">
        <p className="text-xl font-serif">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded mt-14 text-center">
        <p className="text-xl font-serif text-red-600">{error}</p>
      </div>
    );
  }

  return (
      <div
          className=" p-4 rounded mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 auto-rows-auto gap-4 relative">
          <div className="col-span-1 row-span-1">
              <h1 className="text-right text-3xl font-extrabold font-serif text-amber-600 underline">"每日金句"</h1>
          </div>
          <div
              className="col-start-1 col-end-2 row-start-2 row-end-3 sm:col-start-2 sm:col-end-5 sm:row-start-2 sm:row-end-3 text-left">
              <p className={"text-xl font-serif font-bold"}>{quoteData.quotes.content}</p>
              <p className={"text font-serif font-bold text-right"}>——《{quoteData.bookName}》</p>
              <p className={"text-sm font-serif text-gray-600 text-right mt-2"}>{quoteData.author}</p>
          </div>
      </div>
  )
}