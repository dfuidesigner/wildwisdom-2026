import { motion } from "framer-motion"

export default function AnimatedBossOctopus() {
  return (
    <motion.div
      className="relative w-25 max-w-md drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] sm:w-35 md:w-50 xl:w-90"
      animate={{
        y: [0, -20, 0],
        rotate: [-2, 2, -2],
        scaleX: [1, 1.03, 0.97, 1],
        scaleY: [1, 0.97, 1.03, 1],
        skewX: [0, -1.5, 1.5, 0],
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.33, 0.66, 1],
      }}
      style={{ originX: "50%", originY: "50%" }}
    >
      <img
        src={`${import.meta.env.BASE_URL}images/svgs/octopus.svg`}
        alt="Animated Boss Octopus"
        className="h-auto w-full"
      />
    </motion.div>
  )
}
