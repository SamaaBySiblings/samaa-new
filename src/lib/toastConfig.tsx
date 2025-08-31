import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";

interface ToastProviderProps {
  children: ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#4d272e", // Burgundy background
            color: "#ffffff", // White text
            fontFamily: "D-DIN, sans-serif",
            fontSize: "14px",
            borderRadius: 0, // 🔴 Sharp edges
          },
          success: {
            iconTheme: {
              primary: "#ffffff", // Icon background
              secondary: "#800020", // Icon color
            },
            style: {
              borderRadius: 0, // 🔴 Sharp edges
            },
          },
          error: {
            style: {
              background: "#800020",
              color: "#ffffff",
              borderRadius: 0, // 🔴 Sharp edges
            },
          },
        }}
      />
      {children}
    </>
  );
}
