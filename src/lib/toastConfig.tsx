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
            background: "#800020", // Burgundy background
            color: "#ffffff", // White text
            fontFamily: "D-DIN, sans-serif",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#ffffff", // Icon background
              secondary: "#800020", // Icon color
            },
          },
          error: {
            style: {
              background: "#800020",
              color: "#ffffff",
            },
          },
        }}
      />
      {children}
    </>
  );
}
