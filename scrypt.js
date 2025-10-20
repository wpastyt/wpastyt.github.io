let coins = 0;
let cooldownActive = false;
let cooldownTime = 15;
let unlockedTools = {
    image: false,
    video: false,
    videoedit: false,
    imageedit: false
};

const UNLOCK_COSTS = {
    image: 30,
    video: 30,
    videoedit: 30,
    imageedit: 30
};

const GENERATION_COSTS = {
    image: 10,
    video: 10,
    videoedit: 10,
    imageedit: 10
};

function updateCoinDisplay() {
    const coinElements = document.querySelectorAll('#coinCount, .coin-count-sync');
    coinElements.forEach(el => {
        el.textContent = coins;
    });
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    
    document.getElementById('homepage').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
}

function earnCoin() {
    if (cooldownActive) return;
    
    coins++;
    updateCoinDisplay();
    
    cooldownActive = true;
    updateEarnButtonState();
    
    let timeLeft = cooldownTime;
    const interval = setInterval(() => {
        timeLeft--;
        updateEarnButtonText(timeLeft);
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            cooldownActive = false;
            updateEarnButtonState();
        }
    }, 1000);
}

function updateEarnButtonState() {
    const buttons = document.querySelectorAll('.earn-coin-btn');
    buttons.forEach(btn => {
        btn.disabled = cooldownActive;
        if (!cooldownActive) {
            btn.innerHTML = '<span>Earn Coin</span>';
        }
    });
}

function updateEarnButtonText(timeLeft) {
    const buttons = document.querySelectorAll('.earn-coin-btn');
    buttons.forEach(btn => {
        btn.innerHTML = `<span>Wait ${timeLeft}s</span>`;
    });
}

function openTool(toolName) {
    if (toolName === 'tutorial') {
        showTutorial();
        return;
    }
    
    if (!unlockedTools[toolName]) {
        const unlockCost = UNLOCK_COSTS[toolName];
        if (coins < unlockCost) {
            alert(`You need ${unlockCost} coins to unlock this tool. You currently have ${coins} coins.`);
            return;
        }
        
        const confirmUnlock = confirm(`Unlock ${toolName.toUpperCase()} for ${unlockCost} coins?`);
        if (confirmUnlock) {
            coins -= unlockCost;
            updateCoinDisplay();
            unlockedTools[toolName] = true;
            
            const lockBadge = document.getElementById(`${toolName}Lock`);
            const unlockedBadge = document.getElementById(`${toolName}Unlocked`);
            
            if (lockBadge) lockBadge.style.display = 'none';
            if (unlockedBadge) unlockedBadge.style.display = 'inline-flex';
            
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById(`${toolName}Tool`).classList.add('active');
        }
        return;
    }
    
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById(`${toolName}Tool`).classList.add('active');
}

function backToDashboard() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('dashboard').classList.add('active');
}

function deductCoins(amount) {
    if (amount === 0) return true;
    
    if (coins < amount) {
        alert(`Insufficient coins! You need ${amount} coins for generation. You have ${coins} coins.`);
        return false;
    }
    coins -= amount;
    updateCoinDisplay();
    return true;
}

function generateImage() {
    const prompt = document.getElementById('imagePrompt').value.trim();
    
    if (!prompt) {
        alert('Please describe the image you want to generate!');
        return;
    }
    
    if (!deductCoins(GENERATION_COSTS.image)) return;
    
    const output = document.getElementById('imageOutput');
    output.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Generating your image...</p>
        </div>
    `;
}

function generateVideo() {
    const prompt = document.getElementById('videoPrompt').value.trim();
    
    if (!prompt) {
        alert('Please describe the video you want to create!');
        return;
    }
    
    if (!deductCoins(GENERATION_COSTS.video)) return;
    
    const output = document.getElementById('videoOutput');
    output.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Generating your video...</p>
        </div>
    `;
}

function generateVideoEdit() {
    const videoInput = document.getElementById('videoEditInput');
    const prompt = document.getElementById('videoEditPrompt').value.trim();
    
    if (!videoInput.files || videoInput.files.length === 0 || !prompt) {
        alert('Please provide both video file and editing instructions!');
        return;
    }
    
    if (!deductCoins(GENERATION_COSTS.videoedit)) return;
    
    const output = document.getElementById('videoEditOutput');
    output.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Processing your video...</p>
        </div>
    `;
}

function generateImageEdit() {
    const imageInput = document.getElementById('imageEditInput');
    const prompt = document.getElementById('imageEditPrompt').value.trim();
    
    if (!imageInput.files || imageInput.files.length === 0 || !prompt) {
        alert('Please provide both image file and editing instructions!');
        return;
    }
    
    if (!deductCoins(GENERATION_COSTS.imageedit)) return;
    
    const output = document.getElementById('imageEditOutput');
    output.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Processing your image...</p>
        </div>
    `;
}

function showTutorial() {
    const modal = document.getElementById('tutorialModal');
    modal.classList.add('active');
}

function closeTutorial() {
    const modal = document.getElementById('tutorialModal');
    modal.classList.remove('active');
}

window.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const tutorialModal = document.getElementById('tutorialModal');
    
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
    }
    if (e.target === tutorialModal) {
        tutorialModal.classList.remove('active');
    }
});

document.getElementById('videoEditInput')?.addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || '';
    const fileNameDisplay = document.getElementById('videoFileName');
    if (fileNameDisplay) {
        fileNameDisplay.textContent = fileName ? `Selected: ${fileName}` : '';
    }
});

document.getElementById('imageEditInput')?.addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || '';
    const fileNameDisplay = document.getElementById('imageFileName');
    if (fileNameDisplay) {
        fileNameDisplay.textContent = fileName ? `Selected: ${fileName}` : '';
    }
});

updateCoinDisplay();
