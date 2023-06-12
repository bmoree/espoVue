<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Blank</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>SignIn</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-label position="floating">Espo URL</ion-label>
              <ion-input v-model="espoUrl"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">User Name</ion-label>
              <ion-input v-model="userInfo.username"></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Password</ion-label>
              <ion-input type="password" v-model="userInfo.password"></ion-input>
            </ion-item>
            <ion-button expand="full" @click="login()">Login</ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, loadingController } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';

const espoUrl = ref('https://espo.amadeu.ml');
const userInfo = ref({
  username: '',
  password: ''
});

async function login() {
  const tokenString = btoa(`${userInfo.value.username}:${userInfo.value.password}`)
  await fetch(`${espoUrl.value}/api/v1/App/user`, {
    // method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include',
    headers: {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate, br",

      "Connection": "keep-alive",
      "Content-Type": "application/json",
      "Host": `${espoUrl.value}`,
      "Authorization": `Basic ${tokenString}`,
      "Espo-Authorization": `${tokenString}`,
      "Espo-Authorization-By-Token": "false",
      "Espo-Authorization-Create-Token-Secret": "true"
    }}).then(function(response) {
        return response.json();
    }).then(function(){
        return
    });
}
</script>

<style scoped>
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
