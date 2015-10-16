export function drawDonut(canvas, color, percentage) {
    let context = canvas.getContext('2d'),
        x = canvas.width / 2,
        y = canvas.height / 2,
        radius = 75,
        startAngle = 1.5 * Math.PI,
        endAngle = (1.5 + 2 * percentage/100) * Math.PI,
        counterClockwise = false,
        whiteSpace = 0.01 * Math.PI,
        shadowStartAngle = endAngle + whiteSpace,
        shadowEndAngle = startAngle + 2 * Math.PI - whiteSpace

    var imageObj = new Image()
    imageObj.onload = function() {
        var pattern = context.createPattern(imageObj, 'repeat');
        context.strokeStyle = pattern

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
        context.lineWidth = 15;

        // line color
        // context.strokeStyle = color
        context.stroke()

        if (shadowStartAngle < shadowEndAngle) {
            context.beginPath();
            context.arc(x, y, radius, shadowStartAngle, shadowEndAngle, counterClockwise);
            context.strokeStyle = 'lightgray';
            context.stroke();
        }
    }
    imageObj.src = color
}


