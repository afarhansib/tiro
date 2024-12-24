<template>
    <div class="min-h-screen bg-green-900 text-white" @paste="handlePaste" tabindex="0">
        <div class="container mx-auto p-4 space-y-6">
            <h1 class="text-2xl font-bold text-green-400">Font Builder</h1>
            <div class="flex flex-col md:flex-row gap-6">
                <div class="space-y-2 w-1/2">
                    <label class="text-green-400">Upload Font Sheet</label>
                    <div class="flex items-center space-x-4">
                        <button @click="triggerFileInput"
                            class="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-600">
                            Choose File
                        </button>
                        <input type="file" accept="image/*" @change="handleFileSelect" ref="fileInput" class="hidden">
                        <span v-if="fontSheetName">{{ fontSheetName }}</span>
                    </div>
                    <div v-if="fontSheet" class="mt-4">
                        <img :src="fontSheet.src" alt="Font Sheet Preview"
                            class="max-w-full h-auto border border-green-700 rounded-lg">
                    </div>
                    <!-- Add before closing div -->
                    <div v-if="characters.length" class="mt-4 py-6">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-green-400 text-xl">Font Object</h2>
                            <button @click="copyToClipboard"
                                class="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                Copy
                            </button>
                        </div>
                        <div class="relative">
                            <textarea v-model="editableFontObject"
                                class="w-full h-96 bg-green-800 p-4 border border-green-700 rounded-lg overflow-auto text-sm font-mono text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                                spellcheck="false"></textarea>
                            <button @click="updateFromEdited"
                                class="absolute top-2 right-2 bg-green-700 hover:bg-green-600 text-white font-bold py-1 px-2 rounded text-sm">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div v-if="characters.length" class="space-y-2">
                        <label class="text-green-400">Test Font</label>
                        <input v-model="testText" type="text"
                            class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                            placeholder="Enter text to test the font">
                        <div class="bg-green-800 p-4 rounded-lg">
                            <canvas id="testCanvas" ref="testCanvas"
                                class="w-full [image-rendering:pixelated] border border-green-700"></canvas>
                        </div>
                    </div>
                    <div v-if="characters.length" class="space-y-2 py-6">
                        <label class="text-green-400">Scanned Characters</label>
                        <div class="grid grid-cols-[repeat(13,_minmax(0,_1fr))] gap-4">
                            <div v-for="char in characters" :key="char.char"
                                class="bg-green-800 p-2 rounded-lg text-center">
                                <img :src="char.dataUrl" :alt="char.char" class="mx-auto mb-2">
                                <span class="text-green-400">{{ char.char }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="space-y-8 p-6 bg-green-900/50 rounded-xl">
                <!-- Getting Started Section -->
                <div class="text-center space-y-4">
                    <h2 class="text-2xl font-bold text-green-400">Get Started with Tiro Font Sheets</h2>
                    <p class="text-lg text-green-400/80">Upload a Tiro font sheet to begin creating your custom font</p>
                </div>

                <!-- Template Section -->
                <div class="space-y-4">
                    <h3 class="text-xl text-green-400">1. Download Template</h3>
                    <div class="bg-green-800/30 p-4 rounded-lg">
                        <img src="/font-sheets/template.png" alt="Tiro Font Sheet Template"
                            class="w-full max-w-2xl mx-auto rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
                           >
                        <a href="./font-sheets/template.png"
                            class="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors">
                            Download Template
                    </a>
                    </div>
                </div>

                <!-- Figma Section -->
                <div class="space-y-4">
                    <h3 class="text-xl text-green-400">2. Edit in Figma</h3>
                    <div class="bg-green-800/30 p-4 rounded-lg">
                        <div>
                            <iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="100%" height="450"
                                src="https://embed.figma.com/design/DkGvLHXlEF9aaZsGFMsLPm/Tiro-Font-Sheets-Template?node-id=0-1&embed-host=share"
                                allowfullscreen></iframe>
                        </div>

                        <a href="https://www.figma.com/design/DkGvLHXlEF9aaZsGFMsLPm/Tiro-Font-Sheets-Template?node-id=0-1&t=XuRgNcPRDbedLXLY-1"
                            class="inline-block mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium transition-colors">
                            Open in Figma
                        </a>
                    </div>
                </div>

                <!-- Example Section -->
                <div class="space-y-4">
                    <h3 class="text-xl text-green-400">3. See Example</h3>
                    <div class="bg-green-800/30 p-4 rounded-lg">
                        <img src="/font-sheets/mono.png" alt="Example of completed font sheet"
                            class="w-full max-w-2xl mx-auto rounded-lg shadow-lg">
                        <p class="mt-4 text-green-400/80 text-sm">
                            Example of a completed Tiro font sheet using the mono font style
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const fontSheet = ref(null)
const fontSheetName = ref('')
const characters = ref([])
const testText = ref('')

const editableFontObject = ref('')

const triggerFileInput = () => {
    document.querySelector('input[type="file"]').click()
}

const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        fontSheetName.value = file.name
        const reader = new FileReader()
        reader.onload = (e) => {
            fontSheet.value = new Image()
            fontSheet.value.onload = scanFontSheet
            fontSheet.value.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const updateFromEdited = () => {
    try {
        const parsed = JSON.parse(editableFontObject.value)
        if (parsed.characters && Array.isArray(parsed.characters)) {
            characters.value = parsed.characters.map(char => ({
                ...char,
                dataUrl: generateDataUrl(char.matrix) // We'll implement this helper
            }))
            renderTestText() // Re-render the test canvas
        }
    } catch (err) {
        alert('Invalid JSON format')
    }
}

// Add this helper function to generate dataUrl from matrix
const generateDataUrl = (matrix) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const pixelSize = 10
    const charWidth = matrix[0].length * pixelSize
    const charHeight = 10 * pixelSize

    canvas.width = charWidth
    canvas.height = charHeight

    // Draw matrix
    matrix.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell === 1) {
                ctx.fillStyle = '#4ade80'
                ctx.fillRect(
                    colIndex * pixelSize,
                    rowIndex * pixelSize,
                    pixelSize,
                    pixelSize
                )
            }
        })
    })

    return canvas.toDataURL()
}

