'use client'

import Snowfall from 'react-snowfall'
import { useEffect, useState } from 'react'


export default function SnowShow() {
    const [snowFlakes, setSnowFlakes] = useState<HTMLImageElement[]>([]);
    useEffect(() => {
        const snowFlake = document.createElement('img') as HTMLImageElement;
        snowFlake.src = '/snowflake.png'
        setSnowFlakes([snowFlake])
    }, [])

    return (
        <div>
            <Snowfall images={snowFlakes} />
        </div>
    )
}