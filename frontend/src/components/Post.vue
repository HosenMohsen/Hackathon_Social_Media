<template>
    <article class="bg-white rounded-lg shadow p-6 mb-6 w-full">
        <header class="flex items-center mb-4">
            <img
                class="w-12 h-12 rounded-full mr-3 object-cover"
                :src="authorDetails.avatar"
                alt="User avatar"
            />
            <div class="leading-tight">
                <p class="font-semibold text-gray-900">{{ authorDetails.name }}</p>
                <p class="text-xs text-gray-400">{{ timeAgo }}</p>
            </div>
        </header>

        <p v-if="post.content" class="mb-4 text-gray-800 break-words">{{ post.content }}</p>

        <div v-if="images.length" class="mb-4 grid gap-3" :class="imageGridClass">
            <img
                v-for="(img, idx) in images"
                :key="idx"
                :src="img"
                alt="Post" 
                class="rounded-lg w-full h-48 object-cover"
            />
        </div>

        <footer class="flex justify-between text-gray-500 text-sm border-t pt-3">
            <button class="flex items-center hover:text-blue-600" type="button">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M14 9l-3 6h4l-3 6" />
                </svg>
                Like
            </button>
            <button class="flex items-center hover:text-blue-600" type="button">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                </svg>
                Comment
            </button>
            <button class="flex items-center hover:text-blue-600" type="button">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                Share
            </button>
        </footer>

        <section v-if="comments.length" class="mt-4">
            <p class="text-xs text-gray-500 mb-1">Commentaires :</p>
            <Comment
                v-for="(comment, idx) in comments"
                :key="idx"
                :author="comment.author"
                :content="comment.content"
                :createdAt="comment.createdAt"
            />
        </section>
    </article>
</template>

<script setup>
import { computed } from 'vue'
import Comment from './Comment.vue'

const props = defineProps({
    post: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const post = computed(() => props.post || {})

const FALLBACK_AVATAR = 'https://randomuser.me/api/portraits/lego/1.jpg'

const authorDetails = computed(() => {
    const author = props.post.author || props.post.createdBy
    if (author && typeof author === 'object') {
        const name = [author.firstName, author.lastName].filter(Boolean).join(' ').trim()
        return {
            name: name || 'Utilisateur inconnu',
            avatar: author.avatar || FALLBACK_AVATAR
        }
    }
    return {
        name: 'Utilisateur inconnu',
        avatar: FALLBACK_AVATAR
    }
})

const images = computed(() => {
    return Array.isArray(props.post.images) ? props.post.images.filter(Boolean) : []
})

const imageGridClass = computed(() => {
    if (images.value.length === 1) return 'grid-cols-1'
    if (images.value.length === 2) return 'grid-cols-2'
    return 'grid-cols-1 sm:grid-cols-2'
})

const comments = computed(() => {
    return Array.isArray(props.post.comments) ? props.post.comments : []
})

const timeAgo = computed(() => {
    const createdAt = props.post.createdAt || props.post.updatedAt
    if (!createdAt) return '—'
    const now = new Date()
    const postDate = new Date(createdAt)
    const diff = Math.floor((now - postDate) / 1000)
    if (Number.isNaN(diff) || diff < 0) return '—'
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
})
</script>