<template>
    <div class="space-y-6">
        <Post
            v-for="post in posts"
            :key="post.uuid"
            :author="post.createdBy"
            :content="post.content"
            :timestamp="post.createdAt"
            :comments="post.comments"
            :images="post.images"
        />
    </div>
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