import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark';
import html from 'remark-html'


const postsDirectory = path.join(process.cwd(), "posts")

export default function getSortedPostsData() {

  const filenames = fs.readdirSync(postsDirectory)

  const allPostsData = filenames.map(filename => {
    const postDirectory = path.join(postsDirectory, filename)
    const id = filename.replace(/\.md$/, '')
    const fileContent = fs.readFileSync(postDirectory, 'utf-8')

    const matterResult = matter(fileContent)

    return {
      id,
      ...matterResult.data
    }
  })

  return allPostsData.sort((a, b) => {
    if (a.data >= b.date) {
      return -1
    } else {
      return 1
    }
  })

}

export function getAllPostIds() {
  const filenames = fs.readdirSync(postsDirectory)
  return filenames.map(filename => {
    return {
      params: {
        id: filename.replace(/\.md$/, '')
      }
    }
  })
}
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)
  const processContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processContent.toString()

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}