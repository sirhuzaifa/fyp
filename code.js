
import * as THREE from 'three';
import { Mesh } from 'three';
import { Vector3 } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module'


//market glb 2d object link
const Url = new URL('../assets/md2/room.gltf', import.meta.url);

const Url2 = new URL('../assets/md2/self1.gltf', import.meta.url);

const Url3 = new URL('../assets/md2/Glass_Door.gltf', import.meta.url);

const Url4 = new URL('../assets/md2/snackBag.gltf', import.meta.url);

const assetLoader = new GLTFLoader();

let INTERSECTED;
//Move,rotate camera
THREE.FirstPersonControls = function (
    camera,
    MouseMoveSensitivity = 0.002,
    speed = 150.0,
    jumpHeight = 350.0,
    height = 10.0
  ) {
    var scope = this;
  
    scope.MouseMoveSensitivity = MouseMoveSensitivity;
    scope.speed = speed;
    scope.height = height;
    scope.jumpHeight = scope.height + jumpHeight;
    scope.click = false;
  
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;
    var run = false;
  
    var velocity = new THREE.Vector3();
    var direction = new THREE.Vector3();
  
    var prevTime = performance.now();
  
    camera.rotation.set(0, 0, 0);
  
    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);
  
    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add(pitchObject);
  
    var PI_2 = Math.
    PI / 2;
  
    var onMouseMove = function (event) {
      if (scope.enabled === false) return;
  
      var movementX =
        event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      var movementY =
        event.movementY || event.mozMovementY || event.webkitMovementY || 0;
  
      yawObject.rotation.y -= movementX * scope.MouseMoveSensitivity;
      pitchObject.rotation.x -= movementY * scope.MouseMoveSensitivity;
  
      pitchObject.rotation.x = Math.max(
        -PI_2,
        Math.min(PI_2, pitchObject.rotation.x)
      );
    };
  
    var onKeyDown = function (event) {
      if (scope.enabled === false) return;

      
  
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          moveForward = true;
          break;
  
        case 37: // left
        case 65: // a
          moveLeft = true;
          break;
  
        case 40: // down
        case 83: // s
          moveBackward = true;
          break;
  
        case 39: // right
        case 68: // d
          moveRight = true;
          break;
  
        case 32: // space
          if (canJump === true)
            velocity.y +=
              run === false ? scope.jumpHeight : scope.jumpHeight + 50;
          canJump = false;
          break;
  
        case 16: // shift
          run = true;
          break;
      }
    }.bind(this);
  
    var onKeyUp = function (event) {
      if (scope.enabled === false) return;
  
      switch (event.keyCode) {
        case 38: // up
        case 87: // w
          moveForward = false;
          break;
  
        case 37: // left
        case 65: // a
          moveLeft = false;
          break;
  
        case 40: // down
        case 83: // s
          moveBackward = false;
          break;
  
        case 39: // right
        case 68: // d
          moveRight = false;
          break;
  
        case 16: // shift
          run = false;
          break;
      }
    }.bind(this);
  
    var onMouseDownClick = function (event) {
      if (scope.enabled === false) return;
      scope.click = true;
    }.bind(this);
  
    var onMouseUpClick = function (event) {
      if (scope.enabled === false) return;
      scope.click = false;
    }.bind(this);
  
    scope.dispose = function () {
      document.removeEventListener("mousemove", onMouseMove, false);
      document.removeEventListener("keydown", onKeyDown, false);
      document.removeEventListener("keyup", onKeyUp, false);
      document.removeEventListener("mousedown", onMouseDownClick, false);
      document.removeEventListener("mouseup", onMouseUpClick, false);
    };
  
    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
    document.addEventListener("mousedown", onMouseDownClick, false);
    document.addEventListener("mouseup", onMouseUpClick, false);
  
    scope.enabled = false;
  
    scope.getObject = function () {
      return yawObject;
    };
  
    scope.update = function () {
      var time = performance.now();
      var delta = (time - prevTime) / 1000;
  
      velocity.y -= 9.8 * 100.0 * delta;
      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
  
      direction.z = Number(moveForward) - Number(moveBackward);
      direction.x = Number(moveRight) - Number(moveLeft);
      direction.normalize();
  
      var currentSpeed = scope.speed;
      if (run && (moveForward || moveBackward || moveLeft || moveRight))
        currentSpeed = currentSpeed + currentSpeed * 1.1;
  
      if (moveForward || moveBackward)
        velocity.z -= direction.z * currentSpeed * delta;
      if (moveLeft || moveRight) velocity.x -= direction.x * currentSpeed * delta;
  
      scope.getObject().translateX(-velocity.x * delta);
      scope.getObject().translateZ(velocity.z * delta);
  
      scope.getObject().position.y += velocity.y * delta;
  
      if (scope.getObject().position.y < scope.height) {
        velocity.y = 0;
        scope.getObject().position.y = scope.height;
  
        canJump = true;
      }
      prevTime = time;
    };
  };
  
  //show Menu on when application start and click on ESC
  var instructions = document.querySelector("#instructions");
  var havePointerLock =
    "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document;
  if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function (event) {
      if (
        document.pointerLockElement === element ||
        document.mozPointerLockElement === element ||
        document.webkitPointerLockElement === element
      ) {
        controls.enabled = true;
        instructions.style.display = "none";
      } else {
        controls.enabled = false;
        instructions.style.display = "-webkit-box";
      }
    };
    var pointerlockerror = function (event) {
      instructions.style.display = "none";
    };
  
    document.addEventListener("pointerlockchange", pointerlockchange, false);
    document.addEventListener("mozpointerlockchange", pointerlockchange, false);
    document.addEventListener(
      "webkitpointerlockchange",
      pointerlockchange,
      false
    );
    document.addEventListener("pointerlockerror", pointerlockerror, false);
    document.addEventListener("mozpointerlockerror", pointerlockerror, false);
    document.addEventListener("webkitpointerlockerror", pointerlockerror, false);
  
    var play = document.getElementById("play");
    play.addEventListener(
      "click",
      function (event) {
        element.requestPointerLock =
          element.requestPointerLock ||
          element.mozRequestPointerLock ||
          element.webkitRequestPointerLock;
        if (/Firefox/i.test(navigator.userAgent)) {
          var fullscreenchange = function (event) {
            if (
              document.fullscreenElement === element ||
              document.mozFullscreenElement === element ||
              document.mozFullScreenElement === element
            ) {
              document.removeEventListener("fullscreenchange", fullscreenchange);
              document.removeEventListener(
                "mozfullscreenchange",
                fullscreenchange
              );
              element.requestPointerLock();
            }
          };
          document.addEventListener("fullscreenchange", fullscreenchange, false);
          document.addEventListener(
            "mozfullscreenchange",
            fullscreenchange,
            false
          );
          element.requestFullscreen =
            element.requestFullscreen ||
            element.mozRequestFullscreen ||
            element.mozRequestFullScreen ||
            element.webkitRequestFullscreen;
          element.requestFullscreen();
        } else {
          element.requestPointerLock();
        }
      },
      false
    );
  } else {
    instructions.innerHTML = "Your browser not suported PointerLock";
  }
  
  var camera, scene, renderer, controls, raycaster, arrow, world;
  
  init();
  animate();
  
  function init() {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );

    
  
    world = new THREE.Group();
  
    raycaster = new THREE.Raycaster(
      camera.getWorldPosition(new THREE.Vector3()),
      camera.getWorldDirection(new THREE.Vector3())
    );



    arrow = new THREE.ArrowHelper(
      camera.getWorldDirection(new THREE.Vector3()),
      camera.getWorldPosition(new THREE.Vector3()),
      3,
      0x000000
    );
  
  
  
  
  
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    //scene.fog = new THREE.FogExp2 (0xffffff, 0.007);
  
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    renderer.outputEncoding = THREE.sRGBEncoding;
  
    window.addEventListener("resize", onWindowResize, false);
  
    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0, 100, 0.4);
    scene.add(light);
  
    var dirLight = new THREE.SpotLight(0xffffff, 0.5, 0.0, 180.0);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(0, 300, 100);
    dirLight.castShadow = true;
    dirLight.lookAt(new THREE.Vector3());
    scene.add(dirLight);
  
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;
    dirLight.shadow.camera.far = 3000;
  
    //var dirLightHeper = new THREE.SpotLightHelper( dirLight, 10 );
    //scene.add( dirLightHeper );
  
   
    
    controls = new THREE.FirstPersonControls(camera);

    
   
    scene.add(controls.getObject());

    
  
    // floor
  
   // var floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
    //var floorMaterial = new THREE.MeshLambertMaterial();
    //floorMaterial.color.setHSL(0.095, 1, 0.75);
  
    //var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    //floor.rotation.x = -Math.PI / 2;
    //floor.receiveShadow = true;
    //world.add(floor);
  

    camera.position.set(0,2.5,-2.5); // Set position like this




    assetLoader.load(Url.href, function(gltf) {
        const model = gltf.scene;
        model.castShadow = true;
       // model.scale.set(0.03,0.05,0.05);
      
       
        scene.add(model);
    }, undefined, function(error) {
        console.error(error);
    });

    

