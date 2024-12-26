<template>
    <div class="min-h-screen bg-green-900 text-white lowercase p-4">
        <div class="max-w-4xl mx-auto pt-6">
            <div class="space-y-6">
                <!-- Text Input -->
                <div class="space-y-2">
                    <label class="text-green-400">text</label>
                    <input v-model="text" type="text"
                        class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="enter your text here">
                </div>

                <!-- Customization Options -->
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <label class="text-green-400">font family</label>
                        <select v-model="selectedFont"
                            class="bg-green-800 border border-green-700 rounded-lg px-4 py-2 w-full">
                            <option v-for="fontName in fontNames" :key="fontName" :value="fontName">
                                {{ fontName }}
                            </option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-green-400">space width</label>
                        <input v-model="spaceWidth" type="number" min="1" max="10"
                            class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600">
                    </div>

                    <div class="space-y-2">
                        <label class="text-green-400">character spacing</label>
                        <input v-model="charSpacing" type="number" min="-2" max="10"
                            class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600">
                    </div>
                </div>
                <div class="space-y-6">
                    <div class="space-y-2">
                        <div class="flex gap-2 items-center">
                            <label class="text-green-400">colors</label>
                            <div class="flex gap-2">
                                <button @click="colorMode = 'text'" class="px-2 py-1 rounded text-sm"
                                    :class="colorMode === 'text' ? 'bg-green-600' : 'bg-green-800'">
                                    Text
                                </button>
                                <button @click="colorMode = 'decoration'" class="px-2 py-1 rounded text-sm"
                                    :class="colorMode === 'decoration' ? 'bg-green-600' : 'bg-green-800'">
                                    Decoration
                                </button>
                            </div>
                        </div>

                        <!-- Add gradient toggle -->
                        <div class="flex gap-2 items-center">
                            <label class="text-green-400 text-sm">Type:</label>
                            <button @click="isGradient = false" class="px-2 py-1 rounded text-sm"
                                :class="!isGradient ? 'bg-green-600' : 'bg-green-800'">
                                Solid
                            </button>
                            <button @click="isGradient = true" class="px-2 py-1 rounded text-sm"
                                :class="isGradient ? 'bg-green-600' : 'bg-green-800'">
                                Gradient
                            </button>
                        </div>

                        <!-- Gradient options (shown only when isGradient is true) -->
                        <div v-if="isGradient" class="space-y-2">
                            <div class="flex gap-2 items-center">
                                <label class="text-green-400 text-sm">Direction:</label>
                                <select v-model="gradientDirection"
                                    class="bg-green-800 text-white rounded px-2 py-1 text-sm">
                                    <option value="to right">To Right</option>
                                    <option value="to left">To Left</option>
                                    <option value="to bottom">To Bottom</option>
                                    <option value="to top">To Top</option>
                                    <option value="45deg">45°</option>
                                    <option value="-45deg">-45°</option>
                                    <option value="radial">Radial</option>
                                </select>
                            </div>

                            <!-- Gradient color stops -->
                            <div class="space-y-2 flex flex-row gap-4 h-full">
                                <div class="flex flex-col gap-2">
                                    <div v-for="(color, index) in gradientColors" :key="index"
                                        class="flex gap-2 items-center">
                                        <input type="color" v-model="gradientColors[index]"
                                            class="w-8 h-8 rounded bg-transparent border-0 cursor-pointer">
                                        <button @click="removeGradientColor(index)"
                                            class="text-red-400 px-2 py-1 rounded text-sm"
                                            v-if="gradientColors.length > 2">
                                            Remove
                                        </button>
                                    </div>
                                    <button @click="addGradientColor"
                                        class="text-green-400 px-2 py-1 rounded text-sm border border-green-400"
                                        v-if="gradientColors.length < 5">
                                        Add Color Stop
                                    </button>
                                    <button @click="addGradientColorsToPalette"
                                        class="text-green-400 px-2 py-1 rounded text-sm border border-green-400"
                                        title="Add all colors from text to palette">
                                        Add Text Colors to Palette
                                    </button>
                                </div>
                                <div class="rounded-lg flex-1 h-full min-h-24" :style="{
                                    background: `linear-gradient(${gradientDirection === 'to right' ? '90deg' :
                                        gradientDirection === 'to left' ? '270deg' :
                                            gradientDirection === 'to bottom' ? '180deg' :
                                                gradientDirection === 'to top' ? '0deg' :
                                                    gradientDirection
                                        }, ${gradientColors.join(', ')})`
                                }" />
                            </div>
                        </div>

                        <!-- Original color picker (shown when isGradient is false) -->
                        <div class="flex gap-2 flex-wrap">
                            <button v-for="color in colors" :key="color"
                                @click="colorMode === 'text' ? textColor = color : activeColor = color"
                                class="w-8 h-8 rounded-lg border-2 transition-all" :style="{ backgroundColor: color }"
                                :title="color" :class="[
                                    (colorMode === 'text' && textColor === color) ||
                                        (colorMode === 'decoration' && activeColor === color)
                                        ? 'border-white scale-110'
                                        : 'border-transparent hover:scale-105'
                                ]" />
                            <input type="color" :value="colorMode === 'text' ? textColor : activeColor"
                                @change="e => addCustomColor(e.target.value)"
                                class="w-8 h-8 rounded bg-transparent border-0 cursor-pointer">
                        </div>
                    </div>
                </div>
                <!-- Decoration Controls Grid -->
                <div class="overflow-x-auto border border-green-700 rounded-lg p-4 grid-bg">
                    <div class="flex gap-4 w-fit mx-auto flex-nowrap" id="panzoom">
                        <!-- Left Decoration -->
                        <div class="space-y-2 flex flex-col flex-nowrap items-center">
                            <label class="text-green-400 whitespace-nowrap text-nowrap">Left Pattern</label>
                            <div class="flex flex-col lg:flex-row lg:items-center gap-2">
                                <div class="flex items-center flex-nowrap gap-2">
                                    <!-- Left side controls -->
                                    <div class="flex flex-col items-center gap-2">
                                        <button
                                            @click="adjustDirection = 'left'; leftWidth = Math.max(-1, leftWidth - 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                        <button
                                            @click="adjustDirection = 'left'; leftWidth = Math.min(100, leftWidth + 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                    </div>

                                    <p class="px-4">{{ leftWidth }}</p>

                                    <!-- Right side controls -->
                                    <div class="flex flex-col items-center gap-2">
                                        <button
                                            @click="adjustDirection = 'right'; leftWidth = Math.max(-1, leftWidth - 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                        <button
                                            @click="adjustDirection = 'right'; leftWidth = Math.min(100, leftWidth + 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-green-800 p-2 rounded w-max">
                                <div class="grid gap-1"
                                    :style="{ 'grid-template-columns': `repeat(${leftWidth}, minmax(0, 1fr))` }">
                                    <template v-for="y in 10" :key="y">
                                        <button v-for="x in leftWidth" :key="`${x}-${y}`"
                                            @click="togglePixel('left', x - 1, y - 1)"
                                            class="w-6 h-6 border border-green-700 rounded transition-colors"
                                            :class="leftDecoration[y - 1]?.[x - 1]?.active ? '' : 'bg-green-900'"
                                            :style="leftDecoration[y - 1]?.[x - 1]?.active ?
                                                { backgroundColor: leftDecoration[y - 1][x - 1].color } : {}" />
                                    </template>
                                </div>
                            </div>
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="mirrorLeft"
                                    class="form-checkbox bg-green-800 border-green-700">
                                <span class="ml-2 text-green-400">Mirror</span>
                            </label>
                            <!-- <button @click="rightDecoration = JSON.parse(JSON.stringify(leftDecoration)).map(row => [...row].reverse())"
                                    class="px-3 py-1 bg-green-600 rounded-lg">mirror</button> -->
                        </div>

                        <!-- Middle Pattern -->
                        <div class="space-y-2 flex flex-col items-center">
                            <label class="text-green-400 text-nowrap whitespace-nowrap">Middle Pattern</label>
                            <div class="flex items-center gap-2">
                                <div class="flex flex-col items-center gap-2">
                                    <button
                                        @click="adjustDirection = 'left'; middleWidth = Math.max(-1, middleWidth - 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                    <button
                                        @click="adjustDirection = 'left'; middleWidth = Math.min(100, middleWidth + 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                </div>

                                <p class="px-4">{{ middleWidth }}</p>

                                <!-- Right side controls -->
                                <div class="flex flex-col items-center gap-2">
                                    <button
                                        @click="adjustDirection = 'right'; middleWidth = Math.max(-1, middleWidth - 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                    <button
                                        @click="adjustDirection = 'right'; middleWidth = Math.min(100, middleWidth + 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                </div>
                            </div>
                            <div class="bg-green-800 p-2 rounded w-max">
                                <div class="grid gap-1"
                                    :style="{ 'grid-template-columns': `repeat(${middleWidth}, minmax(0, 1fr))` }">
                                    <template v-for="y in 10" :key="y">
                                        <button v-for="x in middleWidth" :key="`${x}-${y}`"
                                            @click="togglePixel('middle', x - 1, y - 1)"
                                            class="w-6 h-6 border border-green-700 rounded transition-colors"
                                            :class="middleDecoration[y - 1]?.[x - 1]?.active ? '' : 'bg-green-900'"
                                            :style="middleDecoration[y - 1]?.[x - 1]?.active ?
                                                { backgroundColor: middleDecoration[y - 1][x - 1].color } : {}" />
                                    </template>
                                </div>
                            </div>
                            <button @click="showResetModal = true"
                                class="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500">
                                reset
                            </button>
                        </div>

                        <!-- Right Decoration -->
                        <div class="space-y-2 flex flex-col items-center">
                            <label class="text-green-400 text-nowrap whitespace-nowrap">Right Pattern</label>
                            <div class="flex flex-row flex-nowrap lg:items-center gap-2">
                                <div class="flex flex-col items-center gap-2">
                                    <button @click="adjustDirection = 'left'; rightWidth = Math.max(-1, rightWidth - 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                    <button
                                        @click="adjustDirection = 'left'; rightWidth = Math.min(100, rightWidth + 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                </div>

                                <p class="px-4">{{ rightWidth }}</p>

                                <!-- Right side controls -->
                                <div class="flex flex-col items-center gap-2">
                                    <button
                                        @click="adjustDirection = 'right'; rightWidth = Math.max(-1, rightWidth - 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                    <button
                                        @click="adjustDirection = 'right'; rightWidth = Math.min(100, rightWidth + 1)"
                                        class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                </div>
                            </div>
                            <div class="bg-green-800 p-2 rounded w-max">
                                <div class="grid gap-1"
                                    :style="{ 'grid-template-columns': `repeat(${rightWidth}, minmax(0, 1fr))` }">
                                    <template v-for="y in 10" :key="y">
                                        <button v-for="x in rightWidth" :key="`${x}-${y}`"
                                            @click="togglePixel('right', x - 1, y - 1)"
                                            class="w-6 h-6 border border-green-700 rounded transition-colors"
                                            :class="rightDecoration[y - 1]?.[x - 1]?.active ? '' : 'bg-green-900'"
                                            :style="rightDecoration[y - 1]?.[x - 1]?.active ?
                                                { backgroundColor: rightDecoration[y - 1][x - 1].color } : {}" />
                                    </template>
                                </div>
                            </div>
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="mirrorRight"
                                    class="form-checkbox bg-green-800 border-green-700">
                                <span class="ml-2 text-green-400">Mirror</span>
                            </label>
                            <!-- <button @click="leftDecoration = JSON.parse(JSON.stringify(rightDecoration)).map(row => [...row].reverse())"
                            class="px-3 py-1 bg-green-600 rounded-lg">mirror</button> -->
                        </div>
                    </div>
                </div>
                <!-- Preview Canvas -->
                <div class="space-y-2">
                    <label class="text-green-400">preview</label>
                    <div class="bg-green-800 p-4 rounded-lg">
                        <canvas ref="canvas"
                            class="w-full [image-rendering:pixelated] border border-green-700"></canvas>
                    </div>
                </div>

                <div class="text-sm text-green-400">
                    Real size: {{ realWidth }}x{{ realHeight }} pixels
                </div>

                <!-- Actions -->
                <div class="flex gap-4">
                    <!-- <button @click="generateGlyph"
                        class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500 transition-colors">
                        generate glyph
                    </button> -->
                    <button @click="downloadGlyph" :disabled="!canDownload"
                        class="px-4 py-2 bg-green-800 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        download 1:1
                    </button>
                    <button @click="downloadPreview" :disabled="!canDownload"
                        class="px-4 py-2 bg-green-800 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        download preview
                    </button>
                </div>

                <div class="space-y-2">
                    <label class="text-green-400">Styles</label>
                    <StyleGrid :text="text" :styles="styles" :selectedStyle="selectedStyle" @select="loadStyle" />

                    <div class="flex flex-col md:flex-row w-full gap-2">
                        <input v-model="newStyleName" placeholder="style name"
                            class="bg-green-800 border flex-1 border-green-700 rounded-lg px-4 py-2 placeholder-green-700">
                        <input v-model="newStyleAuthor" placeholder="author"
                            class="bg-green-800 border flex-1 border-green-700 rounded-lg px-4 py-2 placeholder-green-700">
                        <button @click="saveStyle(newStyleName, newStyleAuthor)"
                            class="px-4 py-2 bg-green-600 rounded-lg">
                            Save Style
                        </button>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-green-400">Style Code</label>
                    <div class="flex gap-2">
                        <textarea v-model="styleCode"
                            class="flex-1 bg-green-800 border border-green-700 rounded-lg px-4 py-2"></textarea>
                        <div class="flex flex-col gap-2">
                            <button @click="copyStyleCode" class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                Copy
                            </button>
                            <button @click="loadStyleCode" class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                Load
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-green-400">Style Encoder</label>
                    <div class="flex gap-2">
                        <textarea v-model="styleEncoder"
                            class="flex-1 bg-green-800 border border-green-700 rounded-lg px-4 py-2"></textarea>
                        <div class="flex flex-col gap-2">
                            <button @click="styleEncoder = encodeStyle(parseToObject(styleEncoder))"
                                class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                encode
                            </button>
                            <button @click="styleEncoder = JSON.stringify(decodeStyle(styleEncoder), null, 2)"
                                class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                decode
                            </button>
                            <button @click="copyStyleEncoder"
                                class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Modal :show="showResetModal" @close="showResetModal = false">
        <div class="space-y-4">
            <div class="text-green-400 font-medium">Reset Patterns</div>
            <div class="text-green-500">Are you sure? This will delete all patterns and cannot be undone.</div>
            <div class="flex justify-end gap-3">
                <button @click="showResetModal = false"
                    class="px-4 py-2 text-green-400 hover:bg-green-800/50 rounded-lg">
                    Cancel
                </button>
                <button @click="resetPatterns" class="px-4 py-2 bg-red-900 text-red-400 hover:bg-red-800 rounded-lg">
                    Reset
                </button>
            </div>
        </div>
    </Modal>
