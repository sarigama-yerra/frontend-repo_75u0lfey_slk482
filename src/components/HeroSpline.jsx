import React from 'react'
import Spline from '@splinetool/react-spline'

export default function HeroSpline() {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/30 bg-white/40 backdrop-blur h-[280px] md:h-[360px]">
      <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
    </div>
  )
}
