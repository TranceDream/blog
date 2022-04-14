import fs from 'fs'
import path from 'path'

const dataPath = path.join(process.cwd(), 'gallery/gallery.json')

export function getGalleryData() {
    let photos = JSON.parse(fs.readFileSync(dataPath))
    photos.sort((a, b) => new Date(b.date) - new Date(a.date))
    return photos
}

export function getLatestPhoto() {
    let photos = getGalleryData()
    return photos[0]
}
