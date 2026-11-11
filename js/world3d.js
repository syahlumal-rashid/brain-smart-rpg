// ============================================================================
// BRAIN SMART RPG v3.0 — 3D CARTOON STYLIZED ENGINE (Three.js) (js/world3d.js)
// Supports: 1) 3D Main Lobby Character Podium  2) 3D Brain Academy World (13 Locations)
// ============================================================================

window.World3D = (function () {
  let scene, camera, renderer, clock;
  let playerGroup, hairMesh, bodyMesh, bagMesh, hatMesh, petMesh;
  let leftArm, rightArm, leftLeg, rightLeg;
  let lobbyGroup, adventureGroup;
  let mode = "lobby"; // "lobby" | "adventure"
  let emoteTimer = 0;
  let currentEmote = "idle";

  // Movement & Input State for Adventure Mode
  const keys = { w: false, a: false, s: false, d: false, shift: false };
  const joyVector = { x: 0, z: 0, active: false };
  let isRunning = false;
  let nearestLocation = null;
  const npcMeshes = [];
  const buildingMarkers = [];

  function init(canvasContainerId) {
    const el = document.getElementById(canvasContainerId);
    if (!el || typeof THREE === "undefined") return;

    let targetCanvas;
    if (el.tagName && el.tagName.toLowerCase() === "canvas") {
      targetCanvas = el;
    } else {
      el.innerHTML = "";
      targetCanvas = document.createElement("canvas");
      targetCanvas.id = "threejs-canvas";
      el.appendChild(targetCanvas);
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7dd3fc);
    scene.fog = new THREE.FogExp2(0x7dd3fc, 0.0085);

    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      250
    );

    renderer = new THREE.WebGLRenderer({
      canvas: targetCanvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    clock = new THREE.Clock();

    // Lighting (Bright Cartoon Stylized)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.78);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 0.95);
    dirLight.position.set(25, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Build Scenes
    lobbyGroup = new THREE.Group();
    adventureGroup = new THREE.Group();
    scene.add(lobbyGroup);
    scene.add(adventureGroup);

    buildLobbyEnvironment();
    buildAdventureWorld();
    buildPlayerCharacter();

    setMode("lobby");
    setupInputs();

    window.addEventListener("resize", onResize);
    animate();
  }

  // Create Stylized 3D Cartoon Character
  function buildPlayerCharacter() {
    playerGroup = new THREE.Group();

    const skinMat = new THREE.MeshToonMaterial({ color: 0xffdcb1 });
    const uniformMat = new THREE.MeshToonMaterial({ color: 0x3b82f6 });
    const pantsMat = new THREE.MeshToonMaterial({ color: 0x1e293b });
    const hairMat = new THREE.MeshToonMaterial({ color: 0x1f2937 });
    const bagMat = new THREE.MeshToonMaterial({ color: 0xf59e0b });
    const shoeMat = new THREE.MeshToonMaterial({ color: 0xffffff });

    // Torso (Uniform)
    bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.15, 0.55), uniformMat);
    bodyMesh.position.y = 1.45;
    bodyMesh.castShadow = true;
    playerGroup.add(bodyMesh);

    // Collar / Tie detail
    const tieMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.45, 0.58),
      new THREE.MeshToonMaterial({ color: 0xef4444 })
    );
    tieMesh.position.set(0, 1.55, 0.02);
    playerGroup.add(tieMesh);

    // Head
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.52, 20, 20), skinMat);
    headMesh.position.y = 2.48;
    headMesh.castShadow = true;
    playerGroup.add(headMesh);

    // Eyes (Cartoon stylized)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), eyeMat);
    leftEye.position.set(-0.17, 2.52, 0.46);
    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), eyeMat);
    rightEye.position.set(0.17, 2.52, 0.46);
    playerGroup.add(leftEye, rightEye);

    // Hair
    hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.56, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat);
    hairMesh.position.y = 2.54;
    hairMesh.rotation.x = -0.15;
    playerGroup.add(hairMesh);

    // Hat / Graduation Cap (Accessory)
    hatMesh = new THREE.Group();
    const capBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.15, 16),
      new THREE.MeshToonMaterial({ color: 0x1e1b4b })
    );
    const capTop = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.06, 0.95),
      new THREE.MeshToonMaterial({ color: 0x1e1b4b })
    );
    capTop.position.y = 0.09;
    hatMesh.add(capBase, capTop);
    hatMesh.position.y = 3.02;
    hatMesh.visible = false;
    playerGroup.add(hatMesh);

    // School Backpack
    bagMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.82, 0.38), bagMat);
    bagMesh.position.set(0, 1.5, -0.42);
    bagMesh.castShadow = true;
    playerGroup.add(bagMesh);

    // Arms
    leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 0.28), uniformMat);
    leftArm.position.set(-0.66, 1.48, 0);
    rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 0.28), uniformMat);
    rightArm.position.set(0.66, 1.48, 0);
    playerGroup.add(leftArm, rightArm);

    // Legs & Shoes
    leftLeg = new THREE.Group();
    const lLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.85, 0.34), pantsMat);
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.5), shoeMat);
    lShoe.position.set(0, -0.4, 0.06);
    leftLeg.add(lLegMesh, lShoe);
    leftLeg.position.set(-0.24, 0.52, 0);

    rightLeg = new THREE.Group();
    const rLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.85, 0.34), pantsMat);
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.22, 0.5), shoeMat);
    rShoe.position.set(0, -0.4, 0.06);
    rightLeg.add(rLegMesh, rShoe);
    rightLeg.position.set(0.24, 0.52, 0);

    playerGroup.add(leftLeg, rightLeg);

    // Pet Companion (Floating Owl / Drone)
    petMesh = new THREE.Group();
    const petBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshToonMaterial({ color: 0xa855f7 })
    );
    const petWingL = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.08, 0.18),
      new THREE.MeshToonMaterial({ color: 0xfacc15 })
    );
    petWingL.position.set(-0.32, 0, 0);
    const petWingR = petWingL.clone();
    petWingR.position.set(0.32, 0, 0);
    petMesh.add(petBody, petWingL, petWingR);
    petMesh.position.set(1.25, 2.4, 0.3);
    petMesh.visible = false;
    playerGroup.add(petMesh);

    scene.add(playerGroup);
  }

  function buildLobbyEnvironment() {
    // Glowing RPG Podium
    const baseGeo = new THREE.CylinderGeometry(2.3, 2.7, 0.45, 32);
    const baseMat = new THREE.MeshToonMaterial({ color: 0x1e293b });
    const podium = new THREE.Mesh(baseGeo, baseMat);
    podium.position.y = -0.22;
    podium.receiveShadow = true;
    lobbyGroup.add(podium);

    const ringGeo = new THREE.RingGeometry(1.9, 2.25, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    lobbyGroup.add(ring);

    // Decorative background pillars & trees for school courtyard look
    const grassGeo = new THREE.CircleGeometry(35, 32);
    const grassMat = new THREE.MeshToonMaterial({ color: 0x4ade80 });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.45;
    grass.receiveShadow = true;
    lobbyGroup.add(grass);

    // School Archway behind character
    const archMat = new THREE.MeshToonMaterial({ color: 0xf8fafc });
    const roofMat = new THREE.MeshToonMaterial({ color: 0x2563eb });
    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.5, 1.2), archMat);
    pillarL.position.set(-4.2, 2.3, -6.5);
    const pillarR = pillarL.clone();
    pillarR.position.set(4.2, 2.3, -6.5);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(6.8, 2.5, 4), roofMat);
    roof.position.set(0, 6.2, -6.5);
    roof.rotation.y = Math.PI / 4;
    lobbyGroup.add(pillarL, pillarR, roof);
  }

  function buildAdventureWorld() {
    // Main Campus Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(140, 140),
      new THREE.MeshToonMaterial({ color: 0x4ade80 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    adventureGroup.add(ground);

    // Stone Roads Cross
    const roadMat = new THREE.MeshToonMaterial({ color: 0x94a3b8 });
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(7, 90), roadMat);
    roadNS.rotation.x = -Math.PI / 2;
    roadNS.position.y = 0.02;
    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(95, 7), roadMat);
    roadEW.rotation.x = -Math.PI / 2;
    roadEW.position.y = 0.02;
    adventureGroup.add(roadNS, roadEW);

    // Central Plaza Circle
    const plaza = new THREE.Mesh(
      new THREE.CircleGeometry(10, 32),
      new THREE.MeshToonMaterial({ color: 0xcbd5e1 })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.03;
    adventureGroup.add(plaza);

    // Build all 13 World Locations from GDD Section 2.1
    const locs = window.GAME_DATA.worldLocations || [];
    locs.forEach((loc) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(loc.x, 0, loc.z);

      // Building Body
      const isMain = loc.id === 1;
      const w = isMain ? 9 : 6.5;
      const h = isMain ? 5.5 : 4.2;
      const d = isMain ? 6 : 5;

      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshToonMaterial({ color: 0xf8fafc })
      );
      wall.position.y = h / 2;
      wall.castShadow = true;
      wall.receiveShadow = true;
      bGroup.add(wall);

      // Colored Roof
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(w * 0.78, 2.4, 4),
        new THREE.MeshToonMaterial({ color: loc.color || 0x3b82f6 })
      );
      roof.position.y = h + 1.1;
      roof.rotation.y = Math.PI / 4;
      bGroup.add(roof);

      // Door
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.3, 0.2),
        new THREE.MeshToonMaterial({ color: loc.color || 0x2563eb })
      );
      door.position.set(0, 1.15, d / 2 + 0.05);
      bGroup.add(door);

      // NPC standing in front of location
      const npc = createStylizedNPC(loc.color || 0x2563eb);
      npc.position.set(0, 0, d / 2 + 2.1);
      bGroup.add(npc);
      npcMeshes.push(npc);

      // Floating Marker above NPC
      const marker = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.38, 0),
        new THREE.MeshBasicMaterial({ color: 0xfacc15 })
      );
      marker.position.set(0, 3.3, d / 2 + 2.1);
      bGroup.add(marker);
      buildingMarkers.push(marker);

      adventureGroup.add(bGroup);
    });

    // Stylized Campus Trees around perimeter
    const treePositions = [
      [-10, -14], [10, -14], [-10, 14], [10, 14],
      [-22, -6], [22, -6], [-22, 6], [22, 6],
      [-34, -12], [34, -12], [-34, 12], [34, 12],
      [-12, -26], [12, -26], [-12, 26], [12, 26]
    ];
    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.5, 2.2, 8),
        new THREE.MeshToonMaterial({ color: 0x78350f })
      );
      trunk.position.y = 1.1;
      const leaves = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.65, 1),
        new THREE.MeshToonMaterial({ color: 0x16a34a })
      );
      leaves.position.y = 3.1;
      leaves.castShadow = true;
      tree.add(trunk, leaves);
      tree.position.set(tx, 0, tz);
      adventureGroup.add(tree);
    });
  }

  function createStylizedNPC(coatColor) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.45, 1.35, 12),
      new THREE.MeshToonMaterial({ color: coatColor })
    );
    body.position.y = 0.95;
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 14, 14),
      new THREE.MeshToonMaterial({ color: 0xffdcb1 })
    );
    head.position.y = 1.95;
    g.add(body, head);
    return g;
  }

  // Apply Player Customization to 3D Mesh
  function updateCharacterAppearance(profileData) {
    if (!playerGroup || !profileData) return;

    const profile = profileData.equipped ? profileData : { equipped: profileData };
    const eq = profile.equipped || {};

    // Hair color
    if (hairMesh) {
      if (profile.hairColor) {
        hairMesh.material.color.set(profile.hairColor);
      }
    }

    // Uniform / Skin color
    let uniformHex = 0x3b82f6;
    const skinId = eq.skin || eq.uniform || profile.equippedSkin;
    const eqSkin = window.GAME_DATA.shopItems.find((i) => i.id === skinId);
    if (eqSkin && eqSkin.color) {
      uniformHex = eqSkin.color;
    } else {
      const eduId = profile.educationLevel || "sd";
      const edu = window.GAME_DATA.educationLevels.find((e) => e.id === eduId);
      if (edu && edu.uniformColor) uniformHex = edu.uniformColor;
    }
    if (bodyMesh) bodyMesh.material.color.setHex(uniformHex);
    if (leftArm) leftArm.material.color.setHex(uniformHex);
    if (rightArm) rightArm.material.color.setHex(uniformHex);

    // Bag color & visibility
    if (bagMesh) {
      const bagId = eq.bag || profile.equippedBag;
      const bagItem = window.GAME_DATA.shopItems.find((i) => i.id === bagId);
      if (bagItem && bagItem.color) {
        bagMesh.material.color.setHex(bagItem.color);
        bagMesh.visible = true;
      } else {
        bagMesh.visible = bagId !== "none" && bagId !== "bag_none";
      }
    }

    // Hat / Accessory
    if (hatMesh) {
      const hatId = eq.hat || profile.equippedHat;
      hatMesh.visible = !!(hatId && hatId !== "none" && hatId !== "hat_none");
    }

    // Pet Companion
    if (petMesh) {
      const petId = eq.pet || profile.equippedPet;
      const petItem = window.GAME_DATA.shopItems.find((i) => i.id === petId);
      if (petItem && petItem.id !== "pet_none" && petItem.color) {
        petMesh.visible = true;
        if (petMesh.children && petMesh.children[0]) {
          petMesh.children[0].material.color.setHex(petItem.color);
        }
      } else {
        petMesh.visible = false;
      }
    }
  }

  function triggerEmote(emoteName) {
    currentEmote = emoteName || "wave";
    emoteTimer = 2.0;
  }

  function setMode(newMode) {
    mode = newMode;
    if (!lobbyGroup || !adventureGroup || !playerGroup) return;

    if (mode === "lobby") {
      lobbyGroup.visible = true;
      adventureGroup.visible = false;
      playerGroup.position.set(0, 0, 0);
      playerGroup.rotation.set(0, 0, 0);
      camera.position.set(0, 2.15, 5.2);
      camera.lookAt(0, 1.65, 0);
    } else if (mode === "adventure") {
      lobbyGroup.visible = false;
      adventureGroup.visible = true;
      playerGroup.position.set(0, 0, 6);
      playerGroup.rotation.set(0, Math.PI, 0);
    }
  }

  function teleportToLocation(locId) {
    const loc = window.GAME_DATA.worldLocations.find((l) => l.id === locId);
    if (!loc || !playerGroup) return;
    playerGroup.position.set(loc.x, 0, loc.z + 6.5);
    playerGroup.rotation.y = Math.PI;
  }

  function setupInputs() {
    window.addEventListener("keydown", (e) => {
      const k = e.key.toLowerCase();
      if (k === "w" || e.key === "ArrowUp") keys.w = true;
      if (k === "s" || e.key === "ArrowDown") keys.s = true;
      if (k === "a" || e.key === "ArrowLeft") keys.a = true;
      if (k === "d" || e.key === "ArrowRight") keys.d = true;
      if (e.key === "Shift") keys.shift = true;
      if (k === "e" && mode === "adventure" && nearestLocation) {
        if (window.App && window.App.interactWithLocation) {
          window.App.interactWithLocation(nearestLocation);
        }
      }
    });

    window.addEventListener("keyup", (e) => {
      const k = e.key.toLowerCase();
      if (k === "w" || e.key === "ArrowUp") keys.w = false;
      if (k === "s" || e.key === "ArrowDown") keys.s = false;
      if (k === "a" || e.key === "ArrowLeft") keys.a = false;
      if (k === "d" || e.key === "ArrowRight") keys.d = false;
      if (e.key === "Shift") keys.shift = false;
    });
  }

  function setJoystickInput(dx, dz, active) {
    joyVector.x = dx;
    joyVector.z = dz;
    joyVector.active = active;
  }

  function toggleSprint() {
    isRunning = !isRunning;
    return isRunning;
  }

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.1);
    const elapsed = clock.getElapsedTime();

    if (!playerGroup) return;

    // Pet companion bobbing
    if (petMesh && petMesh.visible) {
      petMesh.position.y = 2.35 + Math.sin(elapsed * 4) * 0.18;
      petMesh.rotation.y = Math.sin(elapsed * 2) * 0.4;
    }

    if (mode === "lobby") {
      // Gentle idle rotation or emote animation
      if (emoteTimer > 0) {
        emoteTimer -= dt;
        if (rightArm) rightArm.rotation.z = 2.4 + Math.sin(elapsed * 14) * 0.4;
        playerGroup.position.y = Math.abs(Math.sin(elapsed * 8)) * 0.35;
        playerGroup.rotation.y += dt * 4;
      } else {
        if (rightArm) rightArm.rotation.z = 0;
        if (leftArm) leftArm.rotation.x = Math.sin(elapsed * 2) * 0.06;
        if (rightArm) rightArm.rotation.x = -Math.sin(elapsed * 2) * 0.06;
        playerGroup.position.y = 0;
        playerGroup.rotation.y = Math.sin(elapsed * 0.65) * 0.35;
      }
    } else if (mode === "adventure") {
      // Rotate markers
      buildingMarkers.forEach((m) => {
        m.rotation.y += dt * 2.2;
        m.position.y = 3.3 + Math.sin(elapsed * 3.5) * 0.2;
      });

      // Calculate movement vector
      let mx = 0;
      let mz = 0;
      if (keys.w) mz -= 1;
      if (keys.s) mz += 1;
      if (keys.a) mx -= 1;
      if (keys.d) mx += 1;

      if (joyVector.active) {
        mx = joyVector.x;
        mz = joyVector.z;
      }

      const len = Math.hypot(mx, mz);
      const speed = (keys.shift || isRunning) ? 13.5 : 8.0;

      if (len > 0.05) {
        mx /= len;
        mz /= len;
        playerGroup.position.x = Math.max(-52, Math.min(52, playerGroup.position.x + mx * speed * dt));
        playerGroup.position.z = Math.max(-42, Math.min(42, playerGroup.position.z + mz * speed * dt));

        // Rotate character towards movement direction
        const targetAngle = Math.atan2(mx, mz);
        playerGroup.rotation.y = targetAngle;

        // Walk/Run leg & arm swing animation
        const swingSpeed = (keys.shift || isRunning) ? 14 : 9;
        if (leftLeg) leftLeg.rotation.x = Math.sin(elapsed * swingSpeed) * 0.65;
        if (rightLeg) rightLeg.rotation.x = -Math.sin(elapsed * swingSpeed) * 0.65;
        if (leftArm) leftArm.rotation.x = -Math.sin(elapsed * swingSpeed) * 0.55;
        if (rightArm) rightArm.rotation.x = Math.sin(elapsed * swingSpeed) * 0.55;
      } else {
        if (leftLeg) leftLeg.rotation.x = 0;
        if (rightLeg) rightLeg.rotation.x = 0;
        if (leftArm) leftArm.rotation.x = 0;
        if (rightArm) rightArm.rotation.x = 0;
      }

      // Smooth 3rd-Person Follow Camera
      const targetCamX = playerGroup.position.x;
      const targetCamZ = playerGroup.position.z + 11.5;
      camera.position.x += (targetCamX - camera.position.x) * 0.12;
      camera.position.z += (targetCamZ - camera.position.z) * 0.12;
      camera.position.y = 7.2;
      camera.lookAt(playerGroup.position.x, 1.5, playerGroup.position.z);

      // Proximity check to 13 World Locations
      let closest = null;
      let minDist = 7.5;
      const worldLocs = window.GAME_DATA.worldLocations || [];
      worldLocs.forEach((loc) => {
        const d = Math.hypot(playerGroup.position.x - loc.x, playerGroup.position.z - (loc.z + 3.5));
        if (d < minDist) {
          minDist = d;
          closest = loc;
        }
      });

      if (closest !== nearestLocation) {
        nearestLocation = closest;
        if (window.App && window.App.onProximityLocationChange) {
          window.App.onProximityLocationChange(nearestLocation);
        }
      }
    }

    renderer.render(scene, camera);
  }

  function onResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  return {
    init,
    setMode,
    updateCharacterAppearance,
    triggerEmote,
    teleportToLocation,
    setJoystickInput,
    toggleSprint
  };
})();
