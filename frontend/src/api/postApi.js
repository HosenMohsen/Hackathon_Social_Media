const API_POST_URL = `${import.meta.env.VITE_API_URL}/posts`;

export async function fetchPosts() {
    try {
        const response = await fetch(API_POST_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

export async function addPost() {
    try {
        const response = await fetch(API_POST_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content.value,
                createdAt: createdAt.value,
                uuid: uuid.value,
                createdBy: createdBy.value,
                images: images.value,
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newPost = await response.json();
        return newPost;
    } catch (error) {
        console.error('Error adding post:', error);
    }
}