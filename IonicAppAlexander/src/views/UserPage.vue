<template>
  <ion-page>
    <Navbar title="ELS MEUS FITXERS" />

    <ion-content>
      <!-- Botó per tancar sessió -->
      <div class="logout-container">
        <ion-button class="logout-button" @click="logout">
          Tancar Sessió
        </ion-button>
      </div>

      <!-- Llista de fitxers -->
      <ion-list class="file-list">
        <ion-item v-for="(item, index) in userFiles" :key="index" class="file-item">
          <ion-card-header>
            <img :src="getPreviewSrc(item)" alt="Previsualització" />
          </ion-card-header>
          <ion-label class="file-label">
            <p class="file-date">Creat: {{ formatDate(item.created_at) }}</p>
            <p class="file-date">Modificat: {{ formatDate(item.updated_at) }}</p>
          </ion-label>
          <ion-button class="delete-button" @click="deleteFile(item.id)">
            Eliminar
          </ion-button>
        </ion-item>
      </ion-list>

      <Footer />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

const router = useRouter();
const userFiles = ref([]);

const getUserFiles = async () => {
  try {
    const response = await api.get(`/multimedia/user`);
    userFiles.value = response.data;
  } catch (error) {
    console.error('Error obtenint fitxers:', error);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const logout = () => {
  localStorage.removeItem('token');
  router.push('/login').then(() => window.location.reload());
};

const deleteFile = async (fileId) => {
  try {
    await api.delete(`/multimedia/${fileId}`);
    userFiles.value = userFiles.value.filter(file => file.id !== fileId);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

import videoIcon from '@/assets/video.png';
import documentIcon from '@/assets/docs.png';

const getPreviewSrc = (item) => {
  if (item.file_type.startsWith('image/')) {
    return `data:image/jpeg;base64,${item.file_path}`;
  } else if (item.file_type.startsWith('video/')) {
    return videoIcon;
  } else {
    return documentIcon;
  }
};

onMounted(getUserFiles);
</script>

<style scoped>
ion-content {
  --background: linear-gradient(135deg, #fce3ec, #ffe6fa);
  padding: 16px;
  padding-bottom: 80px;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

/* Botó de tancar sessió posicionat a la part superior dreta */
.logout-container {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px 0;
}

ion-button.logout-button {
  --background: linear-gradient(135deg, #ff6ec4, #7873f5);
  --color: white;
  --border-radius: 12px;
  --box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  font-size: 15px;
  font-weight: 600;
  padding: 10px 20px;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

ion-button.logout-button:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Llista de fitxers */
.file-list {
  margin-top: 12px;
  padding: 0 8px;
}

.file-item {
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  border-radius: 18px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
  padding: 12px;
  margin-bottom: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  /* Layout horitzontal amb imatge petita */
  display: flex;
  align-items: center;
  gap: 16px;
}

.file-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
}

ion-card-header {
  background-color: #f0f4ff;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;

  width: 100px;
  height: 100px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

ion-card-header img {
  width: auto;
  max-width: 100%;
  height: 80px;
  object-fit: contain;
  object-position: center;
  border-bottom: none;
}

ion-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
}

.file-date {
  font-size: 13px;
  color: #666;
  font-style: italic;
  margin: 2px 0;
}

.delete-button {
  --background: linear-gradient(135deg, #ff6b6b, #f94d6a);
  --color: white;
  font-weight: 600;
  border-radius: 10px;
  padding: 8px 16px;
  margin-left: auto;
  transition: background 0.3s ease, transform 0.2s ease;
}

.delete-button:hover {
  background: linear-gradient(135deg, #e53935, #d81b60);
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 767px) {
  .file-item {
    flex-direction: column;
    align-items: stretch;
  }

  ion-card-header {
    width: 100%;
    height: auto;
  }

  ion-card-header img {
    height: 180px;
    width: 100%;
  }

  ion-label {
    width: 100%;
    margin-top: 8px;
  }

  .delete-button {
    width: 100%;
    margin: 12px 0 0 0;
    align-self: stretch;
    text-align: center;
  }

  .delete-button:hover {
    background: linear-gradient(135deg, #e53935, #d81b60);
    transform: scale(1.05);
  }
}

</style>

