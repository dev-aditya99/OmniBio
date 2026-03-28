"use client";
import { motion } from "motion/react"; // ya "framer-motion" jo bhi tu use kar raha hai
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const RedirectPage = () => {
  const params = useParams();
  const [destination, setDestination] = useState("");

  useEffect(() => {
    if (params?.url) {
      const decodedUrl = decodeURIComponent(params.url as string);
      setDestination(decodedUrl);

      window.location.replace(decodedUrl);
    }
  }, [params]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center"
    >
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>

      <span className="text-gray-600 mb-6 max-w-md text-lg">
        Redirecting you to your destination...
        <br />
        <span className="text-sm mt-2 block opacity-70">
          If you're not redirected automatically in 3 seconds, please click the
          button below.
        </span>
      </span>

      <motion.a
        href={destination || "/"}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-medium shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Click Here
      </motion.a>
    </motion.div>
  );
};

export default RedirectPage;
