<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Accounts list</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Espo Capacitor Vue client (fullscreen)</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container" v-if="account">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Account {{ account.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            {{ account }}

            <div v-if="layout">
              <h3>Layout:</h3>
              {{ layout }}
            </div>
          </ion-card-content>
        </ion-card>
        
        <ion-card v-for="(panel, i) in layout" :key="i">
          <ion-card-header>
            <ion-card-title>{{ panel.label }}</ion-card-title>
          </ion-card-header>

          <div v-for="(row, j) in panel.rows" :key="j" style="display:flex; justify-content:space-around">
            <p v-for="(field, k) in row" :key="k">Field for {{ field.name }}</p>
          </div>
        </ion-card>
        
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, loadingController } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import { createDOMEvent } from '@vue/test-utils/dist/createDomEvent';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter()
const route = useRoute()

const loggedIn = ref(false);
const espoUrl = ref('http://espocrm.test');
const user = ref({
  userName: ''
});
const account = ref(null);
const layout = ref(null);
const appSettings = ref({});
const token = ref('');

onBeforeMount( async () => {
  await setSavedToken()
  await setSavedUser()
  await fetchAccount(route.params.id)
  await fetchRecordLayout('Account')
})

watch(
      () => route.params.id,
      async newId => {
        account.value = await fetchAccount(newId)
      }
    )


  async function setSavedToken () {
    const savedToken = await Preferences.get({ key: 'token' })
    token.value = savedToken.value
  }
  async function setSavedUser () {
    const savedUser = await Preferences.get({ key: 'user' })
    user.value = JSON.parse(savedUser.value)
  }
  // async function setSavedPreferences () {
  //   const savedPreferences = await Preferences.get({ key: 'preferences' })
  //   preferences.value = JSON.parse(savedPreferences.value)
  // }
  // async function setSavedSettings () {
  //   const savedSettings = await Preferences.get({ key: 'settings' })
  //   appSettings.value = JSON.parse(savedSettings.value)
  // }

async function fetchAccount (id) {
const espoToken = btoa(`${user.value.userName}:${token.value}`)
await fetch(`${espoUrl.value}/api/v1/Account/` + route.params.id, {
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
    account.value = data
  })
  .catch(console.error);
}
async function fetchRecordLayout (entity = 'Account'  ) {
const espoToken = btoa(`${user.value.userName}:${token.value}`)
await fetch(`${espoUrl.value}/api/v1/${entity}/layout/detail`, {
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
    layout.value = data
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
