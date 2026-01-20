"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(0 0% 100%)",
          "--normal-text": "hsl(222.2 84% 4.9%)",
          "--normal-border": "hsl(214.3 31.8% 91.4%)",
          "--success-bg": "hsl(0 0% 100%)",
          "--success-text": "hsl(222.2 84% 4.9%)",
          "--success-border": "hsl(142.1 76.2% 36.3%)",
          "--error-bg": "hsl(0 0% 100%)",
          "--error-text": "hsl(222.2 84% 4.9%)",
          "--error-border": "hsl(0 84.2% 60.2%)",
          "--warning-bg": "hsl(0 0% 100%)",
          "--warning-text": "hsl(222.2 84% 4.9%)",
          "--warning-border": "hsl(38 92% 50%)",
          "--info-bg": "hsl(0 0% 100%)",
          "--info-text": "hsl(222.2 84% 4.9%)",
          "--info-border": "hsl(221.2 83.2% 53.3%)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
