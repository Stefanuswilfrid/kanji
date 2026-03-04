'use client';
import { Google } from '@/components/icons/google';
import { AnimatePresence , motion } from 'framer-motion'
import React from 'react'
import { useAuth } from '../auth/auth-provider';
import { useUser } from '../auth/use-user';

export default function AuthButton() {
  const { signInWithGoogle, isAuthenticated, signOut } = useAuth();
  const { user } = useUser();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
        {isAuthenticated ? (
        <motion.button
        onClick={signOut}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="py-2 px-4 bg-softblack border-secondary/10 text-secondary border rounded-md duration-200 active:bg-hovered flex items-center gap-2"
        >
          {user?.email}
        </motion.button>
      ) : (
        <motion.button
          onClick={signInWithGoogle}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="py-2 px-4 bg-softblack border-secondary/10 text-secondary border rounded-md duration-200 active:bg-hovered flex items-center gap-2"
        >
          <Google /> Sign in
        </motion.button>
      )}

        </AnimatePresence>
  )
}