//shelve 1
    assetLoader.load(Url2.href, function(gltf) {
      const model = gltf.scene;
      model.castShadow = true;
      model.position.set(0,0,110);
      scene.add(model);
      
    //  gltf.scene.scale.set(2,2,2)
    model.traverse(function (node) {
          
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.toneMapped = false;
        node.material.metalness = 0.1;
        node.material.roughness = 1;
        node.material.clearcoat= 0.9;
        node.material.clearcoatRoughness= 0.1;
       // scene.push(node);
         
      }
    });

  }, undefined, function(error) {
      console.error(error);
  });

  

//left shelve 1
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(50,0,110);
  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });
  
  scene.add(model);
}, undefined, function(error) {
  console.error(error);
});


//shelve 2
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(0,0,140);
  scene.add(model);
  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });
}, undefined, function(error) {
  console.error(error);
});

//left shelve 2
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(50,0,140);
  scene.add(model);
  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });

}, undefined, function(error) {
  console.error(error);
});


//shelve 3
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(0,0,170);
  scene.add(model);
  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });

}, undefined, function(error) {
  console.error(error);
});


//left shelve 3
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(50,0,170);
  scene.add(model);
  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });

}, undefined, function(error) {
  console.error(error);
});



//shelve 5
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(0,0,200);
  scene.add(model);

  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });


}, undefined, function(error) {
  console.error(error);
});

