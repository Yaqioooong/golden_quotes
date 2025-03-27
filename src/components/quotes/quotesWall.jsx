import { Suspense } from "react";
import QuotesClient from "./quotesClient";

export default function QuotesWall() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
                <QuotesClient />
            </Suspense>
        </div>
    );
}
