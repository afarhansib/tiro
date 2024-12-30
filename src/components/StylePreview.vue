<template>
    <div class="
            group
            relative
            p-3
            pt-2
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
            <div class="text-green-400 flex items-center gap-2">
                {{ style.name }}
                <span class="text-green-600 text-xs">
                    ({{ styleDimensions.width }}x{{ styleDimensions.height }})
                </span>
                <span>
                    <div v-if="!style.verified && !style.isLocal" class="px-2 py-0.5 rounded-md text-xs font-medium
                bg-gradient-to-r from-yellow-900/50 to-red-900/30
                text-yellow-500 border border-yellow-700/20
                flex items-center gap-1.5 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 animate-pulse" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        unverified
                    </div>
                    <div v-if="style.isLocal" class="px-2 py-0.5 rounded-md text-xs font-medium
                bg-gradient-to-r from-gray-700/50 to-slate-900/30
                text-gray-300 border border-yellow-700/20
                flex items-center gap-1.5 shadow-sm">
                        local
                    </div>
                </span>
            </div>
            <!-- <div v-if="!style.verified">unverified</div> -->
            <div class="text-green-600 text-sm">{{ style.author }}</div>
        </div>

        <!-- Preview Area -->
        <div class="relative flex-1 flex items-center justify-center">
            <!-- <img v-if="!livePreview" :src="style.preview" class="w-full [image-rendering:pixelated]"
                :class="{ 'opacity-50': !style.preview }" /> -->
            <div class="[image-rendering:pixelated] w-full h-full flex justify-center items-center">
                <img v-if="pixelatedPreview" :src="pixelatedPreview" class="w-full" />
            </div>

            <!-- <p v-if="livePreview">is live preview</p> -->

            <!-- Error State -->
            <div v-if="!renderedPreview && !livePreview" class="text-red-400 text-sm text-center">
                Preview failed
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
    style: Object,
    isSelected: Boolean,
    livePreview: Boolean,
    text: String,
    renderedPreview: String,
    maxWidth: Number,
    maxHeight: Number,
    styleDimensions: Object
})

const emit = defineEmits(['select'])
const pixelatedPreview = ref(null)
const renderToCanvas = (svgString) => {
    if (!svgString) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = props.maxWidth
    canvas.height = props.maxHeight

    // Disable image smoothing
    ctx.imageSmoothingEnabled = false
    ctx.webkitImageSmoothingEnabled = false
    ctx.mozImageSmoothingEnabled = false
    ctx.oImageSmoothingEnabled = false
    ctx.msImageSmoothingEnabled = false

    const img = new Image()

    return new Promise((resolve) => {
        img.onload = () => {
            // console.log('Original image dimensions:', img.naturalWidth, img.naturalHeight)

            // Calculate scale to fit within canvas dimensions
            const scaleWidth = canvas.width / img.naturalWidth
            const scaleHeight = canvas.height / img.naturalHeight
            const scale = Math.min(scaleWidth, scaleHeight)

            const finalWidth = Math.floor(img.naturalWidth * scale)
            const finalHeight = Math.floor(img.naturalHeight * scale)

            const xOffset = Math.floor((canvas.width - finalWidth) / 2)
            const yOffset = Math.floor((canvas.height - finalHeight) / 2)

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            ctx.drawImage(
                img,
                Math.floor(xOffset), Math.floor(yOffset),
                Math.floor(finalWidth), Math.floor(finalHeight)
            )

            resolve(canvas.toDataURL('image/png'))
        }

        // Add width and height attributes to match viewBox
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgString, 'image/svg+xml')
        const svgElement = doc.documentElement

        // Get viewBox values
        const viewBox = svgElement.getAttribute('viewBox')
        const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number)

        // Set width and height to match viewBox
        svgElement.setAttribute('width', vbWidth)
        svgElement.setAttribute('height', vbHeight)

        const serializer = new XMLSerializer()
        const modifiedSvgString = serializer.serializeToString(svgElement)

        img.src = 'data:image/svg+xml,' + encodeURIComponent(modifiedSvgString)
    })
}
watch(
    [() => props.renderedPreview, () => props.livePreview],
    async ([newSvg]) => {
        if (!newSvg) return
        pixelatedPreview.value = await renderToCanvas(newSvg)
    },
    { immediate: true }
)
</script>