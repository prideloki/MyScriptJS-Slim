
var draw2Text = function (canvasId, resultId) {
    this.canvasId = canvasId;
    this.resultId = resultId;
    var canvas = document.getElementById(this.canvasId);
    var result = document.getElementById(this.resultId);
    var trash = document.getElementById('reset');

    var applicationKey = config.applicationKey;
    var hmacKey = config.hmacKey;

    var context = canvas.getContext("2d");
    var pointerId;

    var stroker = new MyScript.InkManager();
    var textRenderer = new MyScript.TextRenderer();
    var textRecognizer = new MyScript.TextRecognizer();
    var instanceId;

    textRecognizer.getParameters().setLanguage('en_US');

    function getNumericStyleProperty(style, prop) {
        return parseInt(style.getPropertyValue(prop), 10);
    }

    function element_position(e) {
        var x = 0, y = 0;
        var inner = true;
        do {
            x += e.offsetLeft;
            y += e.offsetTop;
            var style = getComputedStyle(e, null);
            var borderTop = getNumericStyleProperty(style, "border-top-width");
            var borderLeft = getNumericStyleProperty(style, "border-left-width");
            y += borderTop;
            x += borderLeft;
            if (inner) {
                var paddingTop = getNumericStyleProperty(style, "padding-top");
                var paddingLeft = getNumericStyleProperty(style, "padding-left");
                y += paddingTop;
                x += paddingLeft;
            }
            inner = false;
        } while (e = e.offsetParent);
        return {x: x, y: y};
    }


    canvas.addEventListener('pointerdown', function (event) {
        if (!pointerId) {
            pointerId = event.pointerId;
            event.preventDefault();
            var p = element_position(canvas);
            textRenderer.drawStart(event.pageX - p.x, event.pageY - p.y);
            stroker.startInkCapture(event.pageX - p.x, event.pageY - p.y);
        }
    }, false);

    canvas.addEventListener('pointermove', function (event) {
        if (pointerId === event.pointerId) {
            event.preventDefault();
            var p = element_position(canvas);
            textRenderer.drawContinue(event.pageX - p.x, event.pageY - p.y, context);
            stroker.continueInkCapture(event.pageX - p.x, event.pageY - p.y);
        }
    }, false);

    canvas.addEventListener('pointerup', function (event) {
        if (pointerId === event.pointerId) {
            event.preventDefault();
            var p = element_position(canvas);
            textRenderer.drawEnd(event.pageX - p.x, event.pageY - p.y, context);
            stroker.endInkCapture();
            pointerId = undefined;
            doRecognition();
        }
    }, false);

    canvas.addEventListener('pointerleave', function (event) {
        if (pointerId === event.pointerId) {
            event.preventDefault();
            var p = element_position(canvas);
            textRenderer.drawEnd(event.pageX - p.x, event.pageY - p.y, context);
            stroker.endInkCapture();
            pointerId = undefined;
            doRecognition();
        }
    }, false);

    trash.addEventListener('click',function(){
        instanceId = undefined;
        textRenderer.clear(context);
        stroker.clear();
    },false);

    function doRecognition() {
        if (stroker.isEmpty()) {
            result.value = '';
        } else {
            var inputUnit = new MyScript.TextInputUnit();
            inputUnit.setComponents(stroker.getStrokes());

            var units = [inputUnit];
            textRecognizer.doSimpleRecognition(applicationKey, instanceId, units, hmacKey).then(
                function (data) {
                    if (!instanceId) {
                        instanceId = data.getInstanceId();
                    } else if (instanceId !== data.getInstanceId()) {
                        return;
                    }

                    result.value = data.getTextDocument().getTextSegment().getSelectedCandidate().getLabel();
                }
            );
        }
    }

};

var myscript1 = new draw2Text('canvas1', 'result1');
var myscript2 = new draw2Text('canvas2', 'result2');
