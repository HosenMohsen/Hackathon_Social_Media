<template>
    <article class="bg-white rounded-lg shadow p-6 mb-6 w-full">
        <header class="flex items-center mb-4">
            <img
                class="w-12 h-12 rounded-full mr-3"
                :src="post.createdBy.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'"
                alt="User avatar"
            />
            <div>
                <div class="font-semibold text-gray-900">{{ post.createdBy.firstName }} {{ post.createdBy.lastName }}</div>
                <div class="text-xs text-gray-400">{{ timeAgo }}</div>
            </div>
        </header>
        <div class="mb-4 text-gray-800">
            {{ post.content }}
        </div>
        <div v-if="post.images && post.images.length" class="mb-4">
            <div
                v-for="(image, index) in post.images"
                :key="index"
                class="mb-4"
            >
                <img :src="image" alt="Post image" class="rounded-lg w-full max-h-60 object-cover" />
            </div>
        </div>
        <div class="flex justify-between text-gray-500 text-sm border-t pt-3 mb-2">
            <AddComment :targetUuid="post.uuid" :targetModel="'post'" @comment-added="handleCommentAdded" />
        </div>
        <div v-if="comments && comments.length" class="mt-4">
            <div class="text-xs text-gray-500 mb-1">Comments:</div>
            <div v-for="comment in comments" :key="comment.uuid" class="group relative">
                <Comment
                    :author="comment.createdBy"
                    :content="comment.message"
                    :createdAt="comment.createdAt"
                />
                <div class="absolute right-2 top-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition ml-14 mt-2">
                    <button v-if="isAuthor(comment)" @click="editComment(comment)" class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">Modifier</button>
                    <button v-if="isAuthor(comment)" @click="deleteCommentPost(comment.uuid)" class="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
                </div>
            </div>
        </div>

        <!-- Modal édition commentaire -->
        <div v-if="editingComment" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div class="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
                <h3 class="text-lg font-semibold text-gray-800">Edit Comment</h3>
                <textarea v-model="editContent" class="mt-3 w-full border border-gray-200 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-200"></textarea>
                <div class="mt-4 flex justify-end gap-3">
                    <button @click="cancelEdit" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button @click="saveEdit" class="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Save</button>
                </div>
            </div>
        </div>
    </article>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddComment from './AddComment.vue'
import Comment from './Comment.vue'
import { fetchComments, updateComment, deleteComment } from '../api/commentApi.js';

const editingComment = ref(null);
const editContent = ref('');
const comments = ref([])

const props = defineProps({
    post: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const loadComments = async () => {
    try {
        comments.value = await fetchComments('post', props.post.uuid)
    } catch {
        comments.value = []
    }
}

function handleCommentAdded(newComment) {
    if (newComment) {
        comments.value.unshift(newComment)
    }
}

function isAuthor(comment) {
    return comment.userIsAuthor;
}
function editComment(comment) {
    editingComment.value = comment;
    editContent.value = comment.message;
}

async function saveEdit() {
    if (!editContent.value.trim() || !editingComment.value) return;
    try {
        const updated = await updateComment(editingComment.value.uuid, editContent.value);
        if (updated) {
            const idx = comments.value.findIndex(c => c.uuid === editingComment.value.uuid);
            if (idx !== -1) comments.value[idx].message = editContent.value;
        }
    } catch (e) {}
    editingComment.value = null;
    editContent.value = '';
}

function cancelEdit() {
    editingComment.value = null;
    editContent.value = '';
}

async function deleteCommentPost(commentUuid) {
    try {
        const deleted = await deleteComment(commentUuid);
        if (deleted) {
            comments.value = comments.value.filter(c => c.uuid !== commentUuid);
        }
    } catch (e) {}
}

const post = computed(() => props.post || {})

const timeAgo = computed(() => {
    const now = new Date()
    const postDate = new Date(props.post.createdAt)
    const diff = Math.floor((now - postDate) / 1000)
    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
})

onMounted(loadComments)
</script>