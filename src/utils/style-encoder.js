// style-encoder.js

export function encodeStyle(data) {
    try {
        // Create color map to reduce repetition
        const colorMap = new Map();
        let colorIndex = 0;
        
        // Helper to get or set color index
        const getColorIndex = (color) => {
            color = color.replace('#', '');
            if (!colorMap.has(color)) {
                colorMap.set(color, colorIndex++);
            }
            return colorMap.get(color);
        };

        // Format patterns
        const patterns = {
            left: formatNestedPattern(data.patterns.left, getColorIndex),
            middle: formatNestedPattern(data.patterns.middle, getColorIndex),
            right: formatNestedPattern(data.patterns.right, getColorIndex)
        };

        // Convert color map to array
        const colors = Array.from(colorMap.keys());

        const encoded = [
            data.id,
            data.name,
            data.author,
            colors.join(','),  // Store color palette
            [patterns.left, patterns.middle, patterns.right].join(';'),
            data.settings.font,
            data.settings.textColor.replace('#', ''),
            [data.settings.leftWidth, data.settings.middleWidth, data.settings.rightWidth].join(','),
            [Number(data.settings.mirrorLeft), Number(data.settings.mirrorRight)].join(',')
        ].join('|');

        return encoded;
    } catch (error) {
        console.error('Encoding error:', error);
        throw error;
    }
}

function formatNestedPattern(pattern, getColorIndex) {
    if (!Array.isArray(pattern)) return '';

    return pattern.map(row => {
        if (!Array.isArray(row)) return '';
        return row.map(cell => {
            if (!cell || typeof cell !== 'object') return '0:0';
            // Use color index instead of full color code
            return `${Number(cell.active)}:${getColorIndex(cell.color)}`
        }).join(',');
    }).join('~');
}

export function decodeStyle(encoded) {
    try {
        const [id, name, author, colorsStr, patternsStr, font, textColor, widthsStr, mirrorsStr] = encoded.split('|');
        
        // Reconstruct color palette
        const colors = colorsStr.split(',');
        
        const [leftWidth, middleWidth, rightWidth] = widthsStr.split(',').map(Number);
        const [mirrorLeft, mirrorRight] = mirrorsStr.split(',').map(v => v === '1');
        
        const [leftPattern, middlePattern, rightPattern] = patternsStr.split(';');

        return {
            id,
            name,
            author,
            patterns: {
                left: decodeNestedPattern(leftPattern, colors),
                middle: decodeNestedPattern(middlePattern, colors),
                right: decodeNestedPattern(rightPattern, colors)
            },
            settings: {
                font,
                textColor: '#' + textColor,
                leftWidth,
                middleWidth,
                rightWidth,
                mirrorLeft,
                mirrorRight
            }
        };
    } catch (error) {
        console.error('Decoding error:', error);
        throw error;
    }
}

function decodeNestedPattern(patternStr, colors) {
    if (!patternStr) return [[]];
    
    try {
        return patternStr.split('~').map(rowStr => {
            if (!rowStr) return [];
            return rowStr.split(',').map(cell => {
                if (!cell) return { active: false, color: '#000000' };
                const [active, colorIndex] = cell.split(':');
                return {
                    active: Boolean(Number(active)),
                    color: '#' + colors[Number(colorIndex)]
                };
            });
        });
    } catch (error) {
        console.error('Error decoding pattern:', error);
        return [[]];
    }
}
