<template>
    <div class="
            group
            relative
            p-3
            bg-green-900/30
            rounded-lg 
            border-2
            border-green-800
            hover:bg-green-800/50
            hover:border-green-600
            hover:shadow-lg
            hover:shadow-green-900/50
            cursor-pointer 
            transition-all
            duration-200
            transform-gpu
            flex
            flex-col
        " :class="{
            'ring-2 ring-green-400 ring-offset-2 ring-offset-green-900 border-green-400 bg-green-800/80 shadow-xl shadow-green-900/50 hover:border-green-800 hover:bg-green-900/30': isSelected,
            '': !isSelected
        }" @click="$emit('select', style.id)">
        <!-- Header -->
        <div class="flex justify-between mb-4">
            <div class="text-green-400">{{ style.name }}</div>
            <div class="text-green-600 text-sm">{{ style.author }}</div>
        </div>

        <!-- Preview Area -->
        <div class="relative flex-1 flex items-center justify-center">
            <!-- <img v-if="!livePreview" :src="style.preview" class="w-full [image-rendering:pixelated]"
                :class="{ 'opacity-50': !style.preview }" /> -->
            <div v-if="!livePreview" v-html="renderedPreview" class="w-full h-full"></div>
            <canvas v-else ref="canvas" class="w-full [image-rendering:pixelated]" />

            <!-- Error State -->
            <div v-if="!renderedPreview && !livePreview" class="text-red-400 text-sm text-center">
                Preview failed
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { drawGlyph } from '../utils/canvas'
import { fonts } from '../assets/fonts'

const props = defineProps({
    style: Object,
    isSelected: Boolean,
    livePreview: Boolean,
    text: String,
    renderedPreview: String
})

const emit = defineEmits(['select'])
const canvas = ref(null)

onMounted(() => {
    if (canvas.value) {
        canvas.value.width = 200
        canvas.value.height = 40
        if (props.livePreview) updatePreview()
    }
})

watch(
    () => [props.style, props.livePreview],
    async () => {
        if (props.livePreview && canvas.value) {
            await updatePreview()
        }
    },
    { deep: true }
)

const updatePreview = async () => {
    const ctx = canvas.value.getContext('2d')
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.imageSmoothingEnabled = false

    await drawGlyph(ctx, {
        text: props.text,
        font: fonts[props.style.settings.font],
        textColor: props.style.settings.textColor,
        patterns: props.style.patterns,
        leftWidth: props.style.settings.leftWidth,
        middleWidth: props.style.settings.middleWidth,
        rightWidth: props.style.settings.rightWidth,
        mirrorLeft: props.style.settings.mirrorLeft,
        mirrorRight: props.style.settings.mirrorRight
    })
}
</script>