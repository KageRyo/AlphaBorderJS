
document.addEventListener('DOMContentLoaded', function() {
    let srcImage = null;

    const UI = {
        dropZone: document.getElementById('drop-zone'),
        canvas: document.getElementById('main-canvas'),
        downloadBtn: document.getElementById('btn-download'),
        params: {
            threshold: document.getElementById('param-threshold'),
            stroke: document.getElementById('param-stroke'),
            glow: document.getElementById('param-glow'),
            color: document.getElementById('param-color')
        },
        displays: {
            threshold: document.getElementById('disp-thresh'),
            stroke: document.getElementById('disp-stroke'),
            glow: document.getElementById('disp-glow')
        }
    };

    const ctx = UI.canvas.getContext('2d', { willReadFrequently: true });

    const updateParams = (key) => {
        UI.displays[key].innerText = UI.params[key].value;
        if (srcImage) requestAnimationFrame(render);
    };

    Object.keys(UI.params).forEach(key => {
        if(UI.displays[key]) {
            UI.params[key].addEventListener('input', () => updateParams(key));
        } else {
            UI.params[key].addEventListener('input', () => { if(srcImage) requestAnimationFrame(render); });
        }
    });

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            srcImage = new Image();
            srcImage.onload = () => {
                render();
                updateZoomUI();
                UI.dropZone.innerHTML = `Loaded: ${srcImage.width}x${srcImage.height}`;
            };
            srcImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    UI.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        UI.dropZone.classList.add('drag-active');
    });
    UI.dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        UI.dropZone.classList.remove('drag-active');
    });
    UI.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        UI.dropZone.classList.remove('drag-active');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    UI.dropZone.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/*';
        input.onchange = (e) => handleFile(e.target.files[0]);
        input.click();
    });

    UI.downloadBtn.addEventListener('click', () => {
        const w = UI.canvas.width;
        const h = UI.canvas.height;
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = w;
        exportCanvas.height = h;
        const exportCtx = exportCanvas.getContext('2d');
        exportCtx.drawImage(UI.canvas, 0, 0);
        const link = document.createElement('a');
        link.download = `AlphaBorder_${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
    });

    function render() {
        if (!srcImage) {
            ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);
            return;
        }
        const w = srcImage.width;
        const h = srcImage.height;
        const padding = 100;
        UI.canvas.width = w + padding * 2;
        UI.canvas.height = h + padding * 2;
        ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);
        const threshold = parseInt(UI.params.threshold.value);
        const strokeWidth = parseInt(UI.params.stroke.value);
        const glowRadius = parseInt(UI.params.glow.value);
        const glowColor = UI.params.color.value;
        const bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = w; bufferCanvas.height = h;
        const bCtx = bufferCanvas.getContext('2d', { willReadFrequently: true });
        bCtx.drawImage(srcImage, 0, 0);
        const imgData = bCtx.getImageData(0, 0, w, h);
        const px = imgData.data;
        for (let i = 0; i < px.length; i += 4) {
            if (px[i] < threshold && px[i+1] < threshold && px[i+2] < threshold) {
                px[i+3] = 0;
            }
        }
        bCtx.putImageData(imgData, 0, 0);
        if (glowRadius > 0) {
            ctx.save();
            ctx.shadowBlur = glowRadius;
            ctx.shadowColor = glowColor;
            ctx.drawImage(bufferCanvas, padding, padding);
            ctx.drawImage(bufferCanvas, padding, padding);
            ctx.restore();
        }
        if (strokeWidth > 0) {
            ctx.save();
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = w; maskCanvas.height = h;
            const mCtx = maskCanvas.getContext('2d');
            mCtx.drawImage(bufferCanvas, 0, 0);
            mCtx.globalCompositeOperation = 'source-in';
            mCtx.fillStyle = '#000000';
            mCtx.fillRect(0, 0, w, h);
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = strokeWidth; 
            const passes = 15;
            for(let i = 0; i < passes; i++) {
                ctx.drawImage(maskCanvas, padding, padding);
            }
            if(strokeWidth > 5) {
                ctx.shadowBlur = strokeWidth + 2;
                ctx.drawImage(maskCanvas, padding, padding);
            }
            ctx.restore();
        }
        ctx.drawImage(bufferCanvas, padding, padding);
        UI.downloadBtn.disabled = false;
    }
});