const scanFontSheet = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = fontSheet.value.width
    canvas.height = fontSheet.value.height
    ctx.drawImage(fontSheet.value, 0, 0)

    const scale = 16
    const gridHeight = 10
    const charHeight = gridHeight * scale
    const cols = 13
    const rows = 5
    const charactersList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const brightnessThreshold = 128

    characters.value = []
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const charIndex = y * cols + x
            if (charIndex >= charactersList.length) break

            const fullCharWidth = 16 * scale
            const charCanvas = document.createElement('canvas')
            charCanvas.width = fullCharWidth
            charCanvas.height = charHeight
            const charCtx = charCanvas.getContext('2d')
            charCtx.drawImage(
                fontSheet.value,
                x * (fullCharWidth + 10) + 126,
                y * (charHeight + 106) + 437,
                fullCharWidth,
                charHeight,
                0,
                0,
                fullCharWidth,
                charHeight
            )

            // Find character bounds
            const charData = charCtx.getImageData(0, 0, fullCharWidth, charHeight).data
            let leftEdge = fullCharWidth
            let rightEdge = 0

            // Find actual character edges
            for (let i = 0; i < fullCharWidth; i++) {
                for (let j = 0; j < charHeight; j++) {
                    const index = (j * fullCharWidth + i) * 4
                    const r = charData[index]
                    const g = charData[index + 1]
                    const b = charData[index + 2]
                    const brightness = (r + g + b) / 3

                    if (brightness < brightnessThreshold) {
                        leftEdge = Math.min(leftEdge, i)
                        rightEdge = Math.max(rightEdge, i)
                    }
                }
            }

            // Add padding
            leftEdge = Math.max(0, leftEdge - scale)
            rightEdge = Math.min(fullCharWidth - 1, rightEdge + scale)

            // Create matrix with actual width
            const matrix = []
            for (let gridY = 0; gridY < gridHeight; gridY++) {
                const row = []
                // Only scan columns within character bounds
                for (let gridX = 0; gridX < Math.floor((rightEdge - leftEdge) / scale); gridX++) {
                    // console.log(gridX)
                    const middleX = leftEdge + (gridX * scale) + Math.floor(scale / 2)
                    const middleY = (gridY * scale) + Math.floor(scale / 2)
                    const index = (middleY * fullCharWidth + middleX) * 4

                    const r = charData[index]
                    const g = charData[index + 1]
                    const b = charData[index + 2]
                    const brightness = (r + g + b) / 3

                    row.push(brightness > brightnessThreshold ? 0 : 1)
                }
                matrix.push(row)
            }

            characters.value.push({
                char: charactersList[charIndex],
                matrix: matrix
            })
        }
    }

    // After scanning all characters, copy matrices between cases
    const originalChars = [...characters.value]

    originalChars.forEach(sourceChar => {
        const char = sourceChar.char
        // Skip if char is same in both cases (numbers, symbols)
        if (char.toUpperCase() === char.toLowerCase()) return

        const oppositeChar = char === char.toUpperCase() ?
            char.toLowerCase() : char.toUpperCase()

        const oppositeCharData = characters.value.find(c => c.char === oppositeChar)
        const hasValidMatrix = sourceChar.matrix?.length === 10 &&
            sourceChar.matrix[0]?.length > 0

        // Copy if opposite char missing or has empty matrix
        if (hasValidMatrix &&
            (!oppositeCharData || oppositeCharData.matrix[0].length === 0)) {

            if (oppositeCharData) {
                // Update existing character
                oppositeCharData.matrix = JSON.parse(JSON.stringify(sourceChar.matrix))
            } else {
                // Add new character
                characters.value.push({
                    char: oppositeChar,
                    matrix: JSON.parse(JSON.stringify(sourceChar.matrix))
                })
            }
        }
    })

    renderPreview()
}
// console.log(JSON.stringify(characters.value, null, 2))

