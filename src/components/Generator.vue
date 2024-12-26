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
                <div class="overflow-x-auto">
                    <div class="flex gap-4 w-fit mx-auto flex-nowrap">
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
                            class="flex-1 h-24 bg-green-800 border border-green-700 rounded-lg px-4 py-2"></textarea>
                        <div class="flex flex-col gap-2 w-1/6">
                            <button @click="copyStyleCode" class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                Copy
                            </button>
                            <button @click="loadStyleCode" class="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                Load
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

<script setup>
import { ref, watch, onMounted, compile, nextTick } from 'vue'
import { fonts } from '../assets/fonts'
import { styles as defaultStyles } from '../assets/styles'
import StyleGrid from './StyleGrid.vue'
import Modal from './Modal.vue'

const showResetModal = ref(false)

const newStyleName = ref('')
const newStyleAuthor = ref('')
const selectedStyle = ref(null)
const styleCode = ref('')

const styles = ref([...defaultStyles])

const text = ref('crimson')
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
const textColor = ref('#4ade80')
const colorMode = ref('decoration')

// Add state tracking for original decorations
const originalLeftDecoration = ref(null)
const originalRightDecoration = ref(null)

// Add color constants
const colors = ref([
    // Tiro default
    '#4ade80', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b', '#0f172a', // slate
    '#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827', // gray
    '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#27272a', '#18181b', // zinc
    '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', // neutral
    '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', // stone
    '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', // red
    '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', // orange
    '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', // amber
    '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12', // yellow
    '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314', // lime
    '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', // green
    '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', // teal
    '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', // cyan
    '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', // sky
    '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', // blue
    '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', // indigo
    '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', // violet
    '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', // purple
    '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75', // fuchsia
    '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', // pink
    '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337'  // rose
])

const activeColor = ref(colors.value[0])

const addCustomColor = (color) => {
    if (!colors.value.includes(color)) {
        colors.value.push(color)
    }
    if (colorMode.value === 'text') {
        textColor.value = color
    } else {
        activeColor.value = color
    }
}

watch(textColor, () => {
    generateGlyph()
})

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
            ctx.fillStyle = textColor.value // Use text color
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

    styleCode.value = `
    {
        id: '${newStyle.id}',
        name: '${newStyle.name}',
        author: '${newStyle.author}',
        patterns: {
            left: ${JSON.stringify(newStyle.patterns.left)},
            middle: ${JSON.stringify(newStyle.patterns.middle)},
            right: ${JSON.stringify(newStyle.patterns.right)}
        },
        settings: {
            font: '${newStyle.settings.font}',
            textColor: '${newStyle.settings.textColor}',
            leftWidth: ${newStyle.settings.leftWidth},
            middleWidth: ${newStyle.settings.middleWidth},
            rightWidth: ${newStyle.settings.rightWidth},
            mirrorLeft: ${newStyle.settings.mirrorLeft},
            mirrorRight: ${newStyle.settings.mirrorRight}
        }
    }`
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

const loadStyleCode = async () => {
    const code = styleCode.value.trim()
    try {
        // Convert JavaScript object literal to valid JSON by:
        // 1. Adding quotes to property names
        // 2. Converting single quotes to double quotes
        const jsonString = code
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
            .replace(/'/g, '"')

        const style = JSON.parse(jsonString)
        console.log(style)
        loadStyle(style)
        saveStyle(style.name, style.author)
    } catch (error) {
        console.error(error)
        console.error('Invalid style code')
    }
}
</script>
