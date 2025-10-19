<template>
    <div class="max-w-4xl mx-auto my-12 p-6 bg-gray-50 rounded-2xl shadow-lg">
        <div class="bg-white rounded-xl shadow-inner p-6 md:flex md:items-center md:gap-6">
            <div class="flex-shrink-0">
                <img
                    :src="user && user.avatar ? user.avatar : 'https://randomuser.me/api/portraits/lego/1.jpg'"
                    alt="Avatar"
                    class="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-sm object-cover"
                />
            </div>

            <div class="mt-4 md:mt-0 flex-1">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <h1 class="text-2xl md:text-3xl font-extrabold text-gray-800">
                            {{ user ? (user.firstName + ' ' + user.lastName) : 'Profil' }}
                        </h1>
                        <p class="text-sm text-gray-500 mt-1">{{ user ? user.email : '' }}</p>

                        <div class="mt-3 flex flex-wrap items-center gap-2">
                            <span class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.53 0 4.887.67 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                Profil
                            </span>

                            <span v-if="user && user.gender" class="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                                {{ user.gender }}
                            </span>

                            <span v-if="user && user.birthDate" class="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 text-sm font-medium">
                                {{ formatDate(user.birthDate) }}
                            </span>

                            <span v-if="isOwnProfile" class="inline-flex items-center px-3 py-1 rounded-full bg-indigo-600 text-white text-sm font-medium">
                                You
                            </span>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <div class="hidden sm:block text-right">
                            <div class="text-xs text-gray-500">Comments</div>
                            <div class="text-lg font-semibold text-gray-800">{{ comments ? comments.length : 0 }}</div>
                        </div>

                        <div>
                            <button
                                v-if="isOwnProfile"
                                @click="startEditProfile"
                                class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"></path></svg>
                                Edit Profile
                            </button>
                            <div v-else class="text-sm text-gray-500">Visitor</div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-700">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 mt-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-6-4.5-6-10.5a6 6 0 1112 0C18 16.5 12 21 12 21z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"></path>
                        </svg>
                        <div class="text-left">
                            <div class="text-xs text-gray-500">Address</div>
                            <div class="font-medium">{{ user && user.address ? user.address : 'Not provided' }}</div>
                        </div>
                    </div>

                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 mt-1 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8a9 9 0 110-18 9 9 0 010 18z"></path></svg>
                        <div class="text-left">
                            <div class="text-xs text-gray-500">About</div>
                            <div class="font-medium">{{ user && user.description ? user.description : 'No description' }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Comments section -->
        <div class="mt-8">
            <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-800">Comments</h2>
                <span class="text-sm text-gray-500">{{ comments ? comments.length : 0 }} total</span>
            </div>


            <AddComment
                v-if="user"
                :targetUuid="user.uuid"
                :targetModel="'profile'"
                @comment-added="handleCommentAdded"
            />

            <div class="mt-6 space-y-4">
                <div v-if="comments && comments.length">
                    <div v-for="comment in comments" :key="comment.uuid" class="group relative">
                        <Comment
                            :author="comment.createdBy"
                            :content="comment.message"
                            :createdAt="comment.createdAt"
                        />
                        <div class="absolute right-2 top-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition ml-14 mt-2">
                            <button v-if="isAuthor(comment)" @click="editComment(comment)" class="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200">Modifier</button>
                            <button v-if="isAuthor(comment)" @click="deleteCommentProfile(comment.uuid)" class="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Supprimer</button>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-gray-400 py-8">
                    No comments yet. Be the first to comment!
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

        <!-- Modal édition profil -->
        <div v-if="editingProfile" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div class="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">Edit Profile</h3>
                    <button @click="cancelProfileEdit" class="text-gray-500 hover:text-gray-700">Close</button>
                </div>

                <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input v-model="profileDraft.firstName" placeholder="First Name" class="border border-gray-200 rounded-md px-3 py-2 focus:outline-none" />
                    <input v-model="profileDraft.lastName" placeholder="Last Name" class="border border-gray-200 rounded-md px-3 py-2 focus:outline-none" />
                    <input v-model="profileDraft.email" placeholder="Email" class="border border-gray-200 rounded-md px-3 py-2 focus:outline-none col-span-1 md:col-span-2" />
                    <input v-model="profileDraft.address" placeholder="Address" class="border border-gray-200 rounded-md px-3 py-2 focus:outline-none col-span-1 md:col-span-2" />
                    <input v-model="profileDraft.avatar" placeholder="Avatar URL" class="border border-gray-200 rounded-md px-3 py-2 focus:outline-none col-span-1 md:col-span-2" />
                    <textarea v-model="profileDraft.description" placeholder="Description" class="border border-gray-200 rounded-md px-3 py-2 focus:outline-none col-span-1 md:col-span-2"></textarea>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <button @click="cancelProfileEdit" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button @click="saveProfile" class="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import Comment from '../components/Comment.vue';
import AddComment from '../components/AddComment.vue';
import { fetchComments, updateComment, deleteComment } from '../api/commentApi.js';
import { getUserByUuid, getCurrentUser, updateUser } from '../api/userApi.js';

const route = useRoute();
const router = useRouter();

const user = ref(null);
const isOwnProfile = ref(false);
const comments = ref([]);
const loadingComments = ref(false);
const editingComment = ref(null);
const editContent = ref('');
const editingProfile = ref(false);
const profileDraft = ref(null);

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function fetchUserProfile(uuid) {
    try {
        if (!uuid && !isOwnProfile.value) {
            user.value = null;
            return;
        }
        if (isOwnProfile.value) {
            user.value = await getCurrentUser();
        } else {
            user.value = await getUserByUuid(uuid);
        }
        if (isOwnProfile.value && user.value) {
            profileDraft.value = { ...user.value };
        }
    } catch (e) {
        user.value = null;
    }
}

async function fetchCommentsProfile() {
    loadingComments.value = true;
    try {
        if (!user.value) return;
        const res = await fetchComments('profile', user.value.uuid);
        comments.value = Array.isArray(res) ? res : [];
    } catch (e) {
        comments.value = [];
    }
    loadingComments.value = false;
}

function handleCommentAdded(newComment) {
    if (newComment) {
        comments.value.unshift(newComment);
    }
}

function isAuthor(comment) {
    return comment.userIsAuthor;
}

function startEditProfile() {
    editingProfile.value = true;
    profileDraft.value = { ...user.value };
}

function cancelProfileEdit() {
    editingProfile.value = false;
    profileDraft.value = user.value ? { ...user.value } : null;
}

async function saveProfile() {
    if (!profileDraft.value || !user.value) return;
    try {
        const updated = await updateUser(user.value.uuid, profileDraft.value);
        if (updated) {
            user.value = { ...profileDraft.value };
            editingProfile.value = false;
        }
    } catch (e) {
        console.error(e);
    }
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

async function deleteCommentProfile(commentUuid) {
    try {
        const deleted = await deleteComment(commentUuid);
        if (deleted) {
            comments.value = comments.value.filter(c => c.uuid !== commentUuid);
        }
    } catch (e) {}
}

async function initProfile() {
    isOwnProfile.value = false;
    let uuid = route && route.params ? route.params.uuid : null;
    if (!uuid) {
        try {
            const me = await getCurrentUser();
            if (me && me.uuid) {
                uuid = me.uuid;
                isOwnProfile.value = true;
            }
        } catch (e) {
            uuid = null;
        }
    }
    await fetchUserProfile(uuid);
    await fetchCommentsProfile();
}

onMounted(async () => {
    await initProfile();
});

onBeforeRouteUpdate(async (to, from, next) => {
    await nextTick();
    try {
        await initProfile();
    } catch (e) {}
    next();
});

watch(
    () => route.fullPath,
    (to, from) => {
        if (to === from) return;
        initProfile().catch(() => {});
    }
);
</script>
