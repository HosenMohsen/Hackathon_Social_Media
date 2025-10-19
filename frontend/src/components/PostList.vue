<template>
    <Suspense>
        <template #default>
            <div class="space-y-6">
                <Post
                    v-for="post in postList"
                    :key="post.uuid"
                    :post="post"
                    @post-deleted="removePost"
                />
            </div>
        </template>
        <template #fallback>
            <div>Loading posts...</div>
        </template>
    </Suspense>
</template>

<script setup>
import { ref, watch } from 'vue'
import Post from './Post.vue'

const props = defineProps({
    posts: {
        type: Array,
        required: true,
        default: () => []
    }
})

const postList = ref([...props.posts])

watch(
  () => props.posts,
  (newPosts) => {
    postList.value = [...newPosts]
  }
)

function removePost(uuid) {
    postList.value = postList.value.filter(post => post.uuid !== uuid)
}
</script>