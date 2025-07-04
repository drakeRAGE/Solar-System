class SolarSystem {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.sun = null;
        this.planets = [];
        this.stars = [];
        this.clock = new THREE.Clock();
        this.isPaused = false;
        this.isDarkMode = true;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.textureLoader = new THREE.TextureLoader();

        // Planet data with realistic properties and orbital inclinations
        this.planetData = {
            mercury: {
            distance: 8,
            size: 1.0, // 0.2 * 5
            speed: 0.02,
            color: 0x8C7853,
            name: "Mercury",
            info: "Closest to the Sun - extreme temperatures",
            textureUrl: "/image/mercury.jpg",
            inclination: 7.0 // degrees
            },
            venus: {
            distance: 12,
            size: 1.5, // 0.3 * 5
            speed: 0.015,
            color: 0xFFA500,
            name: "Venus",
            info: "Hottest planet - toxic atmosphere",
            textureUrl: "/image/venus.jpg",
            inclination: 3.4
            },
            earth: {
            distance: 16,
            size: 1.75, // 0.35 * 5
            speed: 0.01,
            color: 0x4169E1,
            name: "Earth",
            info: "Our home planet - the blue marble",
            textureUrl: "/image/earth.jpg",
            inclination: 0.0
            },
            mars: {
            distance: 20,
            size: 1.25, // 0.25 * 5
            speed: 0.008,
            color: 0xDC143C,
            name: "Mars",
            info: "The red planet - polar ice caps",
            textureUrl: "/image/mars.jpg",
            inclination: 1.9
            },
            jupiter: {
            distance: 28,
            size: 4.0, // 0.8 * 5
            speed: 0.006,
            color: 0xFF8C00,
            name: "Jupiter",
            info: "Largest planet - gas giant with Great Red Spot",
            textureUrl: "/image/jupiter.jpg",
            inclination: 1.3
            },
            saturn: {
            distance: 36,
            size: 3.5, // 0.7 * 5
            speed: 0.005,
            color: 0xDAA520,
            name: "Saturn",
            info: "Planet with rings - gas giant",
            textureUrl: "/image/saturn.jpg",
            inclination: 2.5
            },
            uranus: {
            distance: 44,
            size: 2.5, // 0.5 * 5
            speed: 0.004,
            color: 0x00CED1,
            name: "Uranus",
            info: "Tilted ice giant - rotates on its side",
            textureUrl: "/image/uranus.jpg",
            inclination: 0.8
            },
            neptune: {
            distance: 52,
            size: 2.4, // 0.48 * 5
            speed: 0.003,
            color: 0x0000FF,
            name: "Neptune",
            info: "Windiest planet - ice giant",
            textureUrl: "/image/neptune.jpg",
            inclination: 1.8
            }
        };

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    createPlanetTexture(color, planetName) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Create gradient background
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, `#${color.toString(16).padStart(6, '0')}`);
        gradient.addColorStop(1, `#${Math.floor(color * 0.6).toString(16).padStart(6, '0')}`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // Add planet-specific features
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const radius = Math.random() * 30 + 10;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `#${Math.floor(color * (0.8 + Math.random() * 0.4)).toString(16).padStart(6, '0')}`;
            ctx.fill();
        }

        // Add surface details
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const radius = Math.random() * 10 + 2;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
            ctx.fill();
        }

        return canvas;
    }

    createSunTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Create sun gradient
        const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
        gradient.addColorStop(0, '#ffff00');
        gradient.addColorStop(0.5, '#ff8800');
        gradient.addColorStop(1, '#ff4400');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);

        // Add solar flares
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const radius = Math.random() * 40 + 10;

            const flareGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            flareGradient.addColorStop(0, '#ffffff');
            flareGradient.addColorStop(1, 'transparent');

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = flareGradient;
            ctx.fill();
        }

        return canvas;
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 30, 60);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x000000);
        document.getElementById('container').appendChild(this.renderer.domElement);

        // Create orbit controls
        this.setupOrbitControls();

        // Create sun
        this.createSun();

        // Create planets
        this.createPlanets();

        // Create background stars
        this.createStars();

        // Setup lighting
        this.setupLighting();
    }

    setupOrbitControls() {
        // Simple orbit controls implementation
        this.controls = {
            isMouseDown: false,
            mouseX: 0,
            mouseY: 0,
            rotationX: 0,
            rotationY: 0,
            distance: 80,
            target: new THREE.Vector3(0, 0, 0)
        };

        this.renderer.domElement.addEventListener('mousedown', (e) => {
            this.controls.isMouseDown = true;
            this.controls.mouseX = e.clientX;
            this.controls.mouseY = e.clientY;
        });

        this.renderer.domElement.addEventListener('mouseup', () => {
            this.controls.isMouseDown = false;
        });

        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (!this.controls.isMouseDown) return;

            const deltaX = e.clientX - this.controls.mouseX;
            const deltaY = e.clientY - this.controls.mouseY;

            this.controls.rotationY += deltaX * 0.01;
            this.controls.rotationX += deltaY * 0.01;

            // Limit vertical rotation
            this.controls.rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.controls.rotationX));

            this.controls.mouseX = e.clientX;
            this.controls.mouseY = e.clientY;

            this.updateCameraPosition();
        });

        this.renderer.domElement.addEventListener('wheel', (e) => {
            this.controls.distance += e.deltaY * 0.01;
            this.controls.distance = Math.max(10, Math.min(200, this.controls.distance));
            this.updateCameraPosition();
        });
    }

    updateCameraPosition() {
        const x = this.controls.distance * Math.sin(this.controls.rotationY) * Math.cos(this.controls.rotationX);
        const y = this.controls.distance * Math.sin(this.controls.rotationX);
        const z = this.controls.distance * Math.cos(this.controls.rotationY) * Math.cos(this.controls.rotationX);

        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.controls.target);
    }

    createSun() {
        const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
        const sunTexture = this.textureLoader.load(
            "./image/sun.jpg",
            undefined,
            undefined,
            (err) => {
                console.log("Sun texture failed to load, using fallback");
                // Fallback to generated texture
                const fallbackTexture = new THREE.CanvasTexture(this.createSunTexture());
                this.sun.material.map = fallbackTexture;
                this.sun.material.needsUpdate = true;
            }
        );
        const sunMaterial = new THREE.MeshBasicMaterial({
            map: sunTexture,
            emissive: 0xFFD700,
            emissiveIntensity: 0.3
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.sun.userData = { name: "Sun", info: "Our star - nuclear fusion powers the solar system" };
        this.scene.add(this.sun);
    }

    createPlanets() {
        Object.keys(this.planetData).forEach(planetName => {
            const data = this.planetData[planetName];

            // Create planet geometry
            const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);

            // Load planet texture with fallback
            const planetTexture = this.textureLoader.load(
                data.textureUrl,
                undefined,
                undefined,
                (err) => {
                    console.log(`${planetName} texture failed to load, using color fallback`);
                    // Fallback to solid color
                    const fallbackTexture = new THREE.CanvasTexture(this.createPlanetTexture(data.color, planetName));
                    planet.material.map = fallbackTexture;
                    planet.material.needsUpdate = true;
                }
            );

            const planetMaterial = new THREE.MeshPhongMaterial({
                map: planetTexture,
                shininess: 30
            });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);

            // Set initial position with orbital inclination
            const inclination = (data.inclination * Math.PI) / 180; // Convert to radians
            planet.position.x = data.distance;
            planet.position.y = 0;
            planet.position.z = 0;
            planet.castShadow = true;
            planet.receiveShadow = true;

            // Add planet data including orbital inclination
            planet.userData = {
                name: data.name,
                info: data.info,
                distance: data.distance,
                baseSpeed: data.speed,
                currentSpeed: data.speed,
                angle: Math.random() * Math.PI * 2,
                speedMultiplier: 1,
                inclination: inclination,
                orbitGroup: null // Will store the orbital group
            };

            // Create orbital group for inclination
            const orbitGroup = new THREE.Group();
            orbitGroup.rotation.z = inclination; // Apply orbital inclination
            orbitGroup.add(planet);

            // Store reference to orbit group
            planet.userData.orbitGroup = orbitGroup;

            // Create orbit line (also inclined)
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;

            // Create inclined orbit group
            const orbitRingGroup = new THREE.Group();
            orbitRingGroup.rotation.z = inclination;
            orbitRingGroup.add(orbit);

            // Special case for Saturn - add rings
            if (planetName === 'saturn') {
                const ringGeometry = new THREE.RingGeometry(data.size * 1.2, data.size * 2, 32);
                const ringTexture = this.textureLoader.load(
                    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/saturn_ring_alpha.png",
                    undefined,
                    undefined,
                    (err) => {
                        console.log("Saturn ring texture failed to load");
                    }
                );
                const ringMaterial = new THREE.MeshBasicMaterial({
                    map: ringTexture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                planet.add(rings);
            }

            this.scene.add(orbitGroup);
            this.scene.add(orbitRingGroup);
            this.planets.push(planet);
        });
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 2,
            transparent: true
        });

        const starVertices = [];
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);

        // Point light from sun
        const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
        pointLight.position.set(0, 0, 0);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 2048;
        pointLight.shadow.mapSize.height = 2048;
        this.scene.add(pointLight);
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse events for planet selection
        this.renderer.domElement.addEventListener('click', (event) => {
            if (!this.controls.isMouseDown) {
                this.onMouseClick(event);
            }
        });

        this.renderer.domElement.addEventListener('mousemove', (event) => {
            if (!this.controls.isMouseDown) {
                this.onMouseMove(event);
            }
        });

        // Speed controls
        Object.keys(this.planetData).forEach(planetName => {
            const slider = document.getElementById(planetName);
            const speedValue = slider.nextElementSibling;

            slider.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                speedValue.textContent = `Speed: ${value.toFixed(1)}x`;

                // Update planet speed
                const planet = this.planets.find(p => p.userData.name.toLowerCase() === planetName);
                if (planet) {
                    planet.userData.speedMultiplier = value;
                    planet.userData.currentSpeed = planet.userData.baseSpeed * value;
                }
            });
        });

        // Main controls
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });

        document.getElementById('darkModeBtn').addEventListener('click', () => {
            this.toggleDarkMode();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetSpeeds();
        });
    }

    onMouseClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.sun, ...this.planets]);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.showPlanetInfo(object);
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.sun, ...this.planets]);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
            this.hidePlanetInfo();
        }
    }

    showPlanetInfo(object) {
        const infoPanel = document.getElementById('info-panel');
        const planetName = document.getElementById('planet-name');
        const planetInfo = document.getElementById('planet-info');

        planetName.textContent = object.userData.name;
        planetInfo.textContent = object.userData.info;
        infoPanel.style.display = 'block';
    }

    hidePlanetInfo() {
        const infoPanel = document.getElementById('info-panel');
        infoPanel.style.display = 'none';
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('pauseBtn');
        btn.textContent = this.isPaused ? 'Resume' : 'Pause';
        btn.className = this.isPaused ? 'btn pause' : 'btn';
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        const btn = document.getElementById('darkModeBtn');
        btn.textContent = this.isDarkMode ? 'Light Mode' : 'Dark Mode';

        if (this.isDarkMode) {
            this.renderer.setClearColor(0x000000);
            document.body.style.background = '#000';
        } else {
            this.renderer.setClearColor(0x001122);
            document.body.style.background = '#001122';
        }
    }

    resetSpeeds() {
        Object.keys(this.planetData).forEach(planetName => {
            const slider = document.getElementById(planetName);
            const speedValue = slider.nextElementSibling;

            slider.value = 1;
            speedValue.textContent = 'Speed: 1.0x';

            const planet = this.planets.find(p => p.userData.name.toLowerCase() === planetName);
            if (planet) {
                planet.userData.speedMultiplier = 1;
                planet.userData.currentSpeed = planet.userData.baseSpeed;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (!this.isPaused) {
            const delta = this.clock.getDelta();

            // Rotate sun
            this.sun.rotation.y += 0.005;

            // Update planets with realistic orbital mechanics
            this.planets.forEach(planet => {
                const userData = planet.userData;

                // Update orbit angle
                userData.angle += userData.currentSpeed;

                // Calculate position within the orbital group
                const x = Math.cos(userData.angle) * userData.distance;
                const z = Math.sin(userData.angle) * userData.distance;

                // Update position relative to the orbital group
                planet.position.x = x;
                planet.position.z = z;
                planet.position.y = 0; // Keep y at 0 within the group (inclination handled by group rotation)

                // Rotate planet on its axis
                planet.rotation.y += 0.01;

                // Special rotation for Uranus (tilted on its side)
                if (userData.name === "Uranus") {
                    planet.rotation.z += 0.008;
                }
            });
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the solar system when the page loads
window.addEventListener('load', () => {
    new SolarSystem();
});