import Link from "next/link"
import { GlitchText, NeonText } from "@/components/cyberpunk-effects"

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <span className="inline-block font-bold">
          <NeonText>
            <GlitchText text="TranceDream's Blog" />
          </NeonText>
        </span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          首页
        </Link>
        <Link
          href="/archive"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          归档
        </Link>
        <Link
          href="/about"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          关于
        </Link>
      </nav>
    </div>
  )
}
