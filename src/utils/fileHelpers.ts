/**
 * Download a file from a URL
 * @param url - The URL of the file to download
 * @param fileName - The name to save the file as
 */
export async function downloadFile(url: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error('Error downloading file:', error)
    // Fallback: open in new tab
    window.open(url, '_blank')
  }
}

/**
 * Get file name from URL or use default
 * @param url - The file URL
 * @param defaultName - Default name if extraction fails
 */
export function getFileNameFromUrl(url: string, defaultName: string = 'file'): string {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    return fileName || defaultName
  } catch {
    return defaultName
  }
}
