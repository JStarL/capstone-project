/**
 * Converts a file to a data URL (base64 string).
 *
 * @param {File} file - The file to be converted.
 * @returns {Promise<string>} A Promise that resolves to the data URL (base64 string) of the file.
 * @throws {Error} If the provided file is not a png, jpg, or jpeg image.
 */
export async function fileToDataUrl(file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (file) {
    const valid = validFileTypes.find(type => type === file.type);
    if (!valid) {
      throw Error('Provided file is not a png, jpg, or jpeg image.');
    }
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    const dataUrl = await dataUrlPromise;
    return dataUrl;
  }
}

/**
   * Converts total seconds to minutes and seconds.
   * @param {number} totalSeconds - The total number of seconds to convert.
   */
export const convertToMinutesAndHours = (totalSeconds, setMinutes, setSeconds) => {
  const remainingSeconds = totalSeconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = Math.floor(remainingSeconds % 60);
  setMinutes(minutes);
  setSeconds(seconds);
};