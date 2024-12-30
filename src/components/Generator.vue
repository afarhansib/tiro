<template>
    <div class="min-h-screen bg-green-900 text-white lowercase p-4">
        <div class="max-w-4xl mx-auto pt-6">
            <div class="flex items-center gap-2 mb-4">
                <label class="text-green-400">Matrix Mode</label>
                <button @click="isMatrixMode = !isMatrixMode" class="px-3 py-1 rounded-lg border border-green-700"
                    :class="isMatrixMode ? 'bg-green-600' : 'bg-green-900'">
                    {{ isMatrixMode ? 'ON' : 'OFF' }}
                </button>
            </div>
            <div class="space-y-6">
                <!-- Text Input -->
                <div class="space-y-2" v-if="!isMatrixMode">
                    <label class="text-green-400">text</label>
                    <input v-model="text" type="text"
                        class="w-full bg-green-800 border border-green-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="enter your text here">
                </div>

                <!-- Customization Options -->
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4" v-if="!isMatrixMode">
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
                <div class="relative">
                    <!-- Decoration Controls Grid -->
                    <div
                        class="overflow-x-auto border border-green-700 rounded-lg p-4 grid-bg relative z-20 bg-green-900">
                        <div class="flex gap-4 w-fit mx-auto flex-nowrap" id="panzoom">
                            <!-- Left Decoration -->
                            <div class="space-y-2 flex flex-col flex-nowrap items-center">
                                <label class="text-green-400 whitespace-nowrap text-nowrap">
                                    {{ isMatrixMode ? '' : 'Left' }}
                                </label>
                                <div class="flex flex-col lg:flex-row lg:items-center gap-2"
                                    v-if="gridStyles.showControls">
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
                                        <p class="px-1">{{ leftWidth }}</p>
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
                                <div class="flex flex-row items-center gap-2">
                                    <!-- Height controls - only show in matrix mode -->
                                    <div v-if="isMatrixMode" class="absolute right-full pr-2 flex items-center">
                                        <div class="flex items-center flex-nowrap gap-2 flex-col"
                                            v-if="gridStyles.showControls">
                                            <!-- Top side controls -->
                                            <div class="flex flex-row items-center gap-2">
                                                <button
                                                    @click="adjustHeightDirection = 'top'; canvasHeight = Math.max(1, canvasHeight - 1)"
                                                    class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                                <button
                                                    @click="adjustHeightDirection = 'top'; canvasHeight = Math.min(100, canvasHeight + 1)"
                                                    class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                            </div>
                                            <p>{{ canvasHeight }}</p>
                                            <!-- Bottom side controls -->
                                            <div class="flex flex-row items-center gap-2">
                                                <button
                                                    @click="adjustHeightDirection = 'bottom'; canvasHeight = Math.max(1, canvasHeight - 1)"
                                                    class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                                <button
                                                    @click="adjustHeightDirection = 'bottom'; canvasHeight = Math.min(100, canvasHeight + 1)"
                                                    class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="bg-green-800 p-2 rounded w-max">
                                            <div class="grid gap-1" :style="{
                                                'grid-template-columns': `repeat(${leftWidth}, minmax(0, 1fr))`,
                                                'grid-template-rows': isMatrixMode ? `repeat(${canvasHeight}, minmax(0, 1fr))` : 'repeat(10, minmax(0, 1fr))',
                                                gap: `${gridStyles.cellGap}px`
                                            }">
                                                <template v-for="y in (isMatrixMode ? canvasHeight : 10)" :key="y">
                                                    <button v-for="x in leftWidth" :key="`${x}-${y}`"
                                                        @click="togglePixel('left', x - 1, y - 1)"
                                                        class="w-6 h-6 transition-colors" :class="{
                                                            'border border-green-700': gridStyles.showBorders,
                                                            'rounded': gridStyles.roundedCells,
                                                            'bg-green-900': !leftDecoration[y - 1]?.[x - 1]?.active
                                                        }" :style="{
                                                            backgroundColor: leftDecoration[y - 1]?.[x - 1]?.active ?
                                                                leftDecoration[y - 1][x - 1].color : '',
                                                            margin: `${gridStyles.cellGap}px`
                                                        }" />
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <label class="inline-flex items-center" v-if="!isMatrixMode && gridStyles.showControls">
                                    <input type="checkbox" v-model="mirrorLeft"
                                        class="form-checkbox bg-green-800 border-green-700">
                                    <span class="ml-2 text-green-400">Mirror</span>
                                </label>
                                <!-- <button @click="rightDecoration = JSON.parse(JSON.stringify(leftDecoration)).map(row => [...row].reverse())"
                                        class="px-3 py-1 bg-green-600 rounded-lg">mirror</button> -->
                            </div>
                            <!-- Middle Pattern -->
                            <div class="space-y-2 flex flex-col items-center" v-if="!isMatrixMode">
                                <label class="text-green-400 text-nowrap whitespace-nowrap">Middle</label>
                                <div class="flex items-center gap-2" v-if="gridStyles.showControls">
                                    <div class="flex flex-col items-center gap-2">
                                        <button
                                            @click="adjustDirection = 'left'; middleWidth = Math.max(0, middleWidth - 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                        <button
                                            @click="adjustDirection = 'left'; middleWidth = Math.min(100, middleWidth + 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                    </div>
                                    <p class="px-1">{{ middleWidth }}</p>
                                    <!-- Right side controls -->
                                    <div class="flex flex-col items-center gap-2">
                                        <button
                                            @click="adjustDirection = 'right'; middleWidth = Math.max(0, middleWidth - 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                        <button
                                            @click="adjustDirection = 'right'; middleWidth = Math.min(100, middleWidth + 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                    </div>
                                </div>
                                <div class="bg-green-800 p-2 rounded w-max">
                                    <div class="grid gap-1" :style="{
                                        'grid-template-columns': `repeat(${middleWidth}, minmax(0, 1fr))`,
                                        gap: `${gridStyles.cellGap}px`
                                    }">
                                        <template v-for="y in 10" :key="y">
                                            <button v-for="x in middleWidth" :key="`${x}-${y}`"
                                                @click="togglePixel('middle', x - 1, y - 1)"
                                                class="w-6 h-6 transition-colors" :class="{
                                                    'border border-green-700': gridStyles.showBorders,
                                                    'rounded': gridStyles.roundedCells,
                                                    'bg-green-900': !middleDecoration[y - 1]?.[x - 1]?.active
                                                }" :style="{
                                                    backgroundColor: middleDecoration[y - 1]?.[x - 1]?.active ?
                                                        middleDecoration[y - 1][x - 1].color : '',
                                                    margin: `${gridStyles.cellGap}px`
                                                }" />
                                        </template>
                                    </div>
                                </div>
                                <button v-if="gridStyles.showControls" @click="showResetModal = true"
                                    class="px-3 py-1 bg-green-600 rounded-lg hover:bg-green-500">
                                    reset
                                </button>
                            </div>
                            <!-- Right Decoration -->
                            <div class="space-y-2 flex flex-col items-center" v-if="!isMatrixMode">
                                <label class="text-green-400 text-nowrap whitespace-nowrap">Right</label>
                                <div class="flex flex-row flex-nowrap lg:items-center gap-2"
                                    v-if="gridStyles.showControls">
                                    <div class="flex flex-col items-center gap-2">
                                        <button
                                            @click="adjustDirection = 'left'; rightWidth = Math.max(-1, rightWidth - 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">-</button>
                                        <button
                                            @click="adjustDirection = 'left'; rightWidth = Math.min(100, rightWidth + 1)"
                                            class="px-3 py-1 bg-green-600 rounded-lg">+</button>
                                    </div>
                                    <p class="px-1">{{ rightWidth }}</p>
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
                                    <div class="grid gap-1" :style="{
                                        'grid-template-columns': `repeat(${rightWidth}, minmax(0, 1fr))`,
                                        gap: `${gridStyles.cellGap}px`
                                    }">
                                        <template v-for="y in 10" :key="y">
                                            <button v-for="x in rightWidth" :key="`${x}-${y}`"
                                                @click="togglePixel('right', x - 1, y - 1)"
                                                class="w-6 h-6 transition-colors" :class="{
                                                    'border border-green-700': gridStyles.showBorders,
                                                    'rounded': gridStyles.roundedCells,
                                                    'bg-green-900': !rightDecoration[y - 1]?.[x - 1]?.active
                                                }" :style="{
                                                    backgroundColor: rightDecoration[y - 1]?.[x - 1]?.active ?
                                                        rightDecoration[y - 1][x - 1].color : '',
                                                    margin: `${gridStyles.cellGap}px`
                                                }" />
                                        </template>
                                    </div>
                                </div>
                                <label class="inline-flex items-center" v-if="gridStyles.showControls">
                                    <input type="checkbox" v-model="mirrorRight"
                                        class="form-checkbox bg-green-800 border-green-700">
                                    <span class="ml-2 text-green-400">Mirror</span>
                                </label>
                                <!-- <button @click="leftDecoration = JSON.parse(JSON.stringify(rightDecoration)).map(row => [...row].reverse())"
                                class="px-3 py-1 bg-green-600 rounded-lg">mirror</button> -->
                            </div>
                        </div>
                    </div>
                    <!-- Grid Style Controls -->
                    <div
                        class="flex flex-col p-4 sm:flex-row sm:p-2 pt-6 sm:pt-6 gap-4 justify-center text-green-400 bg-green-800 rounded-lg relative -top-4 z-10 select-none">
                        <label class="inline-flex items-center">
                            <input type="checkbox" v-model="gridStyles.showControls"
                                class="form-checkbox bg-green-800 border-green-700">
                            <span class="ml-2">show controls</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input type="checkbox" v-model="gridStyles.roundedCells"
                                class="form-checkbox bg-green-800 border-green-700">
                            <span class="ml-2">Rounded Cells</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input type="checkbox" v-model="gridStyles.showBorders"
                                class="form-checkbox bg-green-800 border-green-700">
                            <span class="ml-2">Cell Borders</span>
                        </label>
                        <div class="flex items-center gap-2">
                            <span>Gap:</span>
                            <div class="flex gap-1">
                                <button v-for="(size, label) in { 'none': 0, 's': 1, 'm': 2, 'l': 4 }" :key="label"
                                    @click="gridStyles.cellGap = size"
                                    class="px-2 py-1 border rounded transition-colors" :class="gridStyles.cellGap === size
                                        ? 'bg-green-600 border-green-500'
                                        : 'bg-green-800 border-green-700 hover:bg-green-700'">
                                    {{ label }}
                                </button>
                            </div>
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
                        class="flex-1 px-4 py-2 bg-green-800 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        download 1:1
                    </button>
                    <button @click="downloadPreview" :disabled="!canDownload"
                        class="flex-1 px-4 py-2 bg-green-800 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        download preview
                    </button>
                </div>

                <div class="space-y-2">
                    <label class="text-green-400">Styles</label>
                    <StyleGrid :text="text" :styles="styles" :selectedStyle="selectedStyle" @select="loadStyle" />

                    <div class="flex flex-col md:flex-row w-full gap-2 pt-6">
                        <input v-model="newStyleName" placeholder="name"
                            class="bg-green-800 border flex-1 border-green-700 rounded-lg px-4 py-2 placeholder-green-700">
                        <input v-model="newStyleAuthor" placeholder="author"
                            class="bg-green-800 border flex-1 border-green-700 rounded-lg px-4 py-2 placeholder-green-700">
                        <button @click="saveStyle(newStyleName, newStyleAuthor)"
                            class="px-4 py-2 bg-green-600 rounded-lg w-full md:w-1/5">
                            save style
                        </button>
                    </div>
                </div>
                <button v-if="styleCode" @click="submitStyle" class="px-4 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-lg w-full 
       transform hover:scale-105 transition-all duration-200 
       border-2 border-yellow-400/30 
       flex items-center justify-center gap-2 
       animate-pulse hover:animate-none
       shadow-lg hover:shadow-yellow-600/50">
                    <span class="text-lg font-medium">share your masterpiece!</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 animate-bounce" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </button>

                <div class="space-y-2">
                    <label class="text-green-400">Style Code</label>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <textarea v-model="styleCode"
                            class="flex-1 bg-green-800 border border-green-700 rounded-lg px-4 py-2"></textarea>
                        <div class="flex flex-row sm:flex-col w-full sm:w-1/5 gap-2">
                            <button @click="copyStyleCode"
                                class="px-4 py-2 flex-1 bg-green-600 rounded-lg hover:bg-green-500">
                                copy
                            </button>
                            <button @click="loadStyleCode"
                                class="px-4 py-2 flex-1 bg-green-600 rounded-lg hover:bg-green-500">
                                load
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-green-400">Style Encoder</label>
                    <div class="flex  flex-col sm:flex-row  gap-2">
                        <textarea v-model="styleEncoder"
                            class="flex-1 bg-green-800 border border-green-700 rounded-lg px-4 py-2"></textarea>
                        <div class="flex flex-row sm:flex-col gap-2 w-full sm:w-1/5">
                            <button @click="styleEncoder = encodeStyle(parseToObject(styleEncoder))"
                                class="flex-1 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                encode
                            </button>
                            <button @click="styleEncoder = JSON.stringify(decodeStyle(styleEncoder), null, 2)"
                                class="flex-1 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                decode
                            </button>
                            <button @click="copyStyleEncoder"
                                class="flex-1 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-500">
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-6 text-center text-sm text-green-600">
            <button @click="showClearModal = true">clear local storage</button>
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

    <Modal :show="showClearModal" @close="showClearModal = false">
        <div class="space-y-4">
            <div class="text-green-400 font-medium">clear local storage</div>
            <div class="text-green-500">are you sure? this will delete all saved state including your local styles. make sure you have copied somewhere.</div>
            <div class="flex justify-end gap-3">
                <button @click="showClearModal = false"
                    class="px-4 py-2 text-green-400 hover:bg-green-800/50 rounded-lg">
                    cancel
                </button>
                <button @click="clearSavedState" class="px-4 py-2 bg-red-900 text-red-400 hover:bg-red-800 rounded-lg">
                    clear
                </button>
            </div>
        </div>
    </Modal>

    <!-- Confirmation Modal -->
    <!-- Use your existing Modal component -->
    <Modal :show="showSubmitModal" @close="showSubmitModal = false">
        <div class="space-y-4">
            <div class="text-green-400 font-medium">Submit Style</div>
            <div class="text-green-500">
                by submitting this style, you agree to:
                <ul class="list-disc pl-5 mt-2 space-y-1">
                    <li>share your style publicly</li>
                    <li>respect community guidelines</li>
                </ul>
            </div>
            <div class="flex justify-end gap-3">
                <button @click="showSubmitModal = false"
                    class="px-4 py-2 text-green-400 hover:bg-green-800/50 rounded-lg">
                    cancel
                </button>
                <button @click="confirmSubmit" :disabled="isSubmitting"
                    class="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-500 rounded-lg">
                    {{ isSubmitting ? 'Submitting...' : 'confirm submit' }}
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
import { useToast } from '../composables/useToast'
import { encodeStyle, decodeStyle } from '../utils/style-encoder'
import Panzoom from '@panzoom/panzoom'

