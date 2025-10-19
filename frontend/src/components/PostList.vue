<template>
    <div class="space-y-6">
        <Post
            v-for="post in posts"
            :key="post.uuid || post._id"
            :post="post"
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