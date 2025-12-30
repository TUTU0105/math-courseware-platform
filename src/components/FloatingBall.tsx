'use client'

import { useState, useRef, useEffect } from 'react'
import { Pen, Undo, Trash2, Download, Minus } from 'lucide-react'

interface FloatingBallProps {
  coursewareId: string
}

type ColorType = '#ff0000' | '#ffa500' | '#ffff00' | '#00ff00' | '#0000ff' | '#ffc0cb'
type LineWidthType = 1 | 3 | 6

export default function FloatingBall({ coursewareId }: FloatingBallProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight / 2 })
  const [selectedColor, setSelectedColor] = useState<ColorType>('#ff0000')
  const [lineWidth, setLineWidth] = useState<LineWidthType>(3)
  const [isDrawing, setIsDrawing] = useState(false)
  
  const ballRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const historyRef = useRef<ImageData[]>([])
  const currentStrokeRef = useRef<{ x: number, y: number }[]>([])

  const colors: { value: ColorType, name: string }[] = [
    { value: '#ff0000', name: '红' },
    { value: '#ffa500', name: '橙' },
    { value: '#ffff00', name: '黄' },
    { value: '#00ff00', name: '绿' },
    { value: '#0000ff', name: '蓝' },
    { value: '#ffc0cb', name: '粉' }
  ]

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging && !isOpen) {
      setIsDragging(true)
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      dragOffset.current = {
        x: clientX - position.x,
        y: clientY - position.y
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const newX = clientX - dragOffset.current.x
      const newY = clientY - dragOffset.current.y
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 60, newX)),
        y: Math.max(0, Math.min(window.innerHeight - 60, newY))
      })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
    }
  }

  const handleBallClick = (e: React.MouseEvent) => {
    if (!isDragging) {
      e.stopPropagation()
      setIsOpen(!isOpen)
    }
  }

  // Canvas绘制功能
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    setIsDrawing(true)
    currentStrokeRef.current = []
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const x = clientX - rect.left
    const y = clientY - rect.top
    currentStrokeRef.current.push({ x, y })
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    e.stopPropagation()
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    const x = clientX - rect.left
    const y = clientY - rect.top

    if (currentStrokeRef.current.length > 0) {
      const prevPoint = currentStrokeRef.current[currentStrokeRef.current.length - 1]
      
      ctx.beginPath()
      ctx.moveTo(prevPoint.x, prevPoint.y)
      ctx.lineTo(x, y)
      ctx.strokeStyle = selectedColor
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
    }

    currentStrokeRef.current.push({ x, y })
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        // 保存历史记录
        historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        if (historyRef.current.length > 10) {
          historyRef.current.shift()
        }
      }
    }
  }

  const handleUndo = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx && historyRef.current.length > 0) {
      historyRef.current.pop()
      if (historyRef.current.length > 0) {
        ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const handleClear = () => {
    if (confirm('确定要清空所有标注吗？')) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        historyRef.current = []
      }
    }
  }

  const handleSave = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL('image/png')
    
    try {
      await fetch('/api/annotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coursewareId,
          content: dataUrl
        })
      })
      alert('标注已保存')
    } catch (error) {
      alert('保存失败')
    }
  }

  // 加载已保存的标注
  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        const res = await fetch(`/api/annotation?coursewareId=${coursewareId}`)
        const data = await res.json()
        if (data.success && data.data) {
          const canvas = canvasRef.current
          const ctx = canvas?.getContext('2d')
          const img = new Image()
          img.onload = () => {
            ctx?.drawImage(img, 0, 0)
            if (canvas && ctx) {
              historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
            }
          }
          img.src = data.data
        }
      } catch (error) {
        console.error('Failed to load annotations:', error)
      }
    }

    loadAnnotations()
  }, [coursewareId])

  return (
    <>
      {/* Canvas层 */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-10 pointer-events-none"
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {/* 悬浮球 */}
      <div
        ref={ballRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onClick={handleBallClick}
        className={`fixed z-50 w-14 h-14 rounded-full cursor-pointer flex items-center justify-center transition-shadow ${
          isOpen ? 'hidden' : ''
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          background: 'linear-gradient(145deg, #8A9BB5, #6b80a1)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        <Pen className="text-white w-7 h-7" />
      </div>

      {/* 工具栏 */}
      {isOpen && (
        <div
          className="fixed z-50 bg-white rounded-2xl shadow-2xl p-4 space-y-4"
          style={{
            left: `${position.x - 100}px`,
            top: `${position.y}px`,
            maxWidth: '200px'
          }}
        >
          {/* 颜色选择 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">颜色</div>
            <div className="grid grid-cols-3 gap-2">
              {colors.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* 粗细选择 */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">粗细</div>
            <div className="flex gap-2">
              {[1, 3, 6].map(width => (
                <button
                  key={width}
                  onClick={() => setLineWidth(width as LineWidthType)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    lineWidth === width ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Minus className={`w-4 h-4 mx-auto ${width === 6 ? 'w-6 h-6' : width === 3 ? 'w-4 h-4' : 'w-2 h-2'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-2 pt-2 border-t">
            <button
              onClick={handleUndo}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Undo className="w-4 h-4" />
              <span className="text-sm">返回</span>
            </button>
            <button
              onClick={handleClear}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">取消</span>
            </button>
            <button
              onClick={handleSave}
              className="w-full flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">保存标注</span>
            </button>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            关闭
          </button>
        </div>
      )}
    </>
  )
}
