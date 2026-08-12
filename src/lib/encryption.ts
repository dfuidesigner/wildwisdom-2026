const rawPublicKey = import.meta.env.PUBLIC_RSA_KEY || ""
const PUBLIC_KEY = rawPublicKey.replace(/\\n/g, "\n")

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem.replace(
    /(-----(BEGIN|END)( PUBLIC)? KEY-----|[\n\r])/g,
    ""
  )
  const binaryString = window.atob(b64Lines)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export const encryptPayload = async (plainText: string): Promise<string> => {
  if (!plainText) return ""

  try {
    const keyBuffer = pemToArrayBuffer(PUBLIC_KEY)

    const cryptoKey = await window.crypto.subtle.importKey(
      "spki",
      keyBuffer,
      { name: "RSA-OAEP", hash: "SHA-1" },
      false,
      ["encrypt"]
    )

    const encodedText = new TextEncoder().encode(plainText)
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      cryptoKey,
      encodedText
    )

    const encryptedBytes = new Uint8Array(encryptedBuffer)
    return window.btoa(String.fromCharCode(...encryptedBytes))
  } catch (error) {
    console.error("Encryption failed:", error)
    throw new Error("Failed to encrypt payload")
  }
}
