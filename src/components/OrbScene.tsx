import { useEffect, useRef } from 'react'

export default function OrbScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    const resize = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width || 500
      canvas.height = rect.height || 500
    }

    resize()
    window.addEventListener('resize', resize)

    // Shard geometry
    const crystalFaces = [
      [0, 2, 3], [0, 3, 4], [0, 4, 5], [0, 5, 2],
      [1, 3, 2], [1, 4, 3], [1, 5, 4], [1, 2, 5]
    ]
    const crystalVerts = [
      [0, -1.8, 0], [0, 1.8, 0], [1.1, 0, 0],
      [0, 0, 1.1], [-1.1, 0, 0], [0, 0, -1.1]
    ]

    const items = [
      { x: 0.5, y: 0.5, size: 75, rx: 0.3, ry: 0.5, rz: 0.2, drx: 0.005, dry: 0.007, drz: 0.002, color: 'crystal' },
      { x: 0.75, y: 0.28, size: 45, rx: 1.1, ry: -0.4, rz: 0.8, drx: -0.006, dry: 0.008, drz: 0.003, color: 'obsidian' },
      { x: 0.78, y: 0.72, size: 48, rx: -0.8, ry: 0.9, rz: -0.5, drx: 0.007, dry: -0.005, drz: 0.004, color: 'obsidian' },
      { x: 0.24, y: 0.26, size: 38, rx: 0.4, ry: 1.2, rz: -0.6, drx: 0.005, dry: 0.008, drz: -0.004, color: 'ruby' },
      { x: 0.22, y: 0.68, size: 40, rx: 0.9, ry: -0.8, rz: 0.3, drx: -0.007, dry: 0.006, drz: 0.005, color: 'ruby' },
      { x: 0.55, y: 0.88, size: 55, rx: -1.2, ry: 0.4, rz: 0.7, drx: 0.006, dry: 0.005, drz: -0.003, color: 'crystal' }
    ]

    let time = 0

    const draw = () => {
      time += 0.015
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Background atmospheric glow
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, Math.min(w, h) * 0.6)
      grad.addColorStop(0, 'rgba(225, 29, 72, 0.35)')
      grad.addColorStop(0.5, 'rgba(150, 15, 30, 0.15)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      items.forEach((item, idx) => {
        item.rx += item.drx
        item.ry += item.dry
        item.rz += item.drz

        const cx = item.x * w
        const cy = item.y * h + Math.sin(time + idx) * 12

        // Rotate vertices
        const rotated = crystalVerts.map(v => {
          let [x, y, z] = [v[0] * item.size, v[1] * item.size, v[2] * item.size]
          
          // Rotate X
          let y1 = y * Math.cos(item.rx) - z * Math.sin(item.rx)
          let z1 = y * Math.sin(item.rx) + z * Math.cos(item.rx)
          
          // Rotate Y
          let x2 = x * Math.cos(item.ry) + z1 * Math.sin(item.ry)
          let z2 = -x * Math.sin(item.ry) + z1 * Math.cos(item.ry)

          // Rotate Z
          let x3 = x2 * Math.cos(item.rz) - y1 * Math.sin(item.rz)
          let y3 = x2 * Math.sin(item.rz) + y1 * Math.cos(item.rz)

          return [x3 + cx, y3 + cy, z2]
        })

        // Draw faces
        crystalFaces.forEach(face => {
          const p0 = rotated[face[0]]
          const p1 = rotated[face[1]]
          const p2 = rotated[face[2]]

          // Normal Z for lighting / culling
          const nz = (p1[0] - p0[0]) * (p2[1] - p0[1]) - (p1[1] - p0[1]) * (p2[0] - p0[0])
          const isFront = nz > 0

          ctx.beginPath()
          ctx.moveTo(p0[0], p0[1])
          ctx.lineTo(p1[0], p1[1])
          ctx.lineTo(p2[0], p2[1])
          ctx.closePath()

          if (item.color === 'ruby') {
            ctx.fillStyle = isFront ? 'rgba(225, 29, 72, 0.45)' : 'rgba(180, 20, 50, 0.15)'
            ctx.strokeStyle = 'rgba(255, 80, 100, 0.85)'
          } else if (item.color === 'obsidian') {
            ctx.fillStyle = 'rgba(24, 24, 30, 0.85)'
            ctx.strokeStyle = 'rgba(255, 60, 80, 0.5)'
          } else {
            ctx.fillStyle = isFront ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.08)'
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
          }

          ctx.fill()
          ctx.lineWidth = 1.2
          ctx.stroke()
        })
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    />
  )
}