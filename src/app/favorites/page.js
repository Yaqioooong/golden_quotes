import Background from "@/components/common/background";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import FavoritesWall from "@/components/favorites/favoritesWall";

export default function Favorites(){
    return (
        <div className="container flex flex-col mx-auto px-4 min-h-screen">
            <Background></Background>
            <Header></Header>
            <FavoritesWall></FavoritesWall>
            <Footer></Footer>
        </div>
    )
} 