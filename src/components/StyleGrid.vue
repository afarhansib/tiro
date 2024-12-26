<template>
    <div>
        <!-- Loading State -->
        <div v-if="isGeneratingPreviews" class="text-center p-8">
            <div class="text-green-400">Generating style previews...</div>
            <div class="text-sm text-green-600">
                {{ completedPreviews }}/{{ totalPreviews }} completed
                <span v-if="failedPreviews" class="text-red-400">
                    ({{ failedPreviews }} failed)
                </span>
            </div>
        </div>

        <!-- Style Grid -->
        <div v-else>
            <div class="grid grid-cols-2 gap-4">
                <StylePreview v-for="style in styles" :key="style.id" :text="text" :style="style"
                    :isSelected="selectedStyle === style.id" :renderedPreview="stylePreviews[style.id]" :livePreview="enableLivePreview"
                    @select="$emit('select', style)" />
            </div>

            <!-- Live Preview Toggle -->
            <div class="mt-4 flex items-center gap-2">
                <input type="checkbox" v-model="enableLivePreview" id="live-preview"
                    class="bg-green-800 border-green-700">
                <label for="live-preview" class="text-green-400">
                    Enable live preview (may affect performance)
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import StylePreview from './StylePreview.vue'
import { fonts } from '../assets/fonts'
import { drawGlyph } from '../utils/canvas'

const props = defineProps(['styles', 'selectedStyle', 'text'])
const emit = defineEmits(['select'])

// State
const isGeneratingPreviews = ref(true)
const completedPreviews = ref(0)
const totalPreviews = ref(props.styles.length)
const failedPreviews = ref(0)
const enableLivePreview = ref(false)

const stylePreviews = ref({})

const generatePreview = async (style) => {
    try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = 200
        canvas.height = 40
        ctx.imageSmoothingEnabled = false

        const graphResult = await drawGlyph({
            text: 'Yotbu',
            id: style.id,
            font: style.settings.font,
            textColor: style.settings.textColor,
            patterns: style.patterns,
            leftWidth: style.settings.leftWidth,
            middleWidth: style.settings.middleWidth,
            rightWidth: style.settings.rightWidth,
            mirrorLeft: style.settings.mirrorLeft,
            mirrorRight: style.settings.mirrorRight
        })

        // Store preview in separate object instead of modifying style
        stylePreviews.value[style.id] = graphResult.svg
        completedPreviews.value++
        return true
    } catch (error) {
        console.error(`Preview generation failed for ${style.name}:`, error)
        stylePreviews.value[style.id] = null
        failedPreviews.value++
        return false
    }
}

const updatePreviews = async () => {
    // console.log('Starting preview generation')
    isGeneratingPreviews.value = true
    completedPreviews.value = 0
    failedPreviews.value = 0
    totalPreviews.value = props.styles.length
    // console.log('Total previews to generate:', totalPreviews.value)

    try {
        // for (const style of props.styles) {
        //     await generatePreview(style)
        //     // Optional: add small delay between each preview
        //     await new Promise(resolve => setTimeout(resolve, 100))
        // }
        // await Promise.all([
        //     Promise.all(props.styles.map(generatePreview)),
        //     new Promise(resolve => setTimeout(resolve, 1000))
        // ])
        await Promise.all(props.styles.map(generatePreview))
    } catch (error) {
        console.error('Preview generation failed:', error)
    } finally {
        // console.log('Finished generating previews')
        // console.log('Completed:', completedPreviews.value)
        // console.log('Failed:', failedPreviews.value)
        isGeneratingPreviews.value = false
    }
}

onMounted(updatePreviews)

// Add new watcher
watch(enableLivePreview, async (enabled) => {
    if (enabled) await updatePreviews()
})

watch(() => props.styles, updatePreviews, { deep: true })
</script>