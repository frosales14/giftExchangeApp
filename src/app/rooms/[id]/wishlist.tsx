'use client'

import { useState } from 'react'
import { addToWishlist, removeFromWishlist } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Gift } from 'lucide-react'

export function Wishlist({ roomId, items, readOnly = false }: { roomId?: string, items: string[], readOnly?: boolean }) {
    const [newItem, setNewItem] = useState('')

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Wishlist
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {(!readOnly && roomId) && (
                    <form
                        action={async (formData) => {
                            if (items.length >= 5) return
                            await addToWishlist(roomId, formData)
                            setNewItem('')
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            name="item"
                            placeholder="I want..."
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            disabled={items.length >= 5}
                        />
                        <Button type="submit" disabled={items.length >= 5 || !newItem}>Add</Button>
                    </form>
                )}

                <ul className="space-y-2">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-muted p-2 rounded-md">
                            <span>{item}</span>
                            {(!readOnly && roomId) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFromWishlist(roomId, item)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            )}
                        </li>
                    ))}
                    {items.length === 0 && (
                        <li className="text-muted-foreground text-sm italic">No items yet.</li>
                    )}
                </ul>
            </CardContent>
        </Card>
    )
}
