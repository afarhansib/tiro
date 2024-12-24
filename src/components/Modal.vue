<template>
    <Transition name="fade">
        <div v-if="show" class="fixed inset-0 z-50">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

            <!-- Modal -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div class="bg-green-900 border-2 border-green-700 p-6 rounded-lg shadow-xl min-w-[300px]">
                    <slot></slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
defineProps(['show'])
defineEmits(['close'])
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0
}
</style>