const submitStyle = async () => {
    showSubmitModal.value = true  // This opens the modal
}

const toast = useToast()

const confirmSubmit = async () => {
    try {
        isSubmitting.value = true
        let verifyStyle
        try {
            verifyStyle = decodeStyle(styleCode.value)
        } catch (error) {
            throw new Error('invalid style code.')
        }
        await submitStyleToServer(styleCode.value)
        showSubmitModal.value = false
        // Optional: Show success message or refresh styles
        toast.success('style submitted successfully! ✨')
    } catch (error) {
        console.error('error submitting style:', error)
        showSubmitModal.value = false
        toast.error('failed to share style. ' + error.message)
    } finally {
        isSubmitting.value = false
    }
}
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

// Initialize decoration data with proper structure
const initDecorationData = (width) => {
    return Array(10).fill().map(() =>
        Array(width).fill().map(() => ({
            active: false,
            color: '#4ade80'
        }))
    )
}

const showSubmitModal = ref(false)
const isSubmitting = ref(false)
const showResetModal = ref(false)
const showClearModal = ref(false)
const newStyleName = ref('')
const newStyleAuthor = ref('')
const selectedStyle = ref(null)
const styleCode = ref('')
const styleEncoder = ref('')
const styles = ref(encodedStyles.map(encodedStyle => decodeStyle(encodedStyle)))
const text = ref(getDefaultText())
const canvas = ref(null)
const fontNames = Object.keys(fonts)
const selectedFont = ref('cype')
const canDownload = ref(false)
const spaceWidth = ref(3)
const charSpacing = ref(1)
const realWidth = ref(0)
const realHeight = ref(10)
const leftWidth = ref(3)
const middleWidth = ref(1)
const rightWidth = ref(3)
const gridStyles = ref({
    roundedCells: true,
    showBorders: true,
    cellGap: 2,
    showControls: true
})
const isGradient = ref(false)
const gradientDirection = ref('to bottom')
const gradientColors = ref(['#ff8c00', '#ff0080'])
const isMatrixMode = ref(false)
const canvasHeight = ref(10)
const leftDecoration = ref(initDecorationData(leftWidth.value))
const middleDecoration = ref(initDecorationData(middleWidth.value))
const rightDecoration = ref(initDecorationData(rightWidth.value))
const mirrorLeft = ref(false)
const mirrorRight = ref(false)
const adjustDirection = ref('right')
const adjustHeightDirection = ref('top')
const textColor = ref('gradient/to bottom/#ff8c00/#ff0080')
const colorMode = ref('decoration')
const colors = ref([
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

const STATE_KEY = 'tiroEditorState'

// Function to save state to localStorage
const saveToLocalStorage = () => {
    try {
        const state = {
            showSubmitModal: showSubmitModal.value,
            isSubmitting: isSubmitting.value,
            showResetModal: showResetModal.value,
            showClearModal: showClearModal.value,
            newStyleName: newStyleName.value,
            newStyleAuthor: newStyleAuthor.value,
            selectedStyle: selectedStyle.value,
            styleCode: styleCode.value,
            styleEncoder: styleEncoder.value,
            styles: styles.value,
            text: text.value,
            selectedFont: selectedFont.value,
            canDownload: canDownload.value,
            spaceWidth: spaceWidth.value,
            charSpacing: charSpacing.value,
            realWidth: realWidth.value,
            realHeight: realHeight.value,
            leftWidth: leftWidth.value,
            middleWidth: middleWidth.value,
            rightWidth: rightWidth.value,
            gridStyles: gridStyles.value,
            isGradient: isGradient.value,
            gradientDirection: gradientDirection.value,
            gradientColors: gradientColors.value,
            isMatrixMode: isMatrixMode.value,
            canvasHeight: canvasHeight.value,
            leftDecoration: leftDecoration.value,
            middleDecoration: middleDecoration.value,
            rightDecoration: rightDecoration.value,
            mirrorLeft: mirrorLeft.value,
            mirrorRight: mirrorRight.value,
            adjustDirection: adjustDirection.value,
            adjustHeightDirection: adjustHeightDirection.value,
            textColor: textColor.value,
            colorMode: colorMode.value,
            colors: colors.value,
            activeColor: activeColor.value
        }

        localStorage.setItem(STATE_KEY, JSON.stringify(state))
    } catch (error) {
        console.error('Failed to save editor state:', error)
    }
}

// Function to load state from localStorage
const loadFromLocalStorage = () => {
    try {
        const savedState = localStorage.getItem(STATE_KEY)
        if (savedState) {
            const state = JSON.parse(savedState)

            // Restore all values
            showSubmitModal.value = state.showSubmitModal
            isSubmitting.value = state.isSubmitting
            showResetModal.value = state.showResetModal
            showClearModal.value = state.showClearModal
            newStyleName.value = state.newStyleName
            newStyleAuthor.value = state.newStyleAuthor
            selectedStyle.value = state.selectedStyle
            styleCode.value = state.styleCode
            styleEncoder.value = state.styleEncoder
            styles.value = state.styles
            text.value = state.text
            selectedFont.value = state.selectedFont
            canDownload.value = state.canDownload
            spaceWidth.value = state.spaceWidth
            charSpacing.value = state.charSpacing
            realWidth.value = state.realWidth
            realHeight.value = state.realHeight
            leftWidth.value = state.leftWidth
            middleWidth.value = state.middleWidth
            rightWidth.value = state.rightWidth
            gridStyles.value = state.gridStyles
            isGradient.value = state.isGradient
            gradientDirection.value = state.gradientDirection
            gradientColors.value = state.gradientColors
            isMatrixMode.value = state.isMatrixMode
            canvasHeight.value = state.canvasHeight
            leftDecoration.value = state.leftDecoration
            middleDecoration.value = state.middleDecoration
            rightDecoration.value = state.rightDecoration
            mirrorLeft.value = state.mirrorLeft
            mirrorRight.value = state.mirrorRight
            adjustDirection.value = state.adjustDirection
            adjustHeightDirection.value = state.adjustHeightDirection
            textColor.value = state.textColor
            colorMode.value = state.colorMode
            colors.value = state.colors
            activeColor.value = state.activeColor
        }
    } catch (error) {
        console.error('Failed to load saved state:', error)
    }
}

// Load saved state when component mounts
onMounted(() => {
    loadFromLocalStorage()
})

// Optional: Add a function to clear saved state
const clearSavedState = () => {
    try {
        localStorage.removeItem(STATE_KEY)
        window.location.reload()
    } catch (error) {
        console.error('Failed to clear saved state:', error)
    }
}

// Watch for changes and save to localStorage
watch(
    [
        showSubmitModal, isSubmitting, showResetModal,
        newStyleName, newStyleAuthor, selectedStyle,
        styleCode, styleEncoder, styles, text,
        selectedFont, canDownload, spaceWidth,
        charSpacing, realWidth, realHeight,
        leftWidth, middleWidth, rightWidth,
        gridStyles, isGradient, gradientDirection,
        gradientColors, isMatrixMode, canvasHeight,
        leftDecoration, middleDecoration, rightDecoration,
        mirrorLeft, mirrorRight, adjustDirection,
        adjustHeightDirection, textColor, colorMode,
        colors, activeColor
    ],
    () => {
        saveToLocalStorage()
    },
    { deep: true }
)


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
    if (!canvas.value) return

    if (!text.value) return
    const ctx = canvas.value.getContext('2d')

    if (isMatrixMode.value) {
        // Matrix mode - only render left decoration as a canvas
        canvas.value.width = leftWidth.value
        canvas.value.height = canvasHeight.value
        realWidth.value = leftWidth.value
        realHeight.value = canvasHeight.value

        ctx.clearRect(0, 0, leftWidth.value, canvasHeight.value)

        // Draw left decoration only
        leftDecoration.value.forEach((row, y) => {
            row.forEach((pixel, x) => {
                if (pixel.active) {
                    ctx.fillStyle = pixel.color
                    ctx.fillRect(x, y, 1, 1)
                }
            })
        })
        return
    }

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
        // console.log(middleWidth.value)
        if (middleWidth.value === 0) break
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
    // console.log('textColor:', textColor.value)
    // console.log(isGradient.value)
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

                case 'radial':
                    // Creates a radial gradient from center
                    const centerX = textStartX + (textWidth / 2)
                    const centerY = 5 // Assuming height is 10
                    const radius = Math.max(textWidth, 10) / 2
                    gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
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

// Add helper function
const resizeDecorationArrayDirectional = (array, newSize, direction, isHeight = false) => {
    if (!array) return array

    if (isHeight) {
        // Handle height resizing
        const currentHeight = array.length
        const diff = newSize - currentHeight

        if (diff === 0) return array

        const newArray = [...array]

        if (diff > 0) {
            // Adding rows
            const newRows = Array(diff).fill().map(() =>
                Array(array[0].length).fill().map(() => ({
                    active: false,
                    color: '#4ade80'
                }))
            )

            return direction === 'top'
                ? [...newRows, ...newArray]
                : [...newArray, ...newRows]
        } else {
            // Removing rows
            return direction === 'top'
                ? newArray.slice(-newSize)
                : newArray.slice(0, newSize)
        }
    } else {
        // Existing width resize logic
        const currentWidth = array[0].length
        const diff = newSize - currentWidth

        if (diff === 0) return array

        return array.map(row => {
            if (diff > 0) {
                const newCells = Array(diff).fill().map(() => ({
                    active: false,
                    color: '#4ade80'
                }))
                return direction === 'left'
                    ? [...newCells, ...row]
                    : [...row, ...newCells]
            } else {
                return direction === 'left'
                    ? row.slice(-newSize)
                    : row.slice(0, newSize)
            }
        })
    }
}

// Update width watcher
watch([leftWidth, middleWidth, rightWidth], ([newLeft, newMiddle, newRight]) => {
    // console.log(newMiddle)
    // return
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

    fetchStyles()
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
        },
        verified: false,
        isLocal: true
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
    leftWidth.value = style.settings.leftWidth
    middleWidth.value = style.settings.middleWidth
    rightWidth.value = style.settings.rightWidth
    mirrorLeft.value = style.settings.mirrorLeft
    mirrorRight.value = style.settings.mirrorRight

    // Parse gradient if textColor is a gradient string
    if (style.settings.textColor.startsWith('gradient')) {
        const [_, direction, ...colors] = style.settings.textColor.split('/')
        gradientDirection.value = direction
        gradientColors.value = colors
        textColor.value = style.settings.textColor
    } else {
        textColor.value = style.settings.textColor
        isGradient.value = false
        // Optionally reset gradient values to defaults
        gradientDirection.value = 'to bottom'
        gradientColors.value = ['#ff8c00', '#ff0080']
    }

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

// Add height watcher
watch(canvasHeight, (newHeight) => {
    if (!isMatrixMode.value) return

    leftDecoration.value = resizeDecorationArrayDirectional(
        leftDecoration.value,
        newHeight,
        adjustHeightDirection.value,
        true // isHeight flag to handle vertical resizing
    )

    generateGlyph()
}, { immediate: true })

watch(isMatrixMode, (newValue, oldValue) => {
    if (!oldValue && newValue) {  // When switching TO matrix mode
        // Check if leftDecoration has any active cells
        const hasActiveCell = leftDecoration.value?.some(row =>
            row.some(cell => cell.active)
        )

        // If no active cells, set to a more suitable matrix width
        if (!hasActiveCell) {
            leftWidth.value = 10  // or whatever default matrix width you prefer
        }
    }
    generateGlyph()
})

// Add these functions to your component
const apiUrl = 'https://tiro.yotbu.my.id/styles.php'  // Update with your actual URL

// Check if decodeStyle is working correctly
// Add API styles
const fetchStyles = async () => {
    try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        if (data.styles) {
            // console.log(data.styles)
            // Get set of existing IDs
            const existingIds = new Set(styles.value.map(style => style.id))

            // Filter and decode new unique styles
            const apiStyles = data.styles
                .map(style => decodeStyle(style))
                .filter(style => !existingIds.has(style.id))

            // Append only unique styles
            if (apiStyles.length > 0) {
                styles.value = [...styles.value, ...apiStyles]
            }
        }
    } catch (error) {
        console.error('Error fetching styles:', error)
    }
}

// Function to save style to API
const submitStyleToServer = async (styleString) => {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: styleString
        })
        const data = await response.json()
        if (data.success) {
            // Refresh styles after successful save
            await fetchStyles()
        }
    } catch (error) {
        console.error('Error saving style:', error)
        // You might want to add error handling UI here
    }
}

</script>
