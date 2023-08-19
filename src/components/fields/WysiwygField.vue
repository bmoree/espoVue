<template>
    <textarea 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
</template>
  
<script setup lang="ts">

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
  