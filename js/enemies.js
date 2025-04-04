class Enemy {
    constructor() {
        this.health = 100;
        this.speed = 2;
        this.position = new THREE.Vector3();
        this.mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 2),
            new THREE.MeshStandardMaterial({ color: 0xFF0000 })
        );
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }

    update(deltaTime, playerPosition) {
        // Простое преследование игрока
        const direction = new THREE.Vector3().subVectors(playerPosition, this.position);
        direction.y = 0;
        direction.normalize();
        
        this.position.addScaledVector(direction, this.speed * deltaTime);
        this.mesh.position.copy(this.position);
    }

    takeDamage(amount) {
        this.health -= amount;
    }
}