</template>

<style>
.grid-bg {
    /* Dark background */
    background-image:
        linear-gradient(to right, rgba(46, 139, 87, 0.1) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(46, 139, 87, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
    /* Grid size */
}
</style>

<script setup>
import { ref, watch, onMounted, compile, nextTick } from 'vue'
import { fonts } from '../assets/fonts'
import { styles as encodedStyles } from '../assets/styles'
import StyleGrid from './StyleGrid.vue'
import Modal from './Modal.vue'

const getDefaultText = () => {
    const defaults = [
        "VICTORIA",
        "FUEGO",
        "VAMOS",
        "RAPIDO",
        "FUERZA",
        "EQUIPO",
        "BATALLA",
        "CAMPEON",
        "GUERRERO",
        "LEYENDA",
        "PODER",
        "GLORIA",
        "LUCHA",
        "AMIGO",
        "VENGANZA",
        "DESTINO",
        "HONOR",
        "VALIENTE"
    ]
    return defaults[Math.floor(Math.random() * defaults.length)]
}


import { encodeStyle, decodeStyle } from '../utils/style-encoder'

import Panzoom from '@panzoom/panzoom'

const showResetModal = ref(false)

const newStyleName = ref('')
const newStyleAuthor = ref('')
const selectedStyle = ref(null)
const styleCode = ref('')

const styleEncoder = ref('')

const styles = ref(encodedStyles.map(encodedStyle => decodeStyle(encodedStyle)))

const text = ref(getDefaultText())
const canvas = ref(null)
// Replace font selection code
const fontNames = Object.keys(fonts)
const selectedFont = ref('cype') // Set default font by name
const canDownload = ref(false)
const spaceWidth = ref(3)
const charSpacing = ref(1)

const realWidth = ref(0)
const realHeight = ref(10) // Default height is 10px

// Add decoration controls
const leftWidth = ref(3)
const middleWidth = ref(1)
const rightWidth = ref(3)

const isGradient = ref(false)
const gradientDirection = ref('to bottom')
const gradientColors = ref(['#ff8c00', '#ff0080'])

const addGradientColor = () => {
    if (gradientColors.value.length < 5) {
        gradientColors.value.push('#000000')
    }
}

const removeGradientColor = (index) => {
    if (gradientColors.value.length > 2) {
        gradientColors.value.splice(index, 1)
    }
}

// Watch for gradient changes and update the color value
watch([isGradient, gradientDirection, gradientColors], () => {
    if (isGradient.value) {
        const gradientString = `gradient/${gradientDirection.value}/${gradientColors.value.join('/')}`
        if (colorMode.value === 'text') {
            textColor.value = gradientString
        } else {
            activeColor.value = gradientString
        }
    }
}, { deep: true })

// Initialize decoration data with proper structure
const initDecorationData = (width) => {
    return Array(10).fill().map(() =>
        Array(width).fill().map(() => ({
            active: false,
            color: '#4ade80'
        }))
    )
}

// Initialize decoration arrays
const leftDecoration = ref(initDecorationData(leftWidth.value))
const middleDecoration = ref(initDecorationData(middleWidth.value))
const rightDecoration = ref(initDecorationData(rightWidth.value))

const mirrorLeft = ref(false)
const mirrorRight = ref(false)

// Add to data/refs section
const adjustDirection = ref('right') // 'left' or 'right'

// Add new ref for text color
// const textColor = ref('#4ade80')
const textColor = ref('gradient/to bottom/#ff8c00/#ff0080')
const colorMode = ref('decoration')

// Add state tracking for original decorations
const originalLeftDecoration = ref(null)
const originalRightDecoration = ref(null)

// Add color constants
const colors = ref([
    // Tiro default
    // Basic Colors
    '#4ade80', '#FFFFFF', '#808080', '#000000',  // Black, Gray, White

    '#94a3b8', '#475569', '#1e293b', '#0f172a', // slate
    '#d6d3d1', '#78716c', '#44403c', '#1c1917', // stone
    '#fca5a5', '#ef4444', '#b91c1c', '#7f1d1d', // red
    '#fde047', '#eab308', '#a16207', '#713f12', // yellow
    '#86efac', '#22c55e', '#15803d', '#14532d', // green
    '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a8a', // blue
    '#d8b4fe', '#a855f7', '#7e22ce', '#581c87', // purple
    '#f9a8d4', '#ec4899', '#be185d', '#831843', // pink
])

const activeColor = ref(colors.value[0])

const addCustomColor = (color) => {
    if (!colors.value.includes(color)) {
        colors.value.push(color)
    }
    if (colorMode.value === 'text' && !isGradient.value) {
        textColor.value = color
    } else {
        activeColor.value = color
    }
}

watch(textColor, () => {
    generateGlyph()
})

const addGradientColorsToPalette = () => {
    if (!canvas.value) return

    const ctx = canvas.value.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.value.width, canvas.value.height).data
    const uniqueColors = new Set()

    // Scan every pixel in the canvas
    for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i]
        const g = imageData[i + 1]
        const b = imageData[i + 2]
        const a = imageData[i + 3]

        // Only add fully opaque pixels (a === 255)
        if (a === 255) {
            const hex = rgbToHex(r, g, b)
            uniqueColors.add(hex)
        }
    }

    // Add all unique colors to the palette
    uniqueColors.forEach(color => addCustomColor(color))
}

