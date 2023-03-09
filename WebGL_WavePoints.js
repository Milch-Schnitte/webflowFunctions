/**WebGL WavePoints **/

/* init Code 
<script>
  var backgroundColor = "0x535353";
  var pointsColor = "0xffffff";
  var SEPARATION = 100,
    AMOUNTX = 100,
    AMOUNTY = 100;
  var camera, scene, renderer;
  var particles,
    count = 0;
  var mouseX = 0,
    mouseY = 0;
  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;
  bg_waves = document.getElementById("bg-waves");
  init(bg_waves,backgroundColor,pointsColor);
  animate();
</script>

<script
  src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r99/three.min.js"
  integrity="sha512-0tlhMhMGPohLm/YwaskxH7jJuUGqU/XPTl+HE0dWrhGbpEBRIZYMQdbHC0CmyNPzZKTBd8JoVZnvMcL7hzlFOg=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
<script src="https://cdn.jsdelivr.net/gh/webflow/brand_studio@latest/resources/enterprise-threejs-addons.min.js"></script>

<script type="x-shader/x-vertex" id="vertexshader">
   attribute float scale;
  void main() {
  	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  	gl_PointSize = scale * ( 300.0 / - mvPosition.z );
  	gl_Position = projectionMatrix * mvPosition;
  }
</script>

<script type="x-shader/x-fragment" id="fragmentshader">
   uniform vec3 color;
  void main() {
  	if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
  	gl_FragColor = vec4( color, 1.0 );
  }
</script>

*/
function init(element, color1,color2) {
    bg_waves = element;
    container = document.createElement("div");
    bg_waves.appendChild(container);
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 1200;
    scene = new THREE.Scene();
    // Background color //
    scene.background = new THREE.Color(color1);
    var numParticles = AMOUNTX * AMOUNTY;
    var positions = new Float32Array(numParticles * 3);
    var scales = new Float32Array(numParticles);
    var i = 0,
      j = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
        positions[i + 1] = 0; // y
        positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
        scales[j] = 1;
        i += 3;
        j++;
      }
    }
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute("scale", new THREE.BufferAttribute(scales, 1));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        color: {
          value: new THREE.Color(color2),
        },
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
    });
    //
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particles.rotation.x = 1000;
    //
    renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
   // document.addEventListener("touchstart", onDocumentTouchStart, false);
   // document.addEventListener("touchmove", onDocumentTouchMove, false);
    //
    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  //
  function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }
/*
  function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }
  */
  //
  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    var positions = particles.geometry.attributes.position.array;
    var scales = particles.geometry.attributes.scale.array;
    var i = 0,
      j = 0;
    for (var ix = 0; ix < AMOUNTX; ix++) {
      for (var iy = 0; iy < AMOUNTY; iy++) {
        positions[i + 1] =
          Math.sin((ix + count) * 0.3) * 50 + Math.sin((iy + count) * 0.5) * 50;
        scales[j] =
          (Math.sin((ix + count) * 0.3) + 1) * 8 +
          (Math.sin((iy + count) * 0.5) + 1) * 8;
        i += 3;
        j++;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.geometry.attributes.scale.needsUpdate = true;
    renderer.render(scene, camera);
    // Speed //
    count += 0.04;
  }


  