const renderPreview = () => {
    characters.value.forEach((charData, index) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const pixelSize = 10
        const charWidth = charData.matrix[0].length * pixelSize
        const charHeight = 10 * pixelSize

        canvas.width = charWidth
        canvas.height = charHeight + 20 // Extra space for label

        // Draw matrix
        charData.matrix.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell === 1) {
                    ctx.fillStyle = '#4ade80'
                    ctx.fillRect(
                        colIndex * pixelSize,
                        rowIndex * pixelSize,
                        pixelSize,
                        pixelSize
                    )
                }
            })
        })

        charData.dataUrl = canvas.toDataURL()
    })
}

const renderTestText = () => {
    const canvas = document.querySelector('canvas#testCanvas')
    const ctx = canvas.getContext('2d')
    const scale = 16
    const charHeight = 10 * scale
    const spacing = 4 // Pixels between characters
    const spaceWidth = 3 * scale // Width for space character

    // Calculate total width needed with spacing
    const totalWidth = testText.value.split('').reduce((width, char) => {
        if (char === ' ') return width + spaceWidth + spacing
        const charData = characters.value.find(c => c.char === char)
        return width + (charData ? (charData.matrix[0].length * scale + spacing) : 0)
    }, 0)

    canvas.width = Math.max(0, totalWidth - spacing)
    canvas.height = charHeight
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let currentX = 0
    for (let i = 0; i < testText.value.length; i++) {
        const char = testText.value[i]
        if (char === ' ') {
            currentX += spaceWidth + spacing
            continue
        }
        const charData = characters.value.find(c => c.char === char)
        if (charData) {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            const charWidth = charData.matrix[0].length * scale
            tempCanvas.width = charWidth
            tempCanvas.height = charHeight

            charData.matrix.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell === 1) {
                        tempCtx.fillStyle = '#4ade80'
                        tempCtx.fillRect(
                            colIndex * scale,
                            rowIndex * scale,
                            scale,
                            scale
                        )
                    }
                })
            })

            ctx.drawImage(tempCanvas, currentX, 0)
            currentX += charWidth + spacing
        }
    }
}

watch(testText, renderTestText)

const formattedFontObject = computed(() => {
    if (!characters.value.length) return ''
    const fontName = fontSheetName.value || 'CustomFont'

    const fontObject = {
        [fontName]: {
            characters: characters.value.map(char => ({
                char: char.char,
                matrix: char.matrix
            }))
        }
    }

    return JSON.stringify(fontObject, null, 2)
})


watch(() => formattedFontObject.value, (newVal) => {
    editableFontObject.value = newVal
}, { immediate: true })


const copyToClipboard = () => {
    const fontName = fontSheetName.value || 'CustomFont'
    const fontObject = {
        [fontName]: {
            characters: characters.value.map(char => ({
                char: char.char,
                matrix: char.matrix
            }))
        }
    }

    navigator.clipboard.writeText(JSON.stringify(fontObject, null, 2))
        .then(() => alert('Copied to clipboard!'))
        .catch(err => alert('Failed to copy'))
}
</script>