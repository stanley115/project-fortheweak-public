/**
 * display
 */
"use strict";

function Display(scene, config){
    console.log('construct Display Obj');
    config = config || {}
    var element, container, renderer;
    var controls, effect, camera;
    var updateCamera;

    function init(){
        renderer = new THREE.WebGLRenderer({ antialias: true });
        element = renderer.domElement;
        container = document.getElementById('game-div');
    	container.appendChild(element);

        camera = new THREE.PerspectiveCamera(100, 2, 0.1, 700);
    	camera.position.set(0, 10, 0);
    	scene.add(camera);

        if (config.role != 'viewer'){
            effect = new THREE.StereoEffect(renderer);

            controls = new THREE.DeviceOrientationControls(camera, true);
    		controls.connect();
    		controls.update();

            updateCamera = function(){
                var pos = config.player.getCameraPos();
                var dir = config.player.getCameraDir();
                var look = new THREE.Vector3();
                look.addVectors(pos, dir);

                // camera.position.x += 0.1;
                camera.position.x = pos.x;
                camera.position.y = pos.y;
                camera.position.z = pos.z;
                // controls.updateDir(dir);
                controls.align(pos, dir);

                // console.log(pos);
            }

    		element.addEventListener('click', fullscreen, false);
        }else {
            // TODO use other effect in pc mode
            effect = renderer;
            // default use pc view
            controls = new THREE.OrbitControls(camera, element);
        }

        window.addEventListener('resize', resize, false);
    	setTimeout(resize, 1);

        setPublic();

        if (config.callback){
            config.callback();
        }
    }

    function resize() {
    	var width = container.offsetWidth;
    	var height = container.offsetHeight;

    	camera.aspect = width / height;
    	camera.updateProjectionMatrix();

    	renderer.setSize(width, height);
    	effect.setSize(width, height);
    }

    function fullscreen() {
    	if (container.requestFullscreen) {
    		container.requestFullscreen();
    	} else if (container.msRequestFullscreen) {
    		container.msRequestFullscreen();
    	} else if (container.mozRequestFullScreen) {
    		container.mozRequestFullScreen();
    	} else if (container.webkitRequestFullscreen) {
    		container.webkitRequestFullscreen();
    	}
    }

    var firstCall = true;
    function update(dt){
        resize();

        if (updateCamera) updateCamera();
        camera.updateProjectionMatrix();

    	controls.update(dt, firstCall);
        firstCall = false;
    }

    function render(dt){
        effect.render(scene, camera);
    }

    var setPublic = (function(){
        // public
        this.camera = camera;
        this.renderer = renderer;
        this.update = update;
        this.render = render;
        this.controls = controls;
    }).bind(this);

    // run init()
    init();
}

Display.prototype.remove = function () {
    delete this.camera;
    delete this.renderer;
    delete this.controls;
};

module.exports = Display;
