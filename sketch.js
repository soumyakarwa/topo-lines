let noiseMap = [];
let res = 4; // pixel resolution
let thresh = 3; // threshold for contour value
let pixelsInWidth, pixelsInHeight, contourMinValue, contourMaxValue, font;
let contourSegments = [];
let contourLinesByValue = {};
let connectedContourLines = [];
let points = [];
let fontSize = 64;

function preload() {
    font = loadFont("assets/Libre_Baskerville/LibreBaskerville-Regular.ttf");
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    pixelsInWidth = width / res;
    pixelsInHeight = height / res;

    for (let i = 0; i < 1 + pixelsInWidth; i++) {
        noiseMap[i] = [];
        for (let j = 0; j < 1 + pixelsInHeight; j++) {
            noiseMap[i][j] = noise(i / 50, j / 50) * 100;
        }
    }

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

    let contourValues = connectedContourLines.map((c) =>
        Number(c.contourValue)
    );
    contourMinValue = min(contourValues);
    contourMaxValue = max(contourValues);

    textSize(fontSize);
    console.log(textWidth("THE EROSION"));

    console.log("Connected Contour Lines:", connectedContourLines);

    points = font.textToPoints(
        "THE EROSION",
        width / 2 - textWidth("THE EROSION") / 2,
        height / 2 + fontSize / 2,
        fontSize,
        {
            sampleFactor: 0.9,
        }
    );
}

function draw() {
    background("#f0efdf");

    for (let contour of connectedContourLines) {
        strokeWeight(
            map(contour.contourValue, contourMaxValue, contourMinValue, 0.1, 1)
        );
        noFill();
        for (let l of contour.lines) {
            for (let i = 0; i < l.length - 1; i++) {
                if (i < frameCount) {
                    stroke("#f0efdf");
                } else {
                    stroke(100, 100, 100);
                }
                line(l[i][0], l[i][1], l[i + 1][0], l[i + 1][1]);
            }
        }
    }
    // noLoop();

    // if (frameCount > 120) {
    //     console.log("Drawing points");
    //     // stroke(0);
    //     // strokeWeight(1);
    //     fill(0);

    //     for (let p of points) {
    //         circle(p.x, p.y, 2);
    //     }
    // }
}
