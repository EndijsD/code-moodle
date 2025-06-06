export const getBase64 = (file, full = false) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('File is missing or invalid'))
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onloadend = () => {
      if (!reader.result) {
        reject(new Error('Failed to read file'))
      }

      let base64

      if (full) base64 = String(reader.result)
      else base64 = String(reader.result).split(',')[1]

      resolve(base64)
    }

    reader.onerror = (error) => {
      reject(error)
    }
  })
}

// const base64ToBlob = (base64, mimeType = '') => {
//   const byteCharacters = window.atob(base64)

//   const byteNumbers = new Array(byteCharacters.length)

//   for (let i = 0; i < byteCharacters.length; i++) {
//     byteNumbers[i] = byteCharacters.charCodeAt(i)
//   }

//   const byteArray = new Uint8Array(byteNumbers)

//   return new Blob([byteArray], { type: mimeType })
// }

// export const base64ToFile = (base64, filename, mimeType) => {
//   const blob = base64ToBlob(base64, mimeType)
//   return new File([blob], filename, { type: mimeType })
// }

export const isValidNumber = ({ value, type = 'int' }) => {
  // Allow empty string or "0" as valid input
  if (value === '' || value === '0') {
    return true
  }

  // Reject if input contains any whitespace
  if (/\s/.test(value)) return false

  // Check if input is a valid number
  const number = Number(value)
  if (isNaN(number)) return false

  // Check for specific number types (int, any)
  if (type === 'int') {
    // Reject if input contains a dot (decimal point) for "int"
    if (/\./.test(value)) return false
    if (!Number.isInteger(number)) return false
  }

  return true
}
