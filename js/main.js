// Основной файл игры
let scene, camera, renderer, controls;
let clock, deltaTime;
let player;
let enemies = [];
let currentWeapon;
let score = 0;
let gameStarted = false;

// Настройки графики
const graphicsSettings = {
    quality: 'medium',
    shadows: true,
    antialias: true,
    textureQuality: 'medium',
    renderDistance: 1000
};

// Инициализация игры
function init() {
    // Создание сцены
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Цвет неба
    
    // Настройка камеры
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.y = 1.6; // Примерный рост игрока
    
    // Рендерер
    renderer = new THREE.WebGLRenderer({ antialias: graphicsSettings.antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = graphicsSettings.shadows;
    document.getElementById('renderer').appendChild(renderer.domElement);
    
    // Настройка освещения
    setupLighting();
    
    // Загрузка карты
    loadMap();
    
    // Инициализация игрока
    player = new Player(camera);
    
    // Инициализация оружия
    currentWeapon = new AK47();
    currentWeapon.addToScene(scene);
    
    // Настройка элементов управления
    setupControls();
    
    // Часы для расчета deltaTime
    clock = new THREE.Clock();
    
    // Обработчики событий
    setupEventListeners();
    
    // Начальное меню
    showMenu();
    
    // Запуск игрового цикла
    animate();
}

// Настройка освещения
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Directional light (солнце)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = graphicsSettings.shadows;
    if (graphicsSettings.shadows) {
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
    }
    scene.add(directionalLight);
}

// Загрузка карты (упрощенная версия)
function loadMap() {
    // Пол
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B4513,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Стены и препятствия
    const wallGeometry = new THREE.BoxGeometry(10, 5, 0.5);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    
    for (let i = 0; i < 4; i++) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.set(Math.random() * 80 - 40, 2.5, Math.random() * 80 - 40);
        wall.castShadow = true;
        wall.receiveShadow = true;
        scene.add(wall);
    }
    
    // Некоторые ящики
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xD2691E });
    
    for (let i = 0; i < 10; i++) {
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(Math.random() * 80 - 40, 1, Math.random() * 80 - 40);
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
    }
}

// Настройка элементов управления
function setupControls() {
    controls = new THREE.PointerLockControls(camera, document.body);
    
    document.addEventListener('click', () => {
        if (gameStarted) {
            controls.lock();
        }
    });
    
    controls.addEventListener('lock', () => {
        // Блокировка курсора
    });
    
    controls.addEventListener('unlock', () => {
        // Разблокировка курсора
    });
}

// Обработчики событий
function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    
    // Кнопки меню
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('settings-button').addEventListener('click', showSettings);
    document.getElementById('exit-button').addEventListener('click', exitGame);
    
    // Настройки графики
    document.getElementById('graphics-quality').addEventListener('change', changeGraphicsQuality);
    document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
}

// Игровой цикл
function animate() {
    requestAnimationFrame(animate);
    
    deltaTime = clock.getDelta();
    
    if (gameStarted) {
        // Обновление игрока
        player.update(deltaTime);
        
        // Обновление оружия
        if (currentWeapon) {
            currentWeapon.update(deltaTime);
        }
        
        // Обновление врагов
        updateEnemies(deltaTime);
        
        // Проверка столкновений
        checkCollisions();
    }
    
    renderer.render(scene, camera);
}

// Обработка ввода
function onKeyDown(event) {
    if (!gameStarted) return;
    
    player.onKeyDown(event);
}

function onKeyUp(event) {
    if (!gameStarted) return;
    
    player.onKeyUp(event);
}

function onMouseDown(event) {
    if (!gameStarted || !controls.isLocked) return;
    
    if (event.button === 0 && currentWeapon) { // Левая кнопка мыши
        currentWeapon.fire();
    }
}

function onMouseUp(event) {
    if (!gameStarted || !controls.isLocked) return;
    
    if (event.button === 0 && currentWeapon) {
        currentWeapon.stopFiring();
    }
}

// Обновление размеров при изменении окна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Меню и управление игрой
function showMenu() {
    document.getElementById('menu').style.display = 'flex';
    controls.unlock();
}

function hideMenu() {
    document.getElementById('menu').style.display = 'none';
}

function startGame() {
    hideMenu();
    gameStarted = true;
    controls.lock();
    spawnEnemies(5); // Создать 5 врагов
}

function showSettings() {
    // Здесь можно добавить больше настроек
    alert('Настройки игры (в разработке)');
}

function exitGame() {
    // В веб-версии просто возвращаем в меню
    showMenu();
}

// Управление графикой
function changeGraphicsQuality() {
    const quality = document.getElementById('graphics-quality').value;
    
    switch(quality) {
        case 'low':
            renderer.shadowMap.enabled = false;
            graphicsSettings.antialias = false;
            graphicsSettings.shadows = false;
            graphicsSettings.textureQuality = 'low';
            break;
        case 'medium':
            renderer.shadowMap.enabled = true;
            graphicsSettings.antialias = true;
            graphicsSettings.shadows = true;
            graphicsSettings.textureQuality = 'medium';
            break;
        case 'high':
            renderer.shadowMap.enabled = true;
            graphicsSettings.antialias = true;
            graphicsSettings.shadows = true;
            graphicsSettings.textureQuality = 'high';
            break;
    }
    
    renderer.setPixelRatio(window.devicePixelRatio);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Враги и игровая логика
function spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
        const enemy = new Enemy();
        enemy.position.set(
            Math.random() * 80 - 40,
            0,
            Math.random() * 80 - 40
        );
        scene.add(enemy.mesh);
        enemies.push(enemy);
    }
}

function updateEnemies(deltaTime) {
    enemies.forEach(enemy => {
        enemy.update(deltaTime, player.position);
    });
}

function checkCollisions() {
    // Проверка попаданий пуль
    if (currentWeapon && currentWeapon.bullets) {
        currentWeapon.bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (bullet.position.distanceTo(enemy.position) < 1) {
                    // Попадание
                    enemy.takeDamage(currentWeapon.damage);
                    currentWeapon.bullets.splice(bulletIndex, 1);
                    scene.remove(bullet.mesh);
                    
                    if (enemy.health <= 0) {
                        // Уничтожение врага
                        scene.remove(enemy.mesh);
                        enemies.splice(enemyIndex, 1);
                        score++;
                        document.getElementById('score').textContent = `Убийств: ${score}`;
                        
                        // Спавн нового врага
                        if (Math.random() > 0.5) {
                            spawnEnemies(1);
                        }
                    }
                }
            });
        });
    }
    
    // Проверка попаданий по игроку
    enemies.forEach(enemy => {
        if (enemy.position.distanceTo(player.position) < 2) {
            player.takeDamage(10 * deltaTime);
            document.getElementById('health').textContent = `Здоровье: ${Math.floor(player.health)}`;
        }
    });
}

// Запуск игры при загрузке
window.onload = init;