//left shelve 5
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(50,0,200);
  scene.add(model);
  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });

}, undefined, function(error) {
  console.error(error);
});



//shelve 6
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(0,0,230);
  scene.add(model);

  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });


}, undefined, function(error) {
  console.error(error);
});

//left shelve 6
assetLoader.load(Url2.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(50,0,230);
  scene.add(model);

  model.traverse(function (node) {
          
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
      node.material.toneMapped = false;
      node.material.metalness = 0.1;
      node.material.roughness = 1;
      node.material.clearcoat= 0.9;
      node.material.clearcoatRoughness= 0.1;
      
       
    }
  });

}, undefined, function(error) {
  console.error(error);
});


//door
assetLoader.load(Url3.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(30,0,260);
  model.rotateY(-600);
  scene.add(model);
  gltf.scene.scale.set(7,7,7);
  model.traverse(function (node) {
          
    if (node.isMesh) {

      node.material.metalness = 0.1;
      node.material.roughness = 1;       
    }
  });
}, undefined, function(error) {
  console.error(error);
});




//snack 1
assetLoader.load(Url4.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(38,9.7,111);
  //model.rotateY(-600);
  scene.add(model);
  gltf.scene.scale.set(7,7,7);
  ;
}, undefined, function(error) {
  console.error(error);
});

//snack 2
assetLoader.load(Url4.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(38,9.7,109);
  //model.rotateY(-600);
  scene.add(model);
  gltf.scene.scale.set(7,7,7);
  ;
}, undefined, function(error) {
  console.error(error);
});


//snack 3
assetLoader.load(Url4.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(38,9.7,107);
  //model.rotateY(-600);
  scene.add(model);
  gltf.scene.scale.set(7,7,7);
  ;
}, undefined, function(error) {
  console.error(error);
});


