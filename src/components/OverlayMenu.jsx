import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

export default function OverlayMenu({ isOpen, onClose }) {
  const [origin, setOrigin] = useState(
    typeof window !== "undefined" && window.innerWidth < 1024
      ? "95% 8%"
      : "50% 8%",
  );

  useEffect(() => {
    const handleResize = () => {
      setOrigin(window.innerWidth < 1024 ? "95% 8%" : "50% 8%");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(160% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: "rgba(0,0,0,0.95)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white text-3xl cursor-pointer"
            aria-label="Close Menu"
          >
            <FiX />
          </button>

          <motion.ul
            className="space-y-6 text-center"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.3 },
              },
            }}
          >
            {["Home", "About", "Skills", "Projects", "Contact"].map((item) => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={onClose}
                  className="text-4xl text-white font-semibold hover:text-pink-400 transition-colors duration-300"
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
