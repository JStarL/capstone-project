import React from 'react'

export async function fileToDataUrl (file) {
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (file) {
      const valid = validFileTypes.find(type => type === file.type);
      if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
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