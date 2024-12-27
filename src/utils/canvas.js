import { styles } from "../assets/styles"
import { fonts } from "../assets/fonts"
import { decodeStyle } from "./style-encoder"

export const drawGlyph = (options) => {
    // Your existing style and font setup code remains the same
    const encodedStyle = options.style
        ? styles.find(s => {
            const normalize = str => str?.toLowerCase().replace(/[\s\-_]/g, '')
            return normalize(s.name) === normalize(options.style)
        })
        : null || styles[Math.floor(Math.random() * styles.length)]

    const style = decodeStyle(encodedStyle)
    const normalize = str => str?.toLowerCase().replace(/[\s\-_]/g, '')
    const fontName = options.font || style.settings.font
    const font = Object.entries(fonts).find(([name]) => normalize(name) === normalize(fontName))?.[1]
    // console.log(font)

    // Your existing options destructuring
    const {
        text = 'Yotbu',
        textColor = style.settings.textColor,
        patterns = style.patterns,
        leftWidth = style.settings.leftWidth,
        middleWidth = style.settings.middleWidth,
        rightWidth = style.settings.rightWidth,
        charSpacing = 1,
        spaceWidth = 3
    } = options

    // Calculate dimensions (your existing code)
    const chars = text.split('')
    const textWidth = chars.reduce((width, char, index) => {
        const isLast = index === chars.length - 1
        if (char === ' ') return width + spaceWidth
        const charData = font.characters.find(c => c.char === char)
        return width + (charData ? charData.matrix[0].length + (isLast ? 0 : charSpacing) : 1)
    }, 0)

    const finalWidth = textWidth + leftWidth + rightWidth
    const height = 10

    // Start SVG with proper scaling
    let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${finalWidth} ${height}" 
    preserveAspectRatio="xMidYMid meet" 
    shape-rendering="crispEdges" 
    xmlns="http://www.w3.org/2000/svg">`


    let textFill = textColor
    if (textColor.startsWith('gradient')) {
        const [_, direction, ...colors] = textColor.split('/')
        const gradientId = `textGradient_${Math.round(Math.random() * 1000000)}`
        // console.log(gradientId)
        textFill = `url(#${gradientId})`

        svgContent += '<defs>'
        if (direction === 'radial') {
            svgContent += createRadialGradient(gradientId, colors, {
                x: leftWidth,
                width: textWidth
            })
        } else {
            svgContent += createLinearGradient(gradientId, direction, colors, {
                x: leftWidth,
                width: textWidth
            })
        }
        svgContent += '</defs>'
    }

    // Draw patterns first
    let x = leftWidth
    while (x < leftWidth + textWidth) {
        patterns.middle.forEach((row, y) => {
            row.forEach((pixel, px) => {
                if (pixel.active) {
                    svgContent += `<rect x="${x + (px % middleWidth)}" y="${y}" width="1" height="1" fill="${pixel.color}"/>`
                }
            })
        })
        x += middleWidth
    }

    // Group all text pixels together
    svgContent += `<g fill="${textFill}">`
    let currentX = leftWidth
    chars.forEach((char, index) => {
        const isLast = index === chars.length - 1
        if (char === ' ') {
            currentX += spaceWidth
            return
        }
        const charData = font.characters.find(c => c.char === char)
        if (charData) {
            charData.matrix.forEach((row, y) => {
                row.forEach((pixel, x) => {
                    if (pixel) {
                        svgContent += `<rect x="${currentX + x}" y="${y}" width="1" height="1"/>`
                    }
                })
            })
            currentX += charData.matrix[0].length + (isLast ? 0 : charSpacing)
        }
    })
    svgContent += '</g>'

    // Draw decorations
    patterns.left.forEach((row, y) => {
        row.forEach((pixel, x) => {
            if (pixel.active) {
                svgContent += `<rect x="${x}" y="${y}" width="1" height="1" fill="${pixel.color}"/>`
            }
        })
    })

    patterns.right.forEach((row, y) => {
        row.forEach((pixel, x) => {
            if (pixel.active) {
                svgContent += `<rect x="${finalWidth - rightWidth + x}" y="${y}" width="1" height="1" fill="${pixel.color}"/>`
            }
        })
    })

    svgContent += '</svg>'
    return { svg: svgContent, width: finalWidth, height, style }
}

const createRadialGradient = (id, colors, textMetrics) => {
    const stops = colors.map((color, index) =>
        `<stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color}"/>`
    ).join('')

    // Calculate the center of the text area
    const textCenterX = textMetrics.x + (textMetrics.width / 2)
    // Assuming height is the font height, typically around 8-10 pixels for pixel fonts
    const textCenterY = 5  // or use textMetrics.height / 2 if you have the height

    // Calculate the radius to cover the text
    const radius = Math.max(textMetrics.width / 2, 5) // Use half of text width or minimum 5px

    return `<radialGradient id="${id}" 
        cx="${textCenterX}" cy="${textCenterY}" r="${radius}"
        gradientUnits="userSpaceOnUse">
        ${stops}
    </radialGradient>`
}

const createLinearGradient = (id, direction, colors, textMetrics) => {
    // Calculate gradient coordinates based on text position
    const coords = getGradientCoordinates(direction, textMetrics)
    const stops = colors.map((color, index) =>
        `<stop offset="${(index / (colors.length - 1)) * 100}%" stop-color="${color}"/>`
    ).join('')

    return `<linearGradient id="${id}" 
        x1="${coords.x1}" y1="${coords.y1}" 
        x2="${coords.x2}" y2="${coords.y2}"
        gradientUnits="userSpaceOnUse">
        ${stops}
    </linearGradient>`
}

const getGradientCoordinates = (direction, textMetrics) => {
    const { x, width } = textMetrics
    const coords = {
        'to right': {
            x1: `${x}`,
            y1: "0",
            x2: `${x + width}`,
            y2: "0"
        },
        'to left': {
            x1: `${x + width}`,
            y1: "0",
            x2: `${x}`,
            y2: "0"
        },
        'to bottom': {
            x1: `${x}`,
            y1: "0",
            x2: `${x}`,
            y2: "10"
        },
        'to top': {
            x1: `${x}`,
            y1: "10",
            x2: `${x}`,
            y2: "0"
        },
        '45deg': {
            x1: `${x}`,
            y1: "0",
            x2: `${x + width}`,
            y2: "10"
        },
        '-45deg': {
            x1: `${x + width}`,
            y1: "0",
            x2: `${x}`,
            y2: "10"
        }
    }
    return coords[direction] || coords['to right']
}