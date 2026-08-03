import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} // Starts slightly transparent and pushed down
      animate={{ opacity: 1, y: 0 }}  // Glides up into full view
      exit={{ opacity: 0, y: -15 }}   // Glides up and fades out when leaving
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;