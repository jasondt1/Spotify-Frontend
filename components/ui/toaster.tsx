"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast
          key={id}
          {...props}
          className="toast-bottom-exit rounded-md p-2 max-w-max"
        >
          <div className="flex justify-center items-center px-4 py-2 text-center">
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          {/* <ToastClose /> */}
        </Toast>
      ))}

      <ToastViewport className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 w-full max-w-sm outline-none" />
    </ToastProvider>
  )
}
