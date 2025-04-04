class Player {
    constructor(camera) {
        this.camera = camera;
        this.position = camera.position.clone();
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.moveSpeed = 5;
        this.jumpSpeed = 7;
        this.health = 100;
        this.isGrounded = false;
        this.keys = {};
        
        // Физика
        this.gravity = -30;
    }
    
    update(deltaTime) {
        // Движение
        this.velocity.x = 0;
        this.velocity.z = 0;
        
        if (this.keys['KeyW']) {
            this.velocity.z -= this.moveSpeed;
        }
        if (this.keys['KeyS']) {
            this.velocity.z += this.moveSpeed;
        }
        if (this.keys['KeyA']) {
            this.velocity.x -= this.moveSpeed;
        }
        if (this.keys['KeyD']) {
            this.velocity.x += this.moveSpeed;
        }
        
        // Применение направления камеры
        this.direction.set(this.velocity.x, 0, this.velocity.z);
        this.direction.normalize();
        this.d
