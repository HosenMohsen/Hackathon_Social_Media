<template>
    <Suspense>
        <template #default>
            <div class="space-y-6">
                <Post
                    v-for="post in posts"
                    :key="post.uuid"
                    :post="post"
                />
            </div>
        </template>
        <template #fallback>
            <div>Loading posts...</div>
        </template>
    </Suspense>
</template>

<script setup>
import Post from './Post.vue'

defineProps({
    posts: {
        type: Array,
        required: true,
        default: () => []
    }
})
</script>