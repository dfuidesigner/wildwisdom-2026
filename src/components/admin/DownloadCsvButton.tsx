import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axios"

interface Props {
  endpoint: string
  filename: string
  label?: string
}

export function DownloadCsvButton({
  endpoint,
  filename,
  label = "Download Excel",
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await api.get(endpoint, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success("Download started", {
        description: filename,
      })
    } catch {
      toast.error("Download failed", {
        description: "Please try again.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex h-12 items-center justify-center gap-2 rounded-xl bg-(--wwf-ocean-deep) px-6 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:opacity-60"
    >
      {isDownloading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
      {isDownloading ? "Preparing..." : label}
    </button>
  )
}