const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
    }).join('')
}

const resetPatterns = () => {
    // Reset widths to defaults
    leftWidth.value = 3
    middleWidth.value = 1
    rightWidth.value = 3

    // Reset patterns with new widths
    const emptyCell = { active: false, color: '#4ade80' }
    leftDecoration.value = Array(10).fill().map(() =>
        Array(leftWidth.value).fill().map(() => ({ ...emptyCell }))
    )
    middleDecoration.value = Array(10).fill().map(() =>
        Array(middleWidth.value).fill().map(() => ({ ...emptyCell }))
    )
    rightDecoration.value = Array(10).fill().map(() =>
        Array(rightWidth.value).fill().map(() => ({ ...emptyCell }))
    )

    // Reset mirror settings
    mirrorLeft.value = false
    mirrorRight.value = false

    // Close modal and regenerate
    showResetModal.value = false
    generateGlyph()
}

// Update generateGlyph function to apply decorations
const generateGlyph = () => {
    if (!canvas.value || !text.value) return

    const ctx = canvas.value.getContext('2d')
    const spacing = Number(charSpacing.value)
    const font = fonts[selectedFont.value]
    const spaceCharWidth = Number(spaceWidth.value)

    // Calculate text width first
    const chars = text.value.split('')
    const textWidth = chars.reduce((width, char, index) => {
        const isLast = index === chars.length - 1
        if (char === ' ') return width + spaceCharWidth
        const charData = font.characters.find(c => c.char === char)
        return width + (charData ? charData.matrix[0].length + (isLast ? 0 : spacing) : 1)
    }, 0)

    // Add decoration widths
    const leftTotalWidth = leftWidth.value
    const rightTotalWidth = rightWidth.value
    const finalWidth = textWidth + leftTotalWidth + rightTotalWidth

    canvas.value.width = finalWidth
    canvas.value.height = 10
    realWidth.value = finalWidth
    realHeight.value = 10

    ctx.clearRect(0, 0, finalWidth, 10)
    ctx.fillStyle = '#4ade80'

    // Draw middle pattern under text
    let x = leftTotalWidth
    while (x < leftTotalWidth + textWidth) {
        middleDecoration.value.forEach((row, y) => {
            row.forEach((pixel, px) => {
                if (pixel.active) {
                    ctx.fillStyle = pixel.color
                    ctx.fillRect(x + (px % middleWidth.value), y, 1, 1)
                }
            })
        })
        x += middleWidth.value
    }

    let textGradient = null
    if (textColor.value.startsWith('gradient')) {
        // if (true) {
        try {
            // Parse gradient string
            const [_, direction, ...colors] = textColor.value.split('/')
            // const [_, direction, ...colors] = ('gradient|to bottom|#ff8c00|#ff0080').split('|')

            // Create gradient for entire text area
            let gradient
            const textStartX = leftTotalWidth
            const textEndX = leftTotalWidth + textWidth

            switch (direction) {
                case 'to right':
                    gradient = ctx.createLinearGradient(textStartX, 0, textEndX, 0)
                    break
                case 'to left':
                    gradient = ctx.createLinearGradient(textEndX, 0, textStartX, 0)
                    break
                case 'to bottom':
                    gradient = ctx.createLinearGradient(textStartX, 0, textStartX, 10)
                    break
                case 'to top':
                    gradient = ctx.createLinearGradient(textStartX, 10, textStartX, 0)
                    break
                case '45deg':
                    gradient = ctx.createLinearGradient(textStartX, 0, textEndX, 10)
                    break
                case '-45deg':
                    gradient = ctx.createLinearGradient(textEndX, 0, textStartX, 10)
                    break

                case 'diagonal-bottom-left':
                    gradient = ctx.createLinearGradient(textEndX, 0, textStartX, 10)
                    break

                case 'diagonal-bottom-right':
                    gradient = ctx.createLinearGradient(textStartX, 0, textEndX, 10)
                    break

                case 'radial':
                    // Creates a radial gradient from center
                    const centerX = textStartX + (textWidth / 2)
                    const centerY = 5 // Assuming height is 10
                    const radius = Math.max(textWidth, 10) / 2
                    gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
                    break

                case 'diagonal-top-right':
                    gradient = ctx.createLinearGradient(textStartX, 10, textEndX, 0)
                    break

                case 'diagonal-top-left':
                    gradient = ctx.createLinearGradient(textEndX, 10, textStartX, 0)
                    break

                case '135deg':
                    gradient = ctx.createLinearGradient(textStartX, 10, textEndX, 0)
                    break

                case '225deg':
                    gradient = ctx.createLinearGradient(textEndX, 10, textStartX, 0)
                    break
                default:
                    gradient = ctx.createLinearGradient(textStartX, 0, textEndX, 0)
            }

            // Add color stops
            colors.forEach((color, index) => {
                const offset = colors.length === 1 ? 0 : index / (colors.length - 1)
                gradient.addColorStop(offset, color)
            })

            textGradient = gradient
        } catch (error) {
            console.error('Gradient error:', error)
            textGradient = null
        }
    }

    // Draw text
    let currentX = leftTotalWidth
    chars.forEach((char, index) => {
        const isLast = index === chars.length - 1
        if (char === ' ') {
            currentX += spaceCharWidth
            return
        }
        const charData = font.characters.find(c => c.char === char)
        if (charData) {
            // Set fill style once for each character
            ctx.fillStyle = textGradient || textColor.value

            charData.matrix.forEach((row, y) => {
                row.forEach((pixel, x) => {
                    if (pixel) ctx.fillRect(currentX + x, y, 1, 1)
                })
            })
            currentX += charData.matrix[0].length + (isLast ? 0 : spacing)
        }
    })

    // Draw left decoration
    leftDecoration.value.forEach((row, y) => {
        row.forEach((pixel, x) => {
            if (pixel.active) {
                ctx.fillStyle = pixel.color
                ctx.fillRect(x, y, 1, 1)
            }
        })
    })

    // Draw right decoration
    rightDecoration.value.forEach((row, y) => {
        row.forEach((pixel, x) => {
            if (pixel.active) {
                ctx.fillStyle = pixel.color
                ctx.fillRect(finalWidth - rightWidth.value + x, y, 1, 1)
            }
        })
    })

    canDownload.value = true
}

