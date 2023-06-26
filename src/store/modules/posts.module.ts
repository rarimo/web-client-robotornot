import { proxy } from 'valtio'

import { Post } from '@/types'

export const postsStore = proxy<{
  posts: Post[]
  loadPosts: () => Promise<void>
}>({
  posts: [],
  loadPosts: async () => {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos',
    ).then(res => res.json())

    postsStore.posts = response as unknown as Post[]
  },
})
