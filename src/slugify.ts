import slugify from 'slugify'

export const useSlugify = (text: string) => {
  return slugify(text, {
    replacement: '',
    remove: /[-]/g,
    lower: true,
    strict: true,
    locale: 'en',
    trim: true,
  })
}
