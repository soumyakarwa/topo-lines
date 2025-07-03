let noiseMap = [];
let res = 4; // pixel resolution
let thresh = 3; // threshold for contour value
let pixelsInWidth, pixelsInHeight, contourMinValue, contourMaxValue, font;
let contourSegments = [];
let contourLinesByValue = {};
let connectedContourLines = [];
let points = [];
let allLines = [];
let closedLines = [];
let fontSize = 64;

function preload() {
    font = loadFont("assets/Libre_Baskerville/LibreBaskerville-Regular.ttf");
}

function setup() {
    // textSize(fontSize);

    createCanvas(windowWidth, windowHeight);

    pixelsInWidth = width / res;
    pixelsInHeight = height / res;

    let noiseScale = 40;
    let centerX = (pixelsInWidth + 1) / 2;
    let centerY = (pixelsInHeight + 1) / 2;
    let flatness = 0.4; // 0 = all noise, 1 = all flat
    let base = 10;

    for (let i = 0; i < 1 + pixelsInWidth; i++) {
        noiseMap[i] = [];
        for (let j = 0; j < 1 + pixelsInHeight; j++) {
            // let distToCenter = dist(i, j, centerX, centerY);
            // let hill = map(distToCenter, 0, Math.max(centerX, centerY), 300, 0); // 40 at center, 10 at edge
            // noiseMap[i][j] = noise(i / noiseScale, j / noiseScale) * 80 + hill;
            // let n = noise(i / noiseScale, j / noiseScale);
            // noiseMap[i][j] = lerp(n * 100, base, flatness) + hill;

            noiseMap[i][j] = noise(i / 50, j / 50) * 100;
        }
    }

    noiseMap[round(width / 4)][round(height / 2)] = 55;

    createContourSegments(contourSegments);

    contourSegments.forEach((seg) => {
        if (!contourLinesByValue[seg.contourValue])
            contourLinesByValue[seg.contourValue] = [];
        contourLinesByValue[seg.contourValue].push(seg);
    });

    Object.entries(contourLinesByValue).forEach(([value, segments]) => {
        let fullLines = groupSegments(segments);
        connectedContourLines.push({
            contourValue: value,
            lines: fullLines,
        });
    });

    connectedContourLines.sort((a, b) => {
        return a.lines.length - b.lines.length;
    });

    allLines = connectedContourLines.flatMap((obj) => obj.lines);
    allLines = allLines.filter((line) => line.length > 2);
    allLines.sort((a, b) => {
        return a.length - b.length;
    });

    closedLines = allLines.filter(
        (line) => line.length > 1 && pointsEqual(line[0], line[line.length - 1])
    );
}

function draw() {
    background("#f0efdf");

    for (let i = 0; i < allLines.length; i++) {
        let currentLine = allLines[i];

        // gradually fades out
        let strokeOpacity =
            i > frameCount ? 1 : map(frameCount, i, i * 1.25, 1, 0.5);

        // strokeOpacity = 1; // add this line to remove the fade out effect

        noFill();
        stroke(100, 100, 100, strokeOpacity * 255);
        for (let j = 0; j < currentLine.length - 1; j++) {
            // for ulta etch a sketch effect
            // if (j < frameCount) {
            //     stroke("#f0efdf");
            // } else {
            //     stroke(100, 100, 100);
            // }
            line(
                currentLine[j][0],
                currentLine[j][1],
                currentLine[j + 1][0],
                currentLine[j + 1][1]
            );
        }
    }

    // fills in certain contour lines to appear as "water bodies" on the map
    for (
        let i = round(closedLines.length * 0.95);
        i < closedLines.length;
        i++
    ) {
        let currentLine = closedLines[i];
        fill("#f0efdf");
        noStroke();
        beginShape();
        for (point of currentLine) {
            vertex(point[0], point[1]);
        }
        endShape(CLOSE);
    }

    // for (let i = 0; i < 1 + pixelsInWidth; i += 3) {
    //     for (let j = 0; j < 1 + pixelsInHeight; j += 3) {
    //         // console.log(i, j);
    //         textSize(5);
    //         let c = map(round(noiseMap[i][j]), 0, 100, 0, 255);
    //         noStroke();
    //         fill(c, 0, 0);
    //         text(round(noiseMap[i][j]), i * res, j * res);
    //     }
    // }
    // text(noiseMap[round(width / 4)][round(height / 2)], width / 4, height / 2);

    // if (allLines.length / 2 < frameCount) {
    //     for (let i = 0; i < points.length; i++) {
    //         let p = points[i];
    //         // if (i % frameCount == 0) {
    //         // let pointOpacity = map(frameCount, 120, 200, 0, 1);
    //         // fill(0, 0, 0, (frameCount / i) * 255);
    //         circle(p.x, p.y, 2);
    //         // }
    //     }
    // }

    // for (let i = 0; i < points.length; i++) {
    //     let p = points[i];
    //     // if (i % frameCount == 0) {
    //     // let pointOpacity = map(frameCount, 120, 200, 0, 1);
    //     fill(0, 0, 0, (frameCount / i) * 255);
    //     circle(p.x, p.y, 2);
    //     // }
    // }
    // }

    // points = font.textToPoints(
    //     "THE EROSION",
    //     width / 2 - textWidth("THE EROSION") / 2,
    //     height / 2 - fontSize / 2,
    //     fontSize,
    //     {
    //         sampleFactor: 0.9,
    //     }
    // );
}