const downloadGlyph = () => {
    if (!canvas.value) return

    canvas.value.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${text.value.replace(/\s+/g, '-')}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }, 'image/png')
}

const downloadPreview = () => {
    if (!canvas.value) return

    // Create temporary canvas for scaled version
    const previewCanvas = document.createElement('canvas')
    const scale = 32
    const padding = 2 // 2 pixel padding
    const scaledPadding = padding * scale // Scale padding to match preview size

    // Add padding to dimensions
    previewCanvas.width = (canvas.value.width + padding * 2) * scale
    previewCanvas.height = (canvas.value.height + padding * 2) * scale

    const ctx = previewCanvas.getContext('2d')
    ctx.imageSmoothingEnabled = false

    // Fill with transparent background
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height)

    // Draw image with offset for padding
    ctx.drawImage(
        canvas.value,
        0, 0,
        canvas.value.width, canvas.value.height,
        scaledPadding, scaledPadding, // Offset by scaled padding
        canvas.value.width * scale, canvas.value.height * scale
    )

    previewCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${text.value.replace(/\s+/g, '-')}-preview.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }, 'image/png')
}

// Update togglePixel function
const togglePixel = (section, x, y) => {
    if (x < 0 || y < 0) return

    let targetArray
    switch (section) {
        case 'left':
            targetArray = leftDecoration.value
            break
        case 'middle':
            targetArray = middleDecoration.value
            break
        case 'right':
            targetArray = rightDecoration.value
            break
        default:
            return
    }

    if (!targetArray?.[y]?.[x]) return

    const pixel = targetArray[y][x]
    if (!pixel.active) {
        // Activate and set color
        pixel.active = true
        pixel.color = activeColor.value
    } else if (pixel.color === activeColor.value) {
        // Deactivate if same color
        pixel.active = false
    } else {
        // Update color if different
        pixel.color = activeColor.value
    }

    generateGlyph()
}

