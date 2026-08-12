import { useMemo } from "react"
import { motion } from "framer-motion"

// 1. We create ONE perfect bubble that matches your Figma style
const FigmaBubble = () => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full overflow-visible"
  >
    {/* Main Bubble Outline & Faint Inner Tint */}
    <circle
      cx="50"
      cy="50"
      r="48"
      stroke="#6D86A2"
      strokeWidth="2.5"
      fill="rgba(215, 235, 241, 0.05)"
    />

    {/* Dark Bottom-Right Shadow Crescent */}
    <path
      d="M 30 87 A 44 44 0 0 0 87 30 A 42 42 0 0 1 34 83 Z"
      fill="#2D3A59"
    />

    {/* Mid-Tone Inner Reflection (Just above the dark shadow) */}
    <path
      d="M 40 82 A 36 36 0 0 0 82 40"
      stroke="#6D86A2"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Crisp Bright Top-Left Highlight */}
    <path
      d="M 18 55 A 34 34 0 0 1 55 18"
      stroke="#D7EBF1"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Tiny Secondary Top Highlight Dash */}
    <path
      d="M 66 17 A 38 38 0 0 1 73 20"
      stroke="#D7EBF1"
      strokeWidth="4.5"
      strokeLinecap="round"
    />
  </svg>
)

export default function AnimatedFigmaBubbles() {
  // 2. Generate a stream of 25 bubbles with randomized properties
  // useMemo ensures the random values don't reset on every component re-render
  const bubbles = useMemo(() => {
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }

    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      // 👇 CHANGED HERE: Now sizes will be between 8px and 23px
      size: seededRandom(i * 1.1) * 15 + 8,
      left: seededRandom(i * 2.3) * 100,
      duration: seededRandom(i * 3.7) * 5 + 4,
      delay: seededRandom(i * 4.9) * 8,
      wobbleOffset: seededRandom(i * 5.5) > 0.5 ? 15 : -15,
    }))
  }, [])

  return (
    <div className="relative h-full">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute -bottom-12.5" // Start slightly below the screen
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
          }}
          animate={{
            y: ["0vh", "-120vh"], // Float way past the top of the container
            opacity: [0, 1, 1, 0], // Fade in gently, then fade out at the top
            x: [0, bubble.wobbleOffset, -bubble.wobbleOffset, 0], // Organic side-to-side wobble
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity, // Loop forever
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        >
          {/* Render our perfect Figma SVG inside the animated wrapper */}
          <FigmaBubble />
        </motion.div>
      ))}
    </div>
  )
}
