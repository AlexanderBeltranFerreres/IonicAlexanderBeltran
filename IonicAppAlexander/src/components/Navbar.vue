<template>
  <ion-header>
    <ion-toolbar class="custom-toolbar">
      <ion-buttons slot="start" v-if="token">
        <ion-button class="icon-button" @click="goToHome">
          <img src="@/assets/home.png" alt="home" class="icon" />
        </ion-button>
      </ion-buttons>

      <ion-title class="center-title">{{ title }}</ion-title>

      <ion-buttons slot="end" v-if="token">
        <ion-button class="icon-button" @click="goToUser">
          <img src="@/assets/user.png" alt="user" class="icon" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api'; // Assegura't de tenir el teu fitxer de serveis API

const props = defineProps({
  title: {
    type: String,
    default: 'Nom de l\'App'
  }
});

const router = useRouter();

// Almacenarem el token en una variable reactiva
const token = ref(null);

// Funció per verificar el token en l'emmagatzematge local
const checkToken = async () => {
  token.value = localStorage.getItem('token');
  if (token.value) {
    try {
      // Fem una crida per verificar si el token és vàlid
      const response = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });

      // Si la resposta és exitosa, podem continuar
      console.log('Token vàlid', response.data);
    } catch (error) {
      // Si hi ha un error, eliminem el token de localStorage
      console.log('Token no vàlid', error);
      localStorage.removeItem('token');
      token.value = null;
      // Redirigir a la pàgina de login
      router.push('/login').then(() => {
        window.location.reload();  // Forçar recàrrega
      });
    }
  } else {
    // Si no hi ha token, redirigim a login
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login').then(() => {
        window.location.reload();  // Forçar recàrrega
      });
    }
  }
};

// Funció per redirigir a la pàgina Home
const goToHome = () => {
  router.push('/home').then(() => {
    window.location.reload();  // Forçar recàrrega
  });  // Assegura't de tenir aquesta ruta definida
};

// Funció per redirigir a la pàgina de perfil

// Funció per redirigir a la pàgina de l'usuari
const goToUser = () => {
  router.push('/user').then(() => {
    window.location.reload();  // Forçar recàrrega
  });
};

// Comprovem el token quan el component es carrega
onMounted(checkToken);
</script>

<style scoped>
.custom-toolbar {
  --background: linear-gradient(90deg, #c94b4b, #4b134f); /* degradat roseta */
  --color: white;
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.icon-button {
  background-color: #ffffff;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background-color 0.2s ease;
}

.icon-button:hover {
  background-color: #f7d5e3; /* to rosadet suau al hover */
}

.icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  pointer-events: none; /* Evita problemes de clic */
}

.center-title {
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 20px;
  color: white;
  padding-right: 44px; /* per compensar el botó de la dreta */
}
</style>
