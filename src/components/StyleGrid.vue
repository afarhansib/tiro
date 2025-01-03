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
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StylePreview v-for="style in styles" :key="style.id" :text="text" :style="style"
                    :isSelected="selectedStyle === style.id" :renderedPreview="stylePreviews[style.id]"
                    :livePreview="enableLivePreview" :maxWidth="maxDimensions.width" :maxHeight="maxDimensions.height"
                    :styleDimensions="styleDimensions[style.id]" @select="$emit('select', style)" />
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

const maxDimensions = ref({ width: 0, height: 0 })

const styleDimensions = ref({})

const stylePreviews = ref({})

const generatePreview = async (style) => {
    try {
        const graphResult = await drawGlyph({
            text: enableLivePreview.value ? props.text : 'Yotbu',
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
        // console.log('Generated preview for', style.name)
        // console.log(graphResult.width, graphResult.height)

        // Update current dimensions
        styleDimensions.value[style.id] = {
            width: graphResult.width,
            height: graphResult.height
        }
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
        //     await new Promise(resolve => setTimeout(resolve, 1000))
        // }
        // await Promise.all([
        //     Promise.all(props.styles.map(generatePreview)),
        //     new Promise(resolve => setTimeout(resolve, 1000))
        // ])
        // First pass: measure all previews
        // First pass: get dimensions from all previews
        // if (styles.length === 0) {
        //     return
        // }
        const measurements = await Promise.all(
            props.styles.map(async (style) => {
                const result = await drawGlyph({
                    text: enableLivePreview.value ? props.text : 'Yotbu',
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

                // console.log('Generated preview for', style.name)
                // console.log(result.width, result.height)

                return {
                    width: result.width,
                    height: result.height,
                    svg: result.svg,
                    style
                }
            })
        )

        // Find widest preview and use its dimensions
        const widestMeasurement = measurements.reduce((widest, current) => {
            return current.width > widest.width ? current : widest
        })

        maxDimensions.value = {
            width: widestMeasurement.width,
            height: widestMeasurement.height
        }

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
    await updatePreviews()
})

watch(() => props.text,
    () => {
        // console.log('Text changed:', props.text)
        if (enableLivePreview.value) {
            updatePreviews()
        }
    },
    {
        flush: 'post',     // wait until DOM updates complete
        debounce: 300,     // debounce updates
        maxWait: 1000      // maximum time to wait before forcing update
    }
)

watch(() => props.styles, updatePreviews, { deep: true })
</script>