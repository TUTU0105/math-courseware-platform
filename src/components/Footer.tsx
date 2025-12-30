'use client'

import { useEffect, useState } from 'react'

export default function Footer() {
  const [footerInfo, setFooterInfo] = useState('初中数学课件网 © 2024 版权所有')

  useEffect(() => {
    fetch('/api/system/config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.footerInfo) {
          setFooterInfo(data.data.footerInfo)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <footer className="bg-primary text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>{footerInfo}</p>
      </div>
    </footer>
  )
}