watch([text, selectedFont, spaceWidth, charSpacing], () => {
    generateGlyph()
})

const resizeDecorationArray = (currentArray, newWidth) => {
    return currentArray.map(row => {
        const newRow = Array(newWidth).fill().map(() => ({
            active: false,
            color: '#4ade80'
        }))
        // Copy existing data
        row.forEach((pixel, i) => {
            if (i < newWidth) {
                newRow[i] = { ...pixel }
            }
        })
        return newRow
    })
}

// Add helper function
function resizeDecorationArrayDirectional(array, newWidth, direction) {
    if (!array) return []
    const currentWidth = array[0]?.length || 0
    if (newWidth === currentWidth) return array

    return array.map(row => {
        if (newWidth > currentWidth) {
            const newCells = Array(newWidth - currentWidth).fill().map(() => ({
                active: false,
                color: '#4ade80'
            }))
            return direction === 'left'
                ? [...newCells, ...row]
                : [...row, ...newCells]
        } else {
            return direction === 'left'
                ? row.slice(currentWidth - newWidth)
                : row.slice(0, newWidth)
        }
    })
}

// Update width watcher
watch([leftWidth, middleWidth, rightWidth], ([newLeft, newMiddle, newRight]) => {
    if (mirrorLeft.value) {
        rightWidth.value = newLeft
        newRight = newLeft
    }
    if (mirrorRight.value) {
        leftWidth.value = newRight
        newLeft = newRight
    }

    leftDecoration.value = resizeDecorationArrayDirectional(
        leftDecoration.value,
        newLeft,
        adjustDirection.value
    )
    middleDecoration.value = resizeDecorationArrayDirectional(
        middleDecoration.value,
        newMiddle,
        adjustDirection.value
    )
    rightDecoration.value = resizeDecorationArrayDirectional(
        rightDecoration.value,
        newRight,
        adjustDirection.value
    )

    // Mirror logic remains unchanged
    if (mirrorLeft.value && leftDecoration.value) {
        rightDecoration.value = JSON.parse(JSON.stringify(leftDecoration.value))
            .map(row => [...row].reverse())
    }
    if (mirrorRight.value && rightDecoration.value) {
        leftDecoration.value = JSON.parse(JSON.stringify(rightDecoration.value))
            .map(row => [...row].reverse())
    }

    generateGlyph()
}, { immediate: true })

