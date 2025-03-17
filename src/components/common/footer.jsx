import Logo from "@/components/common/logo";

export default function Footer() {
    return (
        <footer className="border-t mt-auto border-gray-200">
            <div className="flex justify-center items-center gap-2 text-sm text-gray-300 py-4">
                <Logo className="mx-auto" />
                <p className="text-sm text-gray-300">Powered by Yaxing_Guo</p>
            </div>
        </footer>
    );
}