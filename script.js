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
    video: 50,
    videoedit: 50,
    imageedit: 30
};

const GENERATION_COSTS = {
    image: 10,
    video: 15,
    videoedit: 15,
    imageedit: 10
};

function updateCoinDisplay() {
    const coinElements = document.querySelectorAll('#coinCount, .coin-count-sync, #modalCoinCount');
    coinElements.forEach(el => {
        el.textContent = coins;
    });
}

function earnCoin() {
    showEarnCoinsModal();
}

function processEarnCoin() {
    coins++;
    updateCoinDisplay();

    cooldownActive = true;
    
    let timeLeft = cooldownTime;
    updateEarnButtonText(timeLeft);
    
    const interval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(interval);
            cooldownActive = false;
            updateEarnButtonState();
        } else {
            updateEarnButtonText(timeLeft);
        }
    }, 750);
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

let pendingUnlockTool = null;

function openTool(toolName) {
    if (toolName === 'tutorial') {
        showTutorial();
        return;
    }

    if (!unlockedTools[toolName]) {
        const unlockCost = UNLOCK_COSTS[toolName];
        if (coins < unlockCost) {
            showEarnCoinsModal();
            return;
        }

        showUnlockConfirmModal(toolName);
        return;
    }

    document.getElementById('dashboard').classList.remove('active');
    document.getElementById(`${toolName}Tool`).classList.add('active');
}

function showUnlockConfirmModal(toolName) {
    pendingUnlockTool = toolName;
    const modal = document.getElementById('unlockConfirmModal');
    const toolNameDisplay = document.getElementById('unlockToolName');
    const costDisplay = document.getElementById('unlockCostAmount');
    
    const toolNames = {
        image: 'AI Image',
        video: 'AI Video',
        videoedit: 'AI Video Edit',
        imageedit: 'AI Image Edit'
    };
    
    toolNameDisplay.textContent = toolNames[toolName];
    costDisplay.textContent = UNLOCK_COSTS[toolName];
    
    if (modal) {
        modal.classList.add('active');
    }
}