// Add functions to store/restore original states
const storeOriginalState = (side) => {
    if (side === 'left') {
        originalLeftDecoration.value = JSON.parse(JSON.stringify(leftDecoration.value))
    } else {
        originalRightDecoration.value = JSON.parse(JSON.stringify(rightDecoration.value))
    }
}

const restoreOriginalState = (side) => {
    if (side === 'left') {
        leftDecoration.value = JSON.parse(JSON.stringify(originalLeftDecoration.value))
    }
}


// Handle mirror toggles
watch(mirrorLeft, (newValue) => {
    if (newValue) {
        mirrorRight.value = false
        rightDecoration.value = leftDecoration.value.map(row => [...row].reverse())
    } else {
        // console.log('mirrorLeft changed ' + mirrorLeft.value + isLoadingStyle.value)
        rightDecoration.value = JSON.parse(JSON.stringify(leftDecoration.value)).map(row => [...row].reverse())
    }
})

watch(mirrorRight, (newValue) => {
    if (newValue) {
        mirrorLeft.value = false
        leftDecoration.value = rightDecoration.value.map(row => [...row].reverse())
    } else {
        // console.log('mirrorRight changed' + mirrorRight.value)
        leftDecoration.value = JSON.parse(JSON.stringify(rightDecoration.value)).map(row => [...row].reverse())
    }
})

