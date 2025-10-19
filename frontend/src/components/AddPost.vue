<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl shadow-sm p-8 mb-8 mx-auto border border-gray-100">
    <h3 class="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
      Ajouter un post
    </h3>
    <div class="mb-5">
      <textarea v-model="content" id="content" required rows="3" class="w-full border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 transition duration-150 outline-none shadow-sm resize-none" placeholder="Exprimez-vous..." ></textarea>
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 font-medium mb-2">URLs des images <span class="text-xs text-gray-400">(max 4, optionnel)</span></label>
      <div v-for="(url, idx) in imageUrls" :key="idx" class="flex gap-2 mb-2 items-center">
        <input
          v-model="imageUrls[idx]"
          :id="`imageUrl${idx}`"
          type="url"
          placeholder="https://exemple.com/image.jpg"
          class="w-full border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg px-4 py-2 transition duration-150 outline-none shadow-sm"
        />
        <button
          v-if="imageUrls.length > 1"
          type="button"
          class="text-red-500 hover:bg-red-100 rounded-full p-1 transition"
          @click="removeImageUrl(idx)"
          aria-label="Supprimer cette image"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <button
        v-if="imageUrls.length < 4"
        type="button"
        class="mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100 transition font-medium shadow-sm"
        @click="addImageUrl"
      >
        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
        Ajouter une image
      </button>
    </div>
    <button type="submit" class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition">Publier</button>
    <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { addPost } from '@/api/postApi.js';

const emit = defineEmits(['post-added']);
const content = ref('');
const imageUrls = ref(['']);
const addImageUrl = () => {
  if (imageUrls.value.length < 5) {
    imageUrls.value.push('');
  }
};

const removeImageUrl = (idx) => {
  if (imageUrls.value.length > 1) {
    imageUrls.value.splice(idx, 1);
  }
};
const error = ref('');

const handleSubmit = async () => {
  error.value = '';
  try {
    const filteredImages = imageUrls.value.map(url => url.trim()).filter(url => url);
    const payload = {
      content: content.value,
      images: filteredImages.length > 0 ? filteredImages : undefined
    };
    const newPost = await addPost(payload);
    if (newPost) {
      emit('post-added', newPost);
      content.value = '';
      imageUrls.value = [''];
    } else {
      error.value = "Erreur lors de l'ajout du post.";
    }
  } catch (e) {
    error.value = "Erreur lors de l'ajout du post.";
  }
};
</script>