function closeUnlockConfirmModal() {
    const modal = document.getElementById('unlockConfirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
    pendingUnlockTool = null;
}

function confirmUnlock() {
    if (!pendingUnlockTool) return;
    
    const toolName = pendingUnlockTool;
    const unlockCost = UNLOCK_COSTS[toolName];
    
    if (coins < unlockCost) {
        closeUnlockConfirmModal();
        showEarnCoinsModal();
        return;
    }
    
    coins -= unlockCost;
    updateCoinDisplay();
    unlockedTools[toolName] = true;
    
    const lockBadge = document.getElementById(`${toolName}Lock`);
    const unlockedBadge = document.getElementById(`${toolName}Unlocked`);
    
    if (lockBadge) lockBadge.style.display = 'none';
    if (unlockedBadge) unlockedBadge.style.display = 'inline-flex';
    
    closeUnlockConfirmModal();
}

function backToDashboard() {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('dashboard').classList.add('active');
}

function deductCoins(amount) {
    if (amount === 0) return true;

    if (coins < amount) {
        showEarnCoinsModal();
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

    startQueueProcess('imageOutput');
}

function startQueueProcess(outputId) {
    const output = document.getElementById(outputId);
    const queuePosition = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
    const waitTimeMinutes = Math.floor(queuePosition / 25) + 20;

    output.innerHTML = `
        <div class="queue-container">
            <div class="queue-info">
                <h3><svg class="queue-icon"><use href="#icon-clock"/></svg> In Queue</h3>
                <div class="queue-position">
                    <span class="queue-number" id="queueNumber">#${queuePosition}</span>
                    <p>Current position in queue</p>
                </div>
                <button class="skip-btn" id="skipBtn" onclick="payToSkipQueue()">
                    Pay 10 Coins
                </button>
                <div class="queue-time">
                    <span class="time-estimate">Estimated wait: ${waitTimeMinutes} minutes</span>
                </div>
            </div>
        </div>
    `;

    window.currentQueueData = {
        position: queuePosition,
        outputId: outputId
    };
}

function payToSkipQueue() {
    if (!window.currentQueueData) return;
    
    const data = window.currentQueueData;
    
    if (coins < 10) {
        showEarnCoinsModal();
        return;
    }
    
    coins -= 10;
    updateCoinDisplay();
    
    const queueNumber = document.getElementById('queueNumber');
    queueNumber.textContent = `#1`;
    
    const skipBtn = document.getElementById('skipBtn');
    skipBtn.disabled = true;
    skipBtn.textContent = 'Processing...';
    
    setTimeout(() => {
        startProcessing(data.outputId);
    }, 1000);
}

function showEarnCoinsModal() {
    const modal = document.getElementById('earnCoinsModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeEarnCoinsModal() {
    const modal = document.getElementById('earnCoinsModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

let earnModalCooldown = false;

function earnCoinFromModal() {
    if (earnModalCooldown) return;
    
    coins++;
    updateCoinDisplay();
    
    earnModalCooldown = true;
    
    const modalBtn = document.getElementById('earnModalBtn');
    const statusText = document.getElementById('earnModalStatus');
    
    let displayTime = 15;
    
    if (modalBtn) {
        modalBtn.disabled = true;
        modalBtn.textContent = `Wait ${displayTime}s`;
    }
    if (statusText) {
        statusText.textContent = `Please wait ${displayTime} seconds...`;
    }
    
    const interval = setInterval(() => {
        displayTime--;
        if (displayTime <= 0) {
            clearInterval(interval);
            earnModalCooldown = false;
            if (modalBtn) {
                modalBtn.disabled = false;
                modalBtn.textContent = 'Earn 1 Coin';
            }
            if (statusText) {
                statusText.textContent = 'Ready! Click to earn a coin';
            }
        } else {
            if (modalBtn) {
                modalBtn.textContent = `Wait ${displayTime}s`;
            }
            if (statusText) {
                statusText.textContent = `Please wait ${displayTime} seconds...`;
            }
        }
    }, 800);
}

function showEarnCoinConfirmModal() {
    const modal = document.getElementById('earnCoinConfirmModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeEarnCoinConfirmModal() {
    const modal = document.getElementById('earnCoinConfirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function confirmEarnCoin() {
    closeEarnCoinConfirmModal();
    processEarnCoin();
}

function startProcessing(outputId) {
    const output = document.getElementById(outputId);
    
    const processingSteps = [
        '<svg class="step-icon"><use href="#icon-search"/></svg> Analyzing your request...',
        '<svg class="step-icon"><use href="#icon-palette"/></svg> Initializing AI models...',
        '<svg class="step-icon"><use href="#icon-settings"/></svg> Configuring generation parameters...',
        '<svg class="step-icon"><use href="#icon-brain"/></svg> Loading neural networks...',
        '<svg class="step-icon"><use href="#icon-target"/></svg> Processing input data...',
        '<svg class="step-icon"><use href="#icon-sparkles"/></svg> Optimizing quality settings...',
        '<svg class="step-icon"><use href="#icon-sparkles"/></svg> Applying creative filters...',
        '<svg class="step-icon"><use href="#icon-refresh"/></svg> Rendering elements...',
        '<svg class="step-icon"><use href="#icon-sparkles"/></svg> Fine-tuning details...',
        '<svg class="step-icon"><use href="#icon-package"/></svg> Finalizing output...'
    ];
    
    let currentStep = 0;
    
    output.innerHTML = `
        <div class="processing-container">
            <div class="spinner"></div>
            <p class="processing-text" id="processingText">${processingSteps[0]}</p>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
        </div>
    `;
    
    const stepInterval = setInterval(() => {
        currentStep++;
        
        if (currentStep >= processingSteps.length) {
            clearInterval(stepInterval);
            setTimeout(() => showError(outputId), 1000);
            return;
        }
        
        const processingText = document.getElementById('processingText');
        const progressFill = document.getElementById('progressFill');
        
        if (processingText) {
            processingText.innerHTML = processingSteps[currentStep];
        }
        if (progressFill) {
            progressFill.style.width = `${(currentStep / processingSteps.length) * 100}%`;
        }
    }, 3000);
}

function showError(outputId) {
    const output = document.getElementById(outputId);
    const errorMessages = [
        {
            title: "Server Capacity Reached",
            message: "Our AI servers are currently at maximum capacity. Please try again in 1-2 hours when resources become available."
        },
        {
            title: "Model Update in Progress",
            message: "We're currently updating our AI models to serve you better. This process takes approximately 90-120 minutes. Please retry after this time."
        },
        {
            title: "Temporary Service Interruption",
            message: "Due to high demand, our generation service is temporarily unavailable. We expect normal operations to resume within 1-2 hours."
        }
    ];
    
    const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    output.innerHTML = `
        <div class="error-container">
            <svg class="error-icon"><use href="#icon-alert"/></svg>
            <h3>${randomError.title}</h3>
            <p class="error-message">${randomError.message}</p>
            <p class="error-note">Our systems require maintenance. Thank you for your understanding.</p>
            <button class="retry-btn" onclick="clearOutput('${outputId}')">Understood</button>
        </div>
    `;
}

function clearOutput(outputId) {
    const output = document.getElementById(outputId);
    output.innerHTML = '<div class="placeholder">Your generated content will appear here</div>';
    window.currentQueueData = null;
}

function generateVideo() {
    const prompt = document.getElementById('videoPrompt').value.trim();

    if (!prompt) {
        alert('Please describe the video you want to create!');
        return;
    }

    if (!deductCoins(GENERATION_COSTS.video)) return;

    startQueueProcess('videoOutput');
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
    const tutorialModal = document.getElementById('tutorialModal');
    const unlockConfirmModal = document.getElementById('unlockConfirmModal');
    const earnCoinConfirmModal = document.getElementById('earnCoinConfirmModal');

    if (e.target === tutorialModal) {
        tutorialModal.classList.remove('active');
    }
    if (e.target === unlockConfirmModal) {
        unlockConfirmModal.classList.remove('active');
        pendingUnlockTool = null;
    }
    if (e.target === earnCoinConfirmModal) {
        earnCoinConfirmModal.classList.remove('active');
    }
});

document.getElementById('videoEditInput')?.addEventListener('change', function(e) {
    const files = e.target.files;
    const fileNameDisplay = document.getElementById('videoFileName');
    if (fileNameDisplay) {
        if (files && files.length > 0) {
            if (files.length === 1) {
                fileNameDisplay.textContent = `Selected: ${files[0].name}`;
            } else {
                fileNameDisplay.textContent = `Selected: ${files.length} files`;
            }
        } else {
            fileNameDisplay.textContent = '';
        }
    }
});

document.getElementById('imageEditInput')?.addEventListener('change', function(e) {
    const files = e.target.files;
    const fileNameDisplay = document.getElementById('imageFileName');
    if (fileNameDisplay) {
        if (files && files.length > 0) {
            if (files.length === 1) {
                fileNameDisplay.textContent = `Selected: ${files[0].name}`;
            } else {
                fileNameDisplay.textContent = `Selected: ${files.length} files`;
            }
        } else {
            fileNameDisplay.textContent = '';
        }
    }
});

function goToTools() {
    document.getElementById('homepage').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
}

updateCoinDisplay();
