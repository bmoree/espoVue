<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ route.params.entity }} <span v-if="record">{{ record.name }}</span></ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Espo Capacitor Vue client (fullscreen)</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container" v-if="record">
        
        <ion-card v-for="(panel, i) in layout" :key="i">
          <ion-card-header>
            <ion-card-title>{{ panel.label }}</ion-card-title>
          </ion-card-header>
          <div v-for="(row, j) in panel.rows" :key="j" style="display:flex; justify-content:space-around">
            <div v-for="(field, k) in row" :key="k">
              <p>Fieldtype: {{ fields[field.name].type }} for {{ field.name }}</p>
              <component :is="getFieldComponent(fields[field.name].type)" :modelValue="record[field.name]"></component>
              <p v-html="record[field.name]"></p>
            </div>
          </div>
        </ion-card>

      </div>
    </ion-content>
    <ion-button expand="full" @click="updateRecord(record.id, record)">update</ion-button>
  </ion-page>
</template>

<script lang="ts">
import { ref, onBeforeMount, watch, computed, defineAsyncComponent } from 'vue'
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

const getFieldComponent = (componentName: string) =>
  defineAsyncComponent(
    () =>
      import(
        `../components/fields/${componentName[0].toUpperCase()}${componentName.substring(1)}Field.vue`
      ),
  );


// function getFieldComponent (componentName) {
//   // componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1) + 'Field'
//   // console.log('Field.' + componentName)
//   // return `Field.${componentName}`
//   console.log(`field-${componentName}`)
//   return `field-${componentName}`
// }


const record = ref(null);
const layout = ref(null);
const appSettings = ref({});
const metadata = ref({});
const token = ref('');
const fields = computed(() => {
  return metadata.value.entityDefs[route.params.entity].fields
})

onBeforeMount( async () => {
  await setSavedToken()
  await setSavedUser()
  await setSavedMetadata()
  await fetchRecord(route.params.id)
  await fetchRecordLayout(route.params.entity)
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
  async function setSavedMetadata () {
    const savedMetadata = await Preferences.get({ key: 'metadata' })
    metadata.value = JSON.parse(savedMetadata.value)
  }

  // async function setSavedSettings () {
  //   const savedSettings = await Preferences.get({ key: 'settings' })
  //   appSettings.value = JSON.parse(savedSettings.value)
  // }

async function updateRecord (id = route.params.id, record) {
  const espoToken = btoa(`${user.value.userName}:${token.value}`)
  await fetch(`${espoUrl.value}/api/v1/${route.params.entity}/${id}`, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
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
  },
  body: JSON.stringify(record)})
  .then(function(response) {
    return response.json()
  })
  .then((data) => {
    console.log(data)
    record.value = data
  })
  .catch(console.error);
}
async function fetchRecord (id) {
  const espoToken = btoa(`${user.value.userName}:${token.value}`)
  await fetch(`${espoUrl.value}/api/v1/${route.params.entity}/${route.params.id}`, {
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
    record.value = data
  })
  .catch(console.error);
}
async function fetchRecordLayout (entity) {
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
