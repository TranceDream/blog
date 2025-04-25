"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { NeonBox } from "@/components/cyberpunk-effects"
import { useTheme } from "next-themes"

export interface FriendLink {
  avatar: string
  name: string
  url: string
  description: string
}

interface FriendLinkCardProps {
  friend: FriendLink
}

export function FriendLinkCard({ friend }: FriendLinkCardProps) {
  const { theme } = useTheme()
  const isCyberpunk = theme === "cyberpunk"

  return (
    <NeonBox className="h-full">
      <Card
        className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg ${isCyberpunk ? "border-secondary/50" : ""}`}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
              <Image src={friend.avatar || "/placeholder.webp"} alt={friend.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <Link
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-lg font-bold hover:underline ${isCyberpunk ? "text-secondary" : ""}`}
              >
                {friend.name}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground text-center sm:text-left">{friend.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </NeonBox>
  )
}

interface FriendLinksProps {
  friends: FriendLink[]
}

export function FriendLinks({ friends }: FriendLinksProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friends.map((friend) => (
        <FriendLinkCard key={friend.url} friend={friend} />
      ))}
    </div>
  )
}
