<template>
  <ion-page>
    <Navbar title="LOGIN"/>
    <ion-content :fullscreen="true">
      <ion-card v-if="!isLoggedIn" class="auth-card">
        <ion-card-header>
          <ion-card-title>{{ isRegister ? 'Crear un compte' : 'Inicia sessió al teu compte' }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating">Nom</ion-label>
            <ion-input v-model="form.name" v-if="isRegister" placeholder="Introdueix el teu nom complet" />
          </ion-item>
          <ion-item>
            <ion-label position="floating">Correu electrònic</ion-label>
            <ion-input v-model="form.email" type="email" placeholder="Introdueix el teu correu electrònic" />
          </ion-item>
          <ion-item>
            <ion-label position="floating">Contrasenya</ion-label>
            <ion-input v-model="form.password" type="password" placeholder="Tria una contrasenya segura" />
          </ion-item>
          <!-- Campo per Confirmar Contrasenya -->
          <ion-item v-if="isRegister">
            <ion-label position="floating">Confirmar contrasenya</ion-label>
            <ion-input v-model="form.confirmPassword" type="password" placeholder="Confirma la teva contrasenya" />
          </ion-item>
          <ion-button expand="block" @click="submit" class="action-btn">
            {{ isRegister ? 'Registrar-se' : 'Iniciar sessió' }}
          </ion-button>
          <ion-button expand="block" fill="clear" @click="isRegister = !isRegister" class="switch-btn">
            {{ isRegister ? 'Vés a Iniciar Sessió' : 'Vés a Registrar-se' }}
          </ion-button>
        </ion-card-content>
      </ion-card>
      <Footer/>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: 'LoginPage',
  components: {
    Footer,
    Navbar,
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  },
  setup() {
    const router = useRouter();
    const isRegister = ref(false);
    const isLoggedIn = ref(!!localStorage.getItem('token'));
    const form = ref({ name: '', email: '', password: '', confirmPassword: '' });

    // Redirigir a la pàgina de /user si l'usuari ja està autenticat
    onMounted(() => {
      if (isLoggedIn.value) {
        router.push('/user');
      }
    });

    const submit = async () => {
      try {
        // Validació del frontend
        if (isRegister.value) {
          if (!form.value.name.trim()) {
            alert('Si us plau, introdueix un nom.');
            return;
          }
          if (!form.value.confirmPassword || form.value.password !== form.value.confirmPassword) {
            alert('Les contrasenyes no coincideixen.');
            return;
          }
        }
        if (!form.value.email.trim() || !form.value.password.trim()) {
          alert('Si us plau, introdueix tant el correu electrònic com la contrasenya.');
          return;
        }

        const endpoint = isRegister.value ? '/register' : '/login';
        const payload = {
          email: form.value.email,
          password: form.value.password,
          device_name: 'web',
          ...(isRegister.value && { name: form.value.name })
        };

        // Debug payload
        console.log('Enviant dades:', payload);

        const response = await api.post(endpoint, payload);
        localStorage.setItem('token', response.data.token);
        isLoggedIn.value = true;
        router.push('/home');
      } catch (error) {
        console.error('Error d\'autenticació:', error.response?.data || error.message);
        alert('Error d\'autenticació: ' + (error.response?.data?.message || 'Error desconegut'));
      }
    };

    const logout = () => {
      localStorage.removeItem('token');
      isLoggedIn.value = false;
      router.push('/login');
    };

    return { isRegister, isLoggedIn, form, submit, logout };
  }
});
</script>

<style scoped>
ion-content {
  --background: linear-gradient(135deg, #f9fafb, #e1e8f5);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  margin: 24px auto;
  padding: 24px 20px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(142, 68, 173, 0.15);
  transition: box-shadow 0.3s ease;
}

.auth-card:hover {
  box-shadow: 0 14px 40px rgba(142, 68, 173, 0.25);
}

ion-card-header {
  text-align: center;
  margin-bottom: 24px;
}

ion-card-title {
  font-size: 24px;
  font-weight: 700;
  color: #8e44ad; /* violeta */
  letter-spacing: 0.03em;
}

ion-item {
  margin-bottom: 18px;
  --background: transparent;
  --border-color: #ccc;
  border-radius: 12px;
  box-shadow: inset 0 1px 4px rgba(0,0,0,0.05);
  transition: border-color 0.3s ease;
}

ion-item:focus-within {
  --border-color: #8e44ad;
  box-shadow: 0 0 8px rgba(142, 68, 173, 0.4);
}

ion-label {
  color: #555;
  font-weight: 600;
}

ion-input {
  border-radius: 12px;
  background-color: #f4f7f6;
  padding: 12px 16px;
  font-size: 16px;
  color: #222;
}

ion-input::part(input) {
  padding: 12px 16px;
  font-weight: 500;
}

ion-button.action-btn {
  margin-top: 20px;
  border-radius: 14px;
  background: linear-gradient(135deg, #8e44ad, #6f2dbd);
  color: white;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 6px 14px rgba(142, 68, 173, 0.5);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

ion-button.action-btn:hover {
  background: linear-gradient(135deg, #732d91, #4a1c5b);
  box-shadow: 0 8px 20px rgba(114, 45, 145, 0.7);
}

ion-button.switch-btn {
  margin-top: 12px;
  font-weight: 600;
  color: #8e44ad !important;
  text-align: center;
  --background: transparent;
  --box-shadow: none;
  transition: color 0.3s ease;
}

ion-button.switch-btn:hover {
  color: #6f2dbd !important;
  text-decoration: underline;
}

footer {
  margin-top: 40px;
  text-align: center;
  color: #888;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    margin: 16px 12px;
    padding: 20px 16px;
  }

  ion-card-title {
    font-size: 20px;
  }

  ion-input, ion-button.action-btn {
    font-size: 14px;
  }
}
</style>
