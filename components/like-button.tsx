import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  likes: number;
  id: string;
  onLike: (id: string) => Promise<void>;
}

export function LikeButton({ likes, id, onLike }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  useEffect(() => {
    if (isLiked) {
      const timer = setTimeout(() => {
        setIsLiked(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLiked]);

  useEffect(() => {
    setLikeCount(likes); // Update local state when props change
  }, [likes]);

  const handleClick = async () => {
    setIsLiked(true);
    await onLike(id);
  };

  return (
    <div className="flex items-center gap-2">
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={handleClick}
    className="p-1 rounded-full hover:bg-gray-100"
  >
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: isLiked ? [1, 1.2, 1] : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <Heart 
        className="w-5 h-5"
        style={{
          fill: isLiked ? "#ef4444" : "transparent",
          stroke: isLiked ? "#ef4444" : "#ef4444",
          transition: "fill 0.3s ease, stroke 0.3s ease"
        }}
      />
    </motion.div>
  </motion.button>
  <motion.span
    key={likeCount}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-sm text-gray-600"
  >
    {likeCount}
  </motion.span>
</div>
  );
}