'use client'

import React, { useState, Suspense } from 'react'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// SplineScene
//
// To use your own Spline scene, replace SPLINE_URL with your exported URL from
// https://spline.design, e.g.:
//
//   const SPLINE_URL = 'https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode'
//
// The fallback (FuturisticFallback) renders automatically while Spline loads,
// or if no URL is provided / the scene fails to load.
// ─────────────────────────────────────────────────────────────────────────────

const SPLINE_URL = '' // <-- INSERT YOUR SPLINE URL HERE

const floatingLabels = [
  { label: 'Website', color: '#60A5FA', delay: 0, x: '15%', y: '20%' },
  { label: 'SEO', color: '#A78BFA', delay: 0.4, x: '75%', y: '15%' },
  { label: 'Leads', color: '#34D399', delay: 0.8, x: '80%', y: '65%' },
  { label: 'Branding', color: '#F472B6', delay: 1.2, x: '10%', y: '70%' },
  { label: 'Automatisering', color: '#FBBF24', delay: 1.6, x: '50%', y: '10%' },
  { label: 'Konvertering', color: '#06B6D4', delay: 2.0, x: '45%', y: '85%' },
]

function FloatingLabel({
  label,
  color,
  delay,
  x,
  y,
}: {
  label: string
  color: string
  delay: number
  x: string
  y: string
}) {
  return (
    <motion.div
      className="absolute px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border whitespace-nowrap z-10"
      style={{
        left: x,
        top: y,
        color,
        borderColor: `${color}40`,
        background: `${color}18`,
        boxShadow: `0 0 12px ${color}40`,
      }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: [0, 1, 1, 0.8, 1],
        scale: [0.7, 1, 1, 0.98, 1],
        y: [0, -8, 0, -4, 0],
      }}
      transition={{
        delay,
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {label}
    </motion.div>
  )
}

function BrowserWindow({
  className = '',
  delay = 0,
  title = 'minjemmeside.dk',
  accent = '#60A5FA',
  style,
}: {
  className?: string
  delay?: number
  title?: string
  accent?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.div
      className={`absolute rounded-xl overflow-hidden backdrop-blur-md border border-white/10 shadow-2xl ${className}`}
      style={{ background: 'rgba(10,10,30,0.8)', ...style }}
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: [0, -8, 0], rotateX: [10, 0, 0] }}
      transition={{ delay, duration: 0.8, y: { delay: delay + 0.8, duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <div className="ml-2 flex-1 h-4 rounded bg-white/5 flex items-center px-2">
          <span className="text-[9px] text-gray-500 truncate">{title}</span>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="p-3 space-y-2">
        <div className="h-16 rounded-lg" style={{ background: `${accent}18`, border: `1px solid ${accent}20` }} />
        <div className="flex gap-2">
          <div className="h-3 w-2/3 rounded bg-white/5" />
          <div className="h-3 flex-1 rounded bg-white/5" />
        </div>
        <div className="h-3 w-1/2 rounded bg-white/5" />
        <div className="flex gap-1.5 mt-3">
          <div className="h-6 w-20 rounded-lg" style={{ background: `${accent}30`, border: `1px solid ${accent}40` }} />
          <div className="h-6 w-16 rounded-lg bg-white/5" />
        </div>
      </div>
    </motion.div>
  )
}

function DataOrb({
  x, y, size, color, delay,
}: {
  x: string; y: string; size: number; color: string; delay: number
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}60 0%, ${color}10 60%, transparent 100%)`,
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.4, 0.9, 0.4],
      }}
      transition={{ delay, duration: 3 + delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

function FuturisticFallback() {
  return (
    <div className="relative w-full h-full min-h-[420px] overflow-hidden select-none">
      {/* Neon grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* Glow orbs */}
      <DataOrb x="55%" y="30%" size={180} color="#8B5CF6" delay={0} />
      <DataOrb x="25%" y="55%" size={120} color="#3B82F6" delay={1} />
      <DataOrb x="70%" y="55%" size={100} color="#06B6D4" delay={1.5} />

      {/* Floating browser windows */}
      <BrowserWindow
        className="w-52 sm:w-64"
        style={{ left: '5%', top: '15%' } as React.CSSProperties}
        delay={0.2}
        title="virksomhed.dk"
        accent="#60A5FA"
      />
      <BrowserWindow
        className="w-48 sm:w-56"
        style={{ right: '4%', top: '30%' } as React.CSSProperties}
        delay={0.5}
        title="frisør-salon.dk"
        accent="#A78BFA"
      />
      <BrowserWindow
        className="w-44 sm:w-52 hidden sm:block"
        style={{ left: '22%', bottom: '8%' } as React.CSSProperties}
        delay={0.8}
        title="restaurant-abc.dk"
        accent="#34D399"
      />

      {/* Central dashboard card */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 sm:w-72 rounded-2xl overflow-hidden z-20"
        style={{
          background: 'rgba(10,10,40,0.9)',
          border: '1px solid rgba(139,92,246,0.35)',
          boxShadow: '0 0 40px rgba(139,92,246,0.3), 0 20px 60px rgba(0,0,0,0.5)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ duration: 0.9, y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-semibold text-violet-300">Live statistik</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="p-4 space-y-3">
          {[
            { label: 'Nye besøgende', val: '+127%', color: '#34D399' },
            { label: 'Konverteringsrate', val: '4.8%', color: '#60A5FA' },
            { label: 'Henvendelser', val: '+43', color: '#A78BFA' },
          ].map(({ label, val, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-xs font-bold" style={{ color }}>{val}</span>
            </div>
          ))}
          <div className="h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)' }}
              initial={{ width: '0%' }}
              animate={{ width: '68%' }}
              transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Floating labels */}
      {floatingLabels.map((item) => (
        <FloatingLabel key={item.label} {...item} />
      ))}

      {/* Orbiting data points */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            background: i % 2 === 0 ? '#8B5CF6' : '#3B82F6',
            boxShadow: `0 0 8px ${i % 2 === 0 ? '#8B5CF6' : '#3B82F6'}`,
          }}
          animate={{
            x: Math.cos((deg * Math.PI) / 180) * 130 - 4,
            y: Math.sin((deg * Math.PI) / 180) * 90 - 4,
            rotate: [deg, deg + 360],
          }}
          transition={{
            x: { duration: 12, repeat: Infinity, ease: 'linear', delay: i * 0.3 },
            y: { duration: 12, repeat: Infinity, ease: 'linear', delay: i * 0.3 },
          }}
        />
      ))}
    </div>
  )
}

export default function SplineScene() {
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [splineFailed, setSplineFailed] = useState(false)

  const showSpline = SPLINE_URL && !splineFailed

  return (
    <div className="relative w-full h-full">
      {/* Spline scene — shown when URL is configured and loads successfully */}
      {showSpline && (
        <Suspense fallback={null}>
          <iframe
            src={SPLINE_URL}
            className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-700 ${
              splineLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setSplineLoaded(true)}
            onError={() => setSplineFailed(true)}
            title="Spline 3D Scene"
            allow="autoplay"
          />
        </Suspense>
      )}

      {/* Fallback — shown until Spline loads, or always when no URL */}
      {(!showSpline || !splineLoaded) && <FuturisticFallback />}
    </div>
  )
}