watch(leftDecoration, (newValue) => {
    // console.log('leftDecoration changed' + mirrorLeft.value)
    if (mirrorLeft.value) {
        rightDecoration.value = newValue.map(row => [...row].reverse())
    }
}, { deep: true })

watch(rightDecoration, (newValue) => {
    // console.log('rightDecoration changed' + mirrorRight.value)
    if (mirrorRight.value) {
        leftDecoration.value = newValue.map(row => [...row].reverse())
    }
}, { deep: true })

onMounted(() => {
    mirrorLeft.value = true
    mirrorRight.value = false
    generateGlyph()

    const element = document.querySelector('#panzoom')
    const panzoom = Panzoom(element, {
        canvas: true
    })
    const parent = element.parentElement
    parent.addEventListener('wheel', panzoom.zoomWithWheel)
})

// Add style functions
const saveStyle = (name, author) => {
    const newStyle = {
        id: Date.now().toString(),
        name,
        author,
        patterns: {
            left: JSON.parse(JSON.stringify(leftDecoration.value)),
            middle: JSON.parse(JSON.stringify(middleDecoration.value)),
            right: JSON.parse(JSON.stringify(rightDecoration.value))
        },
        settings: {
            font: selectedFont.value,
            textColor: textColor.value,
            leftWidth: leftWidth.value,
            middleWidth: middleWidth.value,
            rightWidth: rightWidth.value,
            mirrorLeft: mirrorLeft.value,
            mirrorRight: mirrorRight.value
        }
    }

    styles.value.push(newStyle)
    styleCode.value = encodeStyle(newStyle)
}

