import React from 'react'
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export async function getStaticPaths() {
  const files = await fs.readdir(path.join(process.cwd(), 'data'))
  const paths = files.map((filename) => ({
    params: { slug: filename.replace('.md', '') }
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'data', `${params.slug}.md`)
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { content, data } = matter(fileContent)
  return {
    props: {
      content: marked(content),
      title: data.title,
      token: data.token,
      slug: params.slug
    }
  }
}

export default function WikiPage({ content, title, token, slug }) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <a
        href={`/wiki/${slug}/edit?token=${token}`}
        className="mt-8 inline-block text-blue-500 hover:underline"
      >
        편집하기
      </a>
    </div>
  )
}

