import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ErrorDialogProps {
  isOpen: boolean
  onClose: () => void
  errorMessage: string
}

export function ErrorDialog({ isOpen, onClose, errorMessage }: ErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-2 border-[#410f0f] text-red-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-500 flex items-center justify-between">
            <span>Error</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-gray-300">
          <p>{errorMessage}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

