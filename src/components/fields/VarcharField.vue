<template>
    <input type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    >
</template>
  
<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    modelValue: {
            type: String,
            default: '',
            required: true
        }
})

const emit = defineEmits(['update:modelValue']);

</script>
  
<style scoped>
</style>
  