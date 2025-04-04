class Weapon {
    constructor() {
        this.damage = 10;
        this.fireRate = 0.1;
        this.recoil = 0.05;
        this.bullets = [];
        this.lastFireTime = 0;
        this.isFiring = false;
    }

    fire() {
        const now = Date.now();
        if (now - this.lastFireTime > this.fireRate * 1000) {
            this.lastFireTime = now;
            this.createBullet();
        }
    }

    stopFiring() {
        this.isFiring = false;
    }

    createBullet() {
        // Создание пули
        const bullet = {
            position: new THREE.Vector3().copy(camera.position),
            direction: new THREE.Vector3().copy(camera.getWorldDirection(new THREE.Vector3())),
            speed: 100,
            mesh: new THREE.Mesh(
                new THREE.SphereGeometry(0.05),
                new THREE.MeshBasicMaterial({ color: 0xFFFF00 })
            )
        };
        bullet.mesh.position.copy(bullet.position);
        scene.add(bullet.mesh);
        this.bullets.push(bullet);
    }

    update(deltaTime) {
        // Обновление позиции пуль
        this.bullets.forEach((bullet, index) => {
            bullet.position.addScaledVector(bullet.direction, bullet.speed * deltaTime);
            bullet.mesh.position.copy(bullet.position);
            
            // Удаление пуль, которые улетели далеко
            if (bullet.position.distanceTo(camera.position) > 500) {
                scene.remove(bullet.mesh);
                this.bullets.splice(index, 1);
            }
        });
    }
}

class AK47 extends Weapon {
    constructor() {
        super();
        this.damage = 15;
        this.fireRate = 0.09;
        this.recoil = 0.1;
    }
}
