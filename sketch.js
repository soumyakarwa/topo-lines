let noiseMap = [];
let res = 4; // pixel resolution
let thresh = 3; // threshold for contour value
let pixelsInWidth, pixelsInHeight, contourMinValue, contourMaxValue, font;
let contourSegments = [];
let contourLinesByValue = {};
let connectedContourLines = [];
let points = [];
let allLines = [];
let fontSize = 64;

function preload() {
    font = loadFont("assets/Libre_Baskerville/LibreBaskerville-Regular.ttf");
}

function setup() {
    // frameRate(30);
    // textSize(fontSize);
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

    allLines = connectedContourLines.flatMap((obj) => obj.lines);
    allLines = allLines.filter((line) => line.length > 2);
    allLines.sort((a, b) => {
        return a.length - b.length;
    });

    points = font.textToPoints(
        "THE EROSION",
        width / 2 - textWidth("THE EROSION") / 2,
        height / 2 - fontSize / 2,
        fontSize,
        {
            sampleFactor: 0.9,
        }
    );
}

function draw() {
    background("#f0efdf");

    for (let i = 0; i < allLines.length; i++) {
        // let contour = connectedContourLines[i];

        // strokeWeight(
        //     map(contour.contourValue, contourMaxValue, contourMinValue, 0.1, 1)
        // );
        let strokeOpacity =
            i > frameCount ? 1 : map(frameCount, i, i * 1.5, 1, 0);

        stroke(100, 100, 100, strokeOpacity * 255);
        noFill();

        for (let j = 0; j < allLines[i].length - 1; j++) {
            // if (j < frameCount) {
            //     stroke("#f0efdf");
            // } else {
            //     stroke(100, 100, 100);
            // }
            line(
                allLines[i][j][0],
                allLines[i][j][1],
                allLines[i][j + 1][0],
                allLines[i][j + 1][1]
            );
        }
    }

    // if (frameCount > 60) {
    // console.log("Drawing points");
    // stroke(0);
    // strokeWeight(1);
    //

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
}
