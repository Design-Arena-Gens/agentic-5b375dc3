import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function WindowsOS() {
  const [time, setTime] = useState('')
  const [windows, setWindows] = useState([])
  const [startMenuOpen, setStartMenuOpen] = useState(false)
  const [nextId, setNextId] = useState(1)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const createWindow = (title, content, icon = '📁') => {
    const newWindow = {
      id: nextId,
      title,
      content,
      icon,
      x: 50 + (nextId * 30) % 200,
      y: 50 + (nextId * 30) % 150,
      width: 600,
      height: 400,
      minimized: false,
      maximized: false,
      zIndex: nextId
    }
    setWindows([...windows, newWindow])
    setNextId(nextId + 1)
    setStartMenuOpen(false)
  }

  const closeWindow = (id) => {
    setWindows(windows.filter(w => w.id !== id))
  }

  const minimizeWindow = (id) => {
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: true } : w))
  }

  const restoreWindow = (id) => {
    setWindows(windows.map(w => w.id === id ? { ...w, minimized: false, maximized: false } : w))
    bringToFront(id)
  }

  const maximizeWindow = (id) => {
    setWindows(windows.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w))
  }

  const bringToFront = (id) => {
    const maxZ = Math.max(...windows.map(w => w.zIndex), 0)
    setWindows(windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w))
  }

  const handleDrag = (id, e) => {
    if (e.target.closest('.window-controls')) return

    const window = windows.find(w => w.id === id)
    if (window.maximized) return

    const startX = e.clientX - window.x
    const startY = e.clientY - window.y

    const handleMouseMove = (e) => {
      setWindows(windows => windows.map(w =>
        w.id === id ? { ...w, x: e.clientX - startX, y: e.clientY - startY } : w
      ))
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    bringToFront(id)
  }

  return (
    <>
      <Head>
        <title>Windows OS</title>
      </Head>

      <div className="desktop">
        <div className="desktop-icons">
          <div className="desktop-icon" onClick={() => createWindow('My Computer', <MyComputerContent />, '💻')}>
            <div className="icon">💻</div>
            <div className="icon-label">My Computer</div>
          </div>
          <div className="desktop-icon" onClick={() => createWindow('Notepad', <NotepadContent />, '📝')}>
            <div className="icon">📝</div>
            <div className="icon-label">Notepad</div>
          </div>
          <div className="desktop-icon" onClick={() => createWindow('Internet Explorer', <BrowserContent />, '🌐')}>
            <div className="icon">🌐</div>
            <div className="icon-label">Internet Explorer</div>
          </div>
          <div className="desktop-icon" onClick={() => createWindow('Paint', <PaintContent />, '🎨')}>
            <div className="icon">🎨</div>
            <div className="icon-label">Paint</div>
          </div>
        </div>

        {windows.filter(w => !w.minimized).map(window => (
          <div
            key={window.id}
            className={`window ${window.maximized ? 'maximized' : ''}`}
            style={{
              left: window.maximized ? 0 : window.x,
              top: window.maximized ? 0 : window.y,
              width: window.maximized ? '100%' : window.width,
              height: window.maximized ? 'calc(100% - 40px)' : window.height,
              zIndex: window.zIndex
            }}
            onClick={() => bringToFront(window.id)}
          >
            <div className="window-titlebar" onMouseDown={(e) => handleDrag(window.id, e)}>
              <div className="window-title">
                <span className="window-icon">{window.icon}</span>
                {window.title}
              </div>
              <div className="window-controls">
                <button onClick={() => minimizeWindow(window.id)}>_</button>
                <button onClick={() => maximizeWindow(window.id)}>□</button>
                <button onClick={() => closeWindow(window.id)}>×</button>
              </div>
            </div>
            <div className="window-content">
              {window.content}
            </div>
          </div>
        ))}

        <div className="taskbar">
          <button
            className={`start-button ${startMenuOpen ? 'active' : ''}`}
            onClick={() => setStartMenuOpen(!startMenuOpen)}
          >
            <span className="windows-logo">⊞</span> Start
          </button>

          <div className="taskbar-windows">
            {windows.map(window => (
              <button
                key={window.id}
                className={`taskbar-window ${!window.minimized ? 'active' : ''}`}
                onClick={() => window.minimized ? restoreWindow(window.id) : minimizeWindow(window.id)}
              >
                <span>{window.icon}</span> {window.title}
              </button>
            ))}
          </div>

          <div className="system-tray">
            <span>🔊</span>
            <span>📶</span>
            <span className="time">{time}</span>
          </div>
        </div>

        {startMenuOpen && (
          <div className="start-menu">
            <div className="start-menu-header">Windows OS</div>
            <div className="start-menu-items">
              <div className="start-menu-item" onClick={() => createWindow('My Computer', <MyComputerContent />, '💻')}>
                <span>💻</span> My Computer
              </div>
              <div className="start-menu-item" onClick={() => createWindow('Notepad', <NotepadContent />, '📝')}>
                <span>📝</span> Notepad
              </div>
              <div className="start-menu-item" onClick={() => createWindow('Internet Explorer', <BrowserContent />, '🌐')}>
                <span>🌐</span> Internet Explorer
              </div>
              <div className="start-menu-item" onClick={() => createWindow('Paint', <PaintContent />, '🎨')}>
                <span>🎨</span> Paint
              </div>
              <div className="start-menu-item" onClick={() => createWindow('Calculator', <CalculatorContent />, '🔢')}>
                <span>🔢</span> Calculator
              </div>
              <div className="start-menu-item" onClick={() => createWindow('File Explorer', <FileExplorerContent />, '📂')}>
                <span>📂</span> File Explorer
              </div>
            </div>
            <div className="start-menu-footer">
              <button onClick={() => alert('Shutting down...')}>⏻ Shut Down</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function MyComputerContent() {
  return (
    <div className="app-content">
      <div className="file-list">
        <div className="file-item">
          <span className="file-icon">💾</span>
          <span>Local Disk (C:)</span>
        </div>
        <div className="file-item">
          <span className="file-icon">💿</span>
          <span>CD Drive (D:)</span>
        </div>
        <div className="file-item">
          <span className="file-icon">📁</span>
          <span>Documents</span>
        </div>
        <div className="file-item">
          <span className="file-icon">🖼️</span>
          <span>Pictures</span>
        </div>
      </div>
    </div>
  )
}

function NotepadContent() {
  const [text, setText] = useState('Welcome to Notepad!\n\nType your text here...')
  return (
    <div className="app-content">
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}

function BrowserContent() {
  return (
    <div className="app-content">
      <div className="browser">
        <div className="browser-toolbar">
          <input type="text" className="address-bar" defaultValue="https://www.example.com" />
          <button>Go</button>
        </div>
        <div className="browser-content">
          <h1>Welcome to Internet Explorer</h1>
          <p>This is a simulated browser window.</p>
          <p>In a real Windows environment, you could browse the web from here.</p>
        </div>
      </div>
    </div>
  )
}

function PaintContent() {
  const [drawing, setDrawing] = useState(false)
  const [color, setColor] = useState('#000000')

  const startDrawing = (e) => {
    setDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setDrawing(false)
  }

  const draw = (e) => {
    if (!drawing && e.type !== 'mousedown') return
    const canvas = e.target
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.fillStyle = color
    ctx.fillRect(x - 2, y - 2, 4, 4)
  }

  return (
    <div className="app-content">
      <div className="paint-toolbar">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <button onClick={(e) => {
          const canvas = e.target.closest('.app-content').querySelector('canvas')
          const ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }}>Clear</button>
      </div>
      <canvas
        className="paint-canvas"
        width={560}
        height={320}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
      />
    </div>
  )
}

function CalculatorContent() {
  const [display, setDisplay] = useState('0')
  const [equation, setEquation] = useState('')

  const handleClick = (value) => {
    if (value === '=') {
      try {
        const result = eval(equation + display)
        setDisplay(String(result))
        setEquation('')
      } catch {
        setDisplay('Error')
      }
    } else if (value === 'C') {
      setDisplay('0')
      setEquation('')
    } else if (['+', '-', '*', '/'].includes(value)) {
      setEquation(display + value)
      setDisplay('0')
    } else {
      setDisplay(display === '0' ? value : display + value)
    }
  }

  return (
    <div className="app-content calculator">
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+', 'C'].map(btn => (
          <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
        ))}
      </div>
    </div>
  )
}

function FileExplorerContent() {
  return (
    <div className="app-content">
      <div className="explorer-path">C:\Users\Guest\Documents</div>
      <div className="file-list">
        <div className="file-item">
          <span className="file-icon">📁</span>
          <span>Projects</span>
        </div>
        <div className="file-item">
          <span className="file-icon">📄</span>
          <span>document.txt</span>
        </div>
        <div className="file-item">
          <span className="file-icon">🖼️</span>
          <span>photo.jpg</span>
        </div>
        <div className="file-item">
          <span className="file-icon">📊</span>
          <span>spreadsheet.xlsx</span>
        </div>
      </div>
    </div>
  )
}