const extractColors = (patterns) => {
    const colors = new Set()
    for (const section of Object.values(patterns)) {
        section.forEach(row => {
            row.forEach(cell => {
                if (cell.color) colors.add(cell.color)
            })
        })
    }
    return Array.from(colors)
}

const loadStyle = (style) => {
    selectedStyle.value = style.id

    selectedFont.value = style.settings.font
    textColor.value = style.settings.textColor
    leftWidth.value = style.settings.leftWidth
    middleWidth.value = style.settings.middleWidth
    rightWidth.value = style.settings.rightWidth
    mirrorLeft.value = style.settings.mirrorLeft
    mirrorRight.value = style.settings.mirrorRight
    colors.value = Array.from(new Set([...colors.value, ...extractColors(style.patterns), textColor.value]))

    nextTick(
        () => {
            leftDecoration.value = JSON.parse(JSON.stringify(style.patterns.left))
            middleDecoration.value = JSON.parse(JSON.stringify(style.patterns.middle))
            rightDecoration.value = JSON.parse(JSON.stringify(style.patterns.right))
            generateGlyph()
        }
    )
}

const copyStyleCode = async () => {
    await navigator.clipboard.writeText(styleCode.value)
}

const copyStyleEncoder = async () => {
    await navigator.clipboard.writeText(styleEncoder.value)
}

const parseToObject = str => {
    const jsonString = str
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
        .replace(/'/g, '"')

    const style = JSON.parse(jsonString)

    return style
}

const loadStyleCode = async () => {
    const code = styleCode.value.trim()
    try {
        const style = decodeStyle(code)
        console.log(style)

        middleDecoration.value = style.patterns.middle
        leftDecoration.value = style.patterns.left
        rightDecoration.value = style.patterns.right
        loadStyle(style)
        saveStyle(style.name, style.author)
    } catch (error) {
        console.error(error)
        console.error('Invalid style code')
    }
}
</script>
