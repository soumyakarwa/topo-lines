// Helper for comparing points with tolerance
const pointsEqual = (a, b, tol = 1e-6) => {
    return Math.abs(a[0] - b[0]) < tol && Math.abs(a[1] - b[1]) < tol;
};

const addContourSegment = (contourSegments, cv, x1, y1, x2, y2) => {
    contourSegments.push({
        contourValue: cv,
        start: [x1, y1],
        end: [x2, y2],
    });
};

function groupSegments(segments) {
    let contours = [];
    let used = new Set();
    for (let i = 0; i < segments.length; i++) {
        if (used.has(i)) continue;

        let seg = segments[i];
        let line = [seg.start, seg.end];
        used.add(i);

        let added;
        do {
            added = false;
            for (let j = 0; j < segments.length; j++) {
                if (used.has(j)) continue;
                let s = segments[j];
                if (pointsEqual(line[line.length - 1], s.start)) {
                    line.push(s.end);
                    used.add(j);
                    added = true;
                } else if (pointsEqual(line[line.length - 1], s.end)) {
                    line.push(s.start);
                    used.add(j);
                    added = true;
                } else if (pointsEqual(line[0], s.end)) {
                    line.unshift(s.start);
                    used.add(j);
                    added = true;
                } else if (pointsEqual(line[0], s.start)) {
                    line.unshift(s.end);
                    used.add(j);
                    added = true;
                }
            }
        } while (added);

        contours.push(line);
    }
    return contours;
}

// This function has code by rjgilmour: https://editor.p5js.org/rjgilmour/sketches/l3XM1tz6d
function createContourSegments(contourSegments) {
    for (let i = 0; i < 1 + pixelsInWidth; i++) {
        for (let j = 0; j < 1 + pixelsInHeight; j++) {
            if (i < pixelsInWidth && j < pixelsInHeight) {
                let a = floor(noiseMap[i][j] / thresh);
                let b = floor(noiseMap[i + 1][j] / thresh);
                let c = floor(noiseMap[i][j + 1] / thresh);
                let d = floor(noiseMap[i + 1][j + 1] / thresh);

                let ab = 0;
                let ac = 0;
                let bcx = 0;
                let bcy = 0;
                let bd = 0;
                let cd = 0;
                let abContourValue = 0;
                let acContourValue = 0;
                let cdContourValue = 0;
                let bcContourValue = 0;
                let bdContourValue = 0;
                let height = 0;

                if (a != b) {
                    abContourValue = thresh * max(a, b);
                    height = abContourValue;
                    let diff = abs(noiseMap[i][j] - noiseMap[i + 1][j]);
                    let add = abs(noiseMap[i][j] - abContourValue);
                    ab = i * res + (res * add) / diff;
                }

                if (a != c) {
                    acContourValue = thresh * max(a, c);
                    height = acContourValue;

                    let diff = abs(noiseMap[i][j] - noiseMap[i][j + 1]);
                    let add = abs(noiseMap[i][j] - acContourValue);
                    ac = j * res + (res * add) / diff;
                }

                if (c != d) {
                    cdContourValue = thresh * max(c, d);
                    height = cdContourValue;

                    let diff = abs(noiseMap[i][j + 1] - noiseMap[i + 1][j + 1]);
                    let add = abs(noiseMap[i][j + 1] - cdContourValue);
                    cd = i * res + (res * add) / diff;
                }

                if (b != c) {
                    bcContourValue = thresh * max(b, c);
                    height = bcContourValue;

                    let diff = abs(noiseMap[i + 1][j] - noiseMap[i][j + 1]);
                    let add = abs(noiseMap[i + 1][j] - bcContourValue);
                    bcx = (i + 1) * res - (res * add) / diff;
                    bcy = j * res + (res * add) / diff;
                }

                if (b != d) {
                    bdContourValue = thresh * max(b, d);
                    height = bdContourValue;

                    let diff = abs(noiseMap[i + 1][j] - noiseMap[i + 1][j + 1]);
                    let add = abs(noiseMap[i + 1][j] - bdContourValue);
                    bd = j * res + (res * add) / diff;
                }

                // stroke(144, 238, 144)
                stroke(0);
                strokeWeight(0.25);
                if (height % 9 == 0) {
                    strokeWeight(0.5);
                }

                if (ab) {
                    if (ac) {
                        // line(ab, j*res, i*res, ac);
                        addContourSegment(
                            contourSegments,
                            abContourValue,
                            ab,
                            j * res,
                            i * res,
                            ac
                        );
                    }
                    if (bcx || bcy) {
                        // line(ab, j*res, bcx, bcy);
                        addContourSegment(
                            contourSegments,
                            bcContourValue,
                            ab,
                            j * res,
                            bcx,
                            bcy
                        );
                    }
                } else if (ac) {
                    if (bcx || bcy) {
                        // line(i*res, ac, bcx, bcy);
                        addContourSegment(
                            contourSegments,
                            bcContourValue,
                            i * res,
                            ac,
                            bcx,
                            bcy
                        );
                    }
                }

                if (cd) {
                    if (bd) {
                        // line(cd, (j+1)*res, (i+1)*res, bd);
                        addContourSegment(
                            contourSegments,
                            cdContourValue,
                            cd,
                            (j + 1) * res,
                            (i + 1) * res,
                            bd
                        );
                    }
                    if (bcx || bcy) {
                        // line(cd, (j+1)*res, bcx, bcy);
                        addContourSegment(
                            contourSegments,
                            bcContourValue,
                            cd,
                            (j + 1) * res,
                            bcx,
                            bcy
                        );
                    }
                } else if (bd) {
                    if (bcx || bcy) {
                        // line((i+1)*res, bd, bcx, bcy);
                        addContourSegment(
                            contourSegments,
                            bcContourValue,
                            (i + 1) * res,
                            bd,
                            bcx,
                            bcy
                        );
                    }
                }
            }
        }
    }
}