//snack 4
assetLoader.load(Url4.href, function(gltf) {
  const model = gltf.scene;
  model.castShadow = true;
  model.position.set(38,9.7,113);
  //model.rotateY(-600);
  scene.add(model);
  gltf.scene.scale.set(7,7,7);
  ;
}, undefined, function(error) {
  console.error(error);
});


    
    // objects
  
    var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    boxGeometry.translate(0, 0.5, 0);
  

  
    scene.add(world);
  }
  
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  function animate() {
    requestAnimationFrame(animate);
  
    if (controls.enabled === true) {
      controls.update();
  
      raycaster.set(
        camera.getWorldPosition(new THREE.Vector3()),
        camera.getWorldDirection(new THREE.Vector3())
      );
      scene.remove(arrow);
      arrow = new THREE.ArrowHelper(
        raycaster.ray.direction,
        raycaster.ray.origin,
        5,
        0x000000
      );
      scene.add(arrow);


  


      
    
     const intersects1 = raycaster.intersectObjects( scene.children);
      
     controls.target = new THREE.Vector3(0, 10, 0);
      controls.update();

       if (intersects1.length > 0) {
 
        const distance = camera.position.distanceTo(controls.target); // Note: depending on the order of subtracting, you'll get either forward or backward direction
       

         console.log(parseInt(distance) + " "+ parseInt(intersects1[0].distance));
         if (
             (intersects1[0].distance) < distance
         ) {
            // camera.position.copy(intersects1[0].point)    
            console.log("Obj Deducted!");        
             
         } else {
          controls.update();
        }
     }


      if (controls.click === true) {
        var intersects = raycaster.intersectObjects(scene.children);

        

        
  
        if (intersects.length > 0) {
          var intersect = intersects[0];
          makeParticles(intersect.point);
        }
      }
  
      if (particles.length > 0) {
        
        var pLength = particles.length;
        while (pLength--) {
          particles[pLength].prototype.update(pLength);
        }
      }
    }
  
    renderer.render(scene, camera);
  }
  
  var particles = new Array();
  
  function makeParticles(intersectPosition) {
    var totalParticles = 80;
  
    var pointsGeometry = new THREE.Geometry();
    pointsGeometry.oldvertices = [];
    var colors = [];
    for (var i = 0; i < totalParticles; i++) {
      var position = randomPosition(Math.random());
      var vertex = new THREE.Vector3(position[0], position[1], position[2]);
      pointsGeometry.oldvertices.push([0, 0, 0]);
      pointsGeometry.vertices.push(vertex);
  
      var color = new THREE.Color(Math.random() * 0xffffff);
      colors.push(color);
    }
    pointsGeometry.colors = colors;
  
    var pointsMaterial = new THREE.PointsMaterial({
      size: 0.8,
      sizeAttenuation: true,
      depthWrite: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexColors: THREE.VertexColors
    });
  
    var points = new THREE.Points(pointsGeometry, pointsMaterial);
  
    points.prototype = Object.create(THREE.Points.prototype);
    points.position.x = intersectPosition.x;
    points.position.y = intersectPosition.y;
    points.position.z = intersectPosition.z;
    points.updateMatrix();
    points.matrixAutoUpdate = false;
  
    points.prototype.constructor = points;
    points.prototype.update = function (index) {
      var pCount = this.constructor.geometry.vertices.length;
      var positionYSum = 0;
      while (pCount--) {
        var position = this.constructor.geometry.vertices[pCount];
        var oldPosition = this.constructor.geometry.oldvertices[pCount];
  
        var velocity = {
          x: position.x - oldPosition[0],
          y: position.y - oldPosition[1],
          z: position.z - oldPosition[2]
        };
  
        var oldPositionX = position.x;
        var oldPositionY = position.y;
        var oldPositionZ = position.z;
  
        position.y -= 0.03; // gravity
  
        position.x += velocity.x;
        position.y += velocity.y;
        position.z += velocity.z;
  
        var wordlPosition = this.constructor.position.y + position.y;
  
        if (wordlPosition <= 0) {
          //particle touched the ground
          oldPositionY = position.y;
          position.y = oldPositionY - velocity.y * 0.3;
  
          positionYSum += 1;
        }
  
        this.constructor.geometry.oldvertices[pCount] = [
          oldPositionX,
          oldPositionY,
          oldPositionZ
        ];
      }
  
      pointsGeometry.verticesNeedUpdate = true;
  
      if (positionYSum >= totalParticles) {
        particles.splice(index, 1);
        scene.remove(this.constructor);
        console.log("particle removed");
      }
    };
    particles.push(points);
    scene.add(points);
  }
  
  function randomPosition(radius) {
    radius = radius * Math.random();
    var theta = Math.random() * 2.0 * Math.PI;
    var phi = Math.random() * Math.PI;
  
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);
    var sinPhi = Math.sin(phi);
    var cosPhi = Math.cos(phi);
    var x = radius * sinPhi * cosTheta;
    var y = radius * sinPhi * sinTheta;
    var z = radius * cosPhi;
  
    return [x, y, z];
  }
  
  var Controlers = function () {
    this.MouseMoveSensitivity = 0.002;
    this.speed = 800.0;
    this.jumpHeight = 350.0;
    this.height = 30.0;
  };
  
  window.onload = function () {
    var controler = new Controlers();
    var gui = new dat.GUI();
    gui
      .add(controler, "MouseMoveSensitivity", 0, 1)
      .step(0.001)
      .name("Mouse Sensitivity")
      .onChange(function (value) {
        controls.MouseMoveSensitivity = value;
      });
    gui
      .add(controler, "speed", 1, 8000)
      .step(1)
      .name("Speed")
      .onChange(function (value) {
        controls.speed = value;
      });
    gui
      .add(controler, "jumpHeight", 0, 2000)
      .step(1)
      .name("Jump Height")
      .onChange(function (value) {
        controls.jumpHeight = value;
      });
    gui
      .add(controler, "height", 1, 3000)
      .step(1)
      .name("Play Height")
      .onChange(function (value) {
        controls.height = value;
        camera.updateProjectionMatrix();
      });
  };
  
