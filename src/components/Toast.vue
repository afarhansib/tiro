<!-- Toast.vue -->
<template>
    <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
    >
        <div v-if="show"
            class="fixed bottom-4 right-4 z-50 
                   flex items-center gap-2 
                   px-4 py-3 rounded-lg shadow-lg
                   border border-green-700"
            :class="typeClasses[type]"
        >
            <!-- Success Icon -->
            <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <!-- Error Icon -->
            <svg v-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>

            <span class="text-sm font-medium">{{ message }}</span>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 3000
    },
    type: {
        type: String,
        default: 'success',
        validator: (value) => ['success', 'error'].includes(value)
    }
})

const show = ref(false)
const typeClasses = {
    success: 'bg-green-800/95 text-green-400',
    error: 'bg-red-900/95 text-red-400'
}

onMounted(() => {
    show.value = true
    setTimeout(() => {
        show.value = false
    }, props.duration)
})
</script>