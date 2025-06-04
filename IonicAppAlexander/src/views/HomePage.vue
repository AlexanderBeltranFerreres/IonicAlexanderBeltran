<template>
  <ion-page>
    <Navbar title="TOTS ELS ARXIUS"/>

    <ion-content>
      <!-- Botó flotant per pujar un fitxer -->
      <ion-button
          expand="full"
          class="upload-button"
          @click="goToUploadPage">
        <img src="@/assets/add.png" alt="Pujar un fitxer" class="upload-icon" />
      </ion-button>

      <!-- Llista d'arxius multimèdia en mode grid -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" size-sm="4" size-md="3" v-for="(item, index) in multimedia" :key="index">
            <ion-card class="media-card">
              <ion-card-header>
                <img :src="getPreviewSrc(item)" alt="Previsualització" />
              </ion-card-header>

              <!-- Imatge de l'usuari en un cercle i el seu nom -->
              <ion-card-footer>
                <ion-item lines="none">
                  <ion-avatar slot="start">
                    <img :src="item.user.profile_photo_url" />
                  </ion-avatar>
                  <ion-label>{{ item.user.name }}</ion-label>
                </ion-item>
                <ion-item>
                  <ion-label>
                    <p>{{ formatDate(item.created_at) }} - Fa {{ getTimeAgo(item.created_at) }}</p>
                  </ion-label>
                </ion-item>
              </ion-card-footer>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <Footer/>
    </ion-content>
  </ion-page>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import api from '../services/api';

// Funció per formatar la data
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // Potser vulguis personalitzar més el format
};

// Funció per mostrar "Fa X hores" o altres unitats de temps
const getTimeAgo = (dateString) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(dateString)) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);

  if (hours < 1) {
    return `${minutes} minut${minutes === 1 ? '' : 's'}`;
  } else if (hours < 24) {
    return `${hours} hora${hours === 1 ? '' : 's'}`;
  } else {
    return `${days} dia${days === 1 ? '' : 's'}`;
  }
};

const router = useRouter();
const multimedia = ref([]);

// Funció per obtenir els arxius multimèdia
const getMultimedia = async () => {
  try {
    const response = await api.get('/multimedia');
    multimedia.value = response.data;
  } catch (error) {
    console.error('Error getting multimedia:', error);
  }
};

// Funció per redirigir a la pàgina de pujada
const goToUploadPage = () => {
  router.push('/upload').then(() => {
    window.location.reload();  // Forçar recàrrega
  });
};

import videoIcon from '@/assets/video.png';
import documentIcon from '@/assets/docs.png';
const getPreviewSrc = (item) => {
  console.log(item);
  if (item.file_type.startsWith('image/')) {
    return `data:image/jpeg;base64,${item.file_path}`;
  } else if (item.file_type.startsWith('video/')) {
    return videoIcon;
  } else {
    return documentIcon;
  }
};


// Carregar la llista d'arxius en muntar la pàgina
onMounted(getMultimedia);
</script>

<style scoped>
ion-content {
  --background: linear-gradient(135deg, #fce3ec, #ffe6fa);
  padding: 16px;
  padding-bottom: 80px;
  font-family: 'Segoe UI', Roboto, sans-serif;
}

/* Botó flotant de pujada de fitxers */
ion-button.upload-button {
  --background: linear-gradient(135deg, #ff6ec4, #7873f5);
  --border-radius: 50%;
  --box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 64px;
  height: 64px;
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.upload-button:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.upload-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}

/* Targetes multimèdia */
ion-card.media-card {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.08);
  background: linear-gradient(135deg, #ffffff, #f9f9ff);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

ion-card.media-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.12);
}

ion-card-header {
  background-color: #f0f4ff;
  padding: 0;
}

ion-card-header img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  object-position: center;
  border-bottom: 3px solid #e0e0f0;
}

ion-card-footer {
  padding: 16px 14px 12px;
  background-color: #fff;
  flex-grow: 1;
  border-top: 1px solid #eee;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}

/* Element d’usuari amb avatar */
ion-item {
  --background: transparent;
  --min-height: 44px;
  --padding-start: 0;
  --inner-padding-end: 0;
  --padding-end: 0;
}

ion-avatar img {
  border: 3px solid #ff6ec4;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

ion-avatar img:hover {
  transform: rotate(3deg) scale(1.05);
}

ion-card-footer ion-label {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

ion-label p {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: #777;
  font-style: italic;
}

/* Grid i marges */
ion-grid {
  padding: 0;
}

ion-col {
  padding: 12px;
}

/* Adaptació mòbil */
@media (max-width: 767px) {
  ion-col {
    padding: 8px;
  }

  ion-card-header img {
    height: 180px;
  }

  ion-card.media-card {
    min-height: 300px;
  }

  ion-button.upload-button {
    width: 56px;
    height: 56px;
  }

  .upload-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
