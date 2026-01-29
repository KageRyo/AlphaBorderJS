const LANGS = {
    'zh-TW': {
        thresh: '亮度閾值 (RGB最大值)',
        stroke: '外框寬度 (像素)',
        glow: '發光半徑 (像素)',
        color: '發光顏色',
        dropMain: '【拖曳圖片到此】',
        dropSub: '亮度去背來源（目前支援黑色背景）',
        export: '匯出 PNG',
    },
    'en': {
        thresh: 'Luma Threshold (RGB Max)',
        stroke: 'Stroke Width (px)',
        glow: 'Glow Radius (px)',
        color: 'Glow Color',
        dropMain: '[ DRAG IMAGE HERE ]',
        dropSub: 'Luma Keying Source (Black BG)',
        export: 'EXPORT PNG',
    },
    'ja': {
        thresh: '輝度しきい値 (RGB最大値)',
        stroke: 'アウトライン幅 (ピクセル)',
        glow: 'グロー半径 (ピクセル)',
        color: 'グロー色',
        dropMain: '[ ここに画像をドラッグ ]',
        dropSub: '輝度キーイングソース（黒背景対応）',
        export: 'PNGをエクスポート',
    }
};
function setLangUI(lang) {
    document.getElementById('label-thresh').innerHTML = LANGS[lang].thresh + ' <span id="disp-thresh" class="value-disp">' + document.getElementById('disp-thresh').textContent + '</span>';
    document.getElementById('label-stroke').innerHTML = LANGS[lang].stroke + ' <span id="disp-stroke" class="value-disp">' + document.getElementById('disp-stroke').textContent + '</span>';
    document.getElementById('label-glow').innerHTML = LANGS[lang].glow + ' <span id="disp-glow" class="value-disp">' + document.getElementById('disp-glow').textContent + '</span>';
    document.getElementById('label-color').textContent = LANGS[lang].color;
    document.getElementById('drop-text-main').textContent = LANGS[lang].dropMain;
    document.getElementById('drop-text-sub').textContent = LANGS[lang].dropSub;
    document.getElementById('btn-download').textContent = LANGS[lang].export;
}
document.addEventListener('DOMContentLoaded', function() {
    const langSwitcher = document.getElementById('lang-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('change', function() {
            setLangUI(this.value);
        });
        setLangUI(langSwitcher.value);
    }
});
