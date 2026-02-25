function HeaderTab({name, link}: {name: string, link: string}) {
    return (
        <a 
        className="font-medium w-30 py-1.5 rounded-md text-center bg-zinc-700 transition hover:bg-zinc-500" 
        href={link}
        >
            {name}
        </a>
    )
}



export default function Header() {
    return (
        <header className="bg-primary-green">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-slate-50 font-semibold tracking-tight">
            <p className="text-2xl">Bread Of Life Church</p>
            <div className="flex gap-4">
                <HeaderTab 
                    name={"About"}
                    link={"#about"}
                />
                <HeaderTab 
                    name={"Events"}
                    link={"#events"}
                />
                <HeaderTab 
                    name={"Give"}
                    link={"#give"}
                />
                <HeaderTab 
                    name={"Contact"}
                    link={"#contact"}
                />
                <HeaderTab 
                    name={"Resources"}
                    link={"#resources"}
                />
            </div> 
          </div>
        </header>
    )
}