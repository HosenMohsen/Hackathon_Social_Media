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
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div
                    v-for="(image, index) in post.images"
                    :key="index"
                    class=""
                >
                    <img :src="image" alt="Post image" class="rounded-lg w-full h-40 object-cover" />
                </div>
            </div>
        </div>
        <div class="flex justify-between items-center text-gray-500 text-sm border-t pt-3 mb-2">
            <AddComment :targetUuid="post.uuid" :targetModel="'post'" @comment-added="handleCommentAdded" />
            <div v-if="isPostAuthor" class="flex gap-2">
                <button @click="editPost" class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">Modifier le post</button>
                <button @click="deletePost" class="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer le post</button>
            </div>
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

        <!-- Modal édition post -->
        <div v-if="editingPost" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div class="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
                <h3 class="text-lg font-semibold text-gray-800">Modifier le post</h3>
                <textarea v-model="editPostContent" class="mt-3 w-full border border-gray-200 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-200"></textarea>
                <div class="mt-4">
                    <div class="mb-2 font-semibold">Images</div>
                    <div class="flex flex-wrap gap-3 mb-3">
                        <div v-for="(img, idx) in editPostImages" :key="idx" class="relative">
                            <img :src="img" alt="Image" class="w-24 h-24 object-cover rounded-lg border" />
                            <button @click="editPostImages.splice(idx, 1)" class="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">&times;</button>
                        </div>
                    </div>
                    <input type="text" v-model="newImageUrl" placeholder="Ajouter une URL d'image" class="border border-gray-200 rounded-md px-2 py-1 w-64" />
                    <button @click="addImageToEdit" class="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Ajouter</button>
                </div>
                <div class="mt-4 flex justify-end gap-3">
                    <button @click="cancelEditPost" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Annuler</button>
                    <button @click="saveEditPost" class="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Enregistrer</button>
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
import { updatePost, deletePost as apiDeletePost } from '../api/postApi.js';
const emit = defineEmits(['post-deleted']);

const editingComment = ref(null);
const editContent = ref('');
const comments = ref([])

const editingPost = ref(false);
const editPostContent = ref('');
const editPostImages = ref([]);
const newImageUrl = ref('');

const props = defineProps({
    post: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const post = computed(() => props.post || {})

// Détection de l'auteur du post
const isPostAuthor = computed(() => {
    // On suppose que le backend ajoute userIsAuthor sur le post
    return post.value.userIsAuthor === true;
});

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

function editPost() {
    editingPost.value = true;
    editPostContent.value = post.value.content;
    editPostImages.value = Array.isArray(post.value.images) ? [...post.value.images] : [];
    newImageUrl.value = '';
}

function cancelEditPost() {
    editingPost.value = false;
    editPostContent.value = '';
    editPostImages.value = [];
    newImageUrl.value = '';
}

function addImageToEdit() {
    const url = newImageUrl.value.trim();
    if (url && editPostImages.value.length < 4) {
        editPostImages.value.push(url);
        newImageUrl.value = '';
    }
}

async function saveEditPost() {
    if (!editPostContent.value.trim() || !post.value) return;
    try {
        const updated = await updatePost(post.value.uuid, {
            content: editPostContent.value,
            images: editPostImages.value
        });
        if (updated) {
            post.value.content = editPostContent.value;
            post.value.images = [...editPostImages.value];
            editingPost.value = false;
        }
    } catch (e) {}
}

async function deletePost() {
    if (!post.value) return;
    if (!confirm('Voulez-vous vraiment supprimer ce post ?')) return;
    try {
        const deleted = await apiDeletePost(post.value.uuid);
        if (deleted) {
            emit('post-deleted', post.value.uuid);
        }
    } catch (e) {}
}

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