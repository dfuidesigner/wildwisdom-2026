import { motion } from "framer-motion"
import type { Easing } from "framer-motion"

interface Props {
  src: string
  className?: string
  type?: "fish" | "coral" | "float"
  delay?: number
}

const variants = {
  fish: {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, 0],
      rotate: [0, 2, -2, 0],
    },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as Easing },
  },
  coral: {
    animate: {
      rotate: [-3, 3, -3],
      transformOrigin: "bottom center",
    },
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as Easing },
  },
  float: {
    animate: { y: [0, -10, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as Easing },
  },
}

export default function OceanElement({
  src,
  className,
  type = "float",
  delay = 0,
}: Props) {
  const animation = variants[type]

  return (
    <motion.img
      src={src}
      className={`${className} will-change-transform`}
      animate={animation.animate}
      transition={{ ...animation.transition, delay }}
    />
  )
}
