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
            <p>Token is: {{ token }}</p>
            <ion-button expand="full" @click="getMetadata()">Get Metadata</ion-button>

          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, loadingController } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';

const espoUrl = ref('http://espocrm.test');
const userInfo = ref({
  username: '',
  password: ''
});
const user = ref({});
const preferences = ref({});
const token = ref('');

 onMounted( () => {
  setSavedToken()
  setSavedUser()
  setSavedPreferences()
})


async function login () {
  const tokenString = btoa(`${userInfo.value.username}:${userInfo.value.password}`)
  await fetch(`${espoUrl.value}/api/v1/App/user`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include",
    headers: {
      "Accept": " */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7",
      "Connection": "keep-alive",
      "Content-Type": "application/json",
      // "Host": `${espoUrl.value}`,
      "Host": `http://app.espocrm.test`,
      "Authorization": `Basic ${tokenString}`,
      "Espo-Authorization": `${tokenString}`,
      "Espo-Authorization-By-Token": "false",
      "Espo-Authorization-Create-Token-Secret": "true"
    }})
    .then(function(response) {
      return response.json()
    })
    .then((data) => {
      console.log(data)
      Preferences.set({
        key: 'token',
        value: data.token,
      });
      Preferences.set({
        key: 'user',
        value: JSON.stringify(data.user),
      });
      Preferences.set({
        key: 'settings',
        value: JSON.stringify(data.preferences),
      });
      
      setSavedToken()
      setSavedUser()
      setSavedPreferences()
    })
    .catch(console.error);
}
  async function setSavedToken () {
    const savedToken = await Preferences.get({ key: 'token' })
    token.value = savedToken.value
  }
  async function setSavedUser () {
    const savedUser = await Preferences.get({ key: 'user' })
    user.value = JSON.parse(savedUser.value)
  }
  async function setSavedPreferences () {
    const savedPreferences = await Preferences.get({ key: 'preferences' })
    preferences.value = JSON.parse(savedPreferences.value)
  }

  async function getMetadata () {
  const espoToken = btoa(`${userInfo.value.username}:${token.value}`)
  await fetch(`${espoUrl.value}/api/v1/Metadata`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "include",
    headers: {
      "Accept": " */*",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,nl;q=0.7",
      "Connection": "keep-alive",
      "Content-Type": "application/json",
      // "Host": `${espoUrl.value}`,
      "Host": `http://app.espocrm.test`,
      "Authorization": `Basic ${espoToken}`,
      "Espo-Authorization": `${espoToken}`,
      "Espo-Authorization-By-Token": "true",
      "Espo-Authorization-Create-Token-Secret": "false"
    }})
    .then(function(response) {
      return response.json()
    })
    .then((data) => {
      console.log(data)
    })
    .catch(console.error);
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
