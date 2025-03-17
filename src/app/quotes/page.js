import Background from "@/components/common/background";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import QuotesWall from "@/components/quotes/quotesWall";

export default function Quotes(){
    return (
            <div className="container flex flex-col mx-auto px-4 min-h-screen">
                <Background></Background>
                <Header></Header>
                {/*<Breadcrumbs></Breadcrumbs>*/}
                <QuotesWall></QuotesWall>
                <Footer></Footer>
            </div>
    )
}