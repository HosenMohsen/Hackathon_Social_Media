<template>
    <div class="bg-white rounded-lg shadow p-6 mb-6 w-full">
        <div class="flex items-center mb-4">
            <img
                class="w-12 h-12 rounded-full mr-3"
                :src="author.avatar"
                alt="User avatar"
            />
            <div>
                <div class="font-semibold text-gray-900">{{ author.firstName }} {{ author.lastName }}</div>
                <div class="text-xs text-gray-400">{{ timeAgo }}</div>
            </div>
        </div>
        <div class="mb-4 text-gray-800">
            {{ content }}
        </div>
        <div v-if="images && images.length" class="mb-4">
            <div
                v-for="(image, index) in images"
                :key="index"
                class="mb-4"
            >
                <img :src="image.url" alt="Post image" class="rounded-lg w-full" />
            </div>
        </div>
        <div class="flex justify-between text-gray-500 text-sm border-t pt-3 mb-2">
            <AddComment :userUuid="createdBy.uuid" :targetModel="'post'" @comment-added="handleCommentAdded" />
        </div>
        <div v-if="comments && comments.length" class="mt-4">
            <div class="text-xs text-gray-500 mb-1">Comments:</div>
            <Comment
                v-for="(comment, idx) in comments"
                :key="idx"
                :author="comment.createdBy"
                :content="comment.content"
                :createdAt="comment.createdAt"
            />
        </div>
    </div>
</template>

<script setup>

import AddComment from './AddComment.vue'
import Comment from './Comment.vue'
import { computed } from 'vue'

const props = defineProps({
    author: {
        type: Object,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        default: () => []
    },
    images: {
        type: Array,
        default: () => []
    }
})

function handleCommentAdded(newComment) {
    if (newComment) {
        props.comments.unshift(newComment);
    }
}

const timeAgo = computed(() => {
    const now = new Date()
    const postDate = new Date(props.timestamp)
    const diff = Math.floor((now - postDate) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
})
</script>