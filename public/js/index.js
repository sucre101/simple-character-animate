export const app = function () {
    document.addEventListener('DOMContentLoaded', () => {
        const body = document.querySelector('body');
        const character = document.createElement('img')
        const scene = document.createElement('div');

        scene.setAttribute('id', 'scene');
        body.appendChild(scene);

        const STATE_DROP = 1;
        const STATE_PIT = 2;
        const STATE_FINISH = 3;

        let state = null;
        let obstacle = null;

        const obstacles = [STATE_DROP, STATE_PIT, STATE_FINISH];
        const randomObstacle = obstacles.sort(() => Math.random() - 0.5);

        const generateRandomLength = (min, max) => {
            return Math.random() * (max - min) + min
        }

        if (randomObstacle[0] !== STATE_FINISH) {
            obstacle = document.createElement(randomObstacle[0] === STATE_DROP ? 'img' : 'div')
            obstacle.style.position = 'absolute';
            obstacle.style.left = `${generateRandomLength(200, 1000)}px`;
            obstacle.style.width = randomObstacle[0] === STATE_DROP ? '180px' : '100px';
            obstacle.style.height = randomObstacle[0] === STATE_DROP ? 'auto' : '70px';
            obstacle.style.bottom = randomObstacle[0] === STATE_DROP ? '80px' : '0';
            obstacle.classList.add(randomObstacle[0] === STATE_DROP ? 'wolf' : 'pit')
            obstacle.style.background = randomObstacle[0] === STATE_DROP ? 'none' : '#ffffff';

            if (randomObstacle[0] === STATE_DROP) {
                obstacle.setAttribute('src', '/public/images/wolf.png');
            }
        }

        let finish = document.createElement('div')
        finish.style.height = '25px';
        finish.style.background = "#b16e5b";
        finish.style.position = 'absolute';
        finish.style.bottom = '145px';
        finish.style.transform = 'rotate3d(1, 1, 1, 38deg)';
        finish.style.width = '250px';
        finish.style.right = '0';
        finish.innerText = 'FINISH';
        finish.style.textAlign = 'center';
        finish.style.fontWeight = 'bold';
        finish.style.fontSize = '18px';

        if (obstacle) scene.appendChild(obstacle);
        scene.appendChild(finish);

        character.setAttribute('src', '/public/images/colobok.png')
        character.classList.add('spin-forward')
        let moveX = 0;
        let moveY = 0;

        let bounce = () => {
            let margin = 150;
            let finish = parseInt(character.style.left) - margin;
            let gamerStyles = getComputedStyle(character);
            let c = 0;

            const animateBounce = () => {
                if (parseInt(character.style.left) !== finish) {
                    c += 1;
                    character.style.left = `${parseInt(character.style.left) - 2}px`;
                    if (margin / 4 > c) {
                        character.style.bottom = `${parseInt(gamerStyles.bottom) + 2}px`
                    }
                    if (margin / 4 < c) {
                        character.style.bottom = `${parseInt(gamerStyles.bottom) - 2}px`
                    }
                }
                if (parseInt(character.style.left) !== finish) {
                    requestAnimationFrame(animateBounce);
                }
            };
            animateBounce();
        }

        const animate = () => {
            if (state !== 1 && state !== 2) {
                moveX = moveX + 2;
                character.style.left = `${moveX}px`;
                requestAnimationFrame(animate);
            }

            if (state === 1) {
                moveY = moveY + 2;
                character.style.bottom = `-${moveY}px`;
                requestAnimationFrame(animate);
            }

            if (scene.firstChild.classList.contains('pit') && parseInt(obstacle.style.left) < parseInt(character.style.left)) {
                state = 1;
                character.style.animationPlayState = 'paused';
            }

            if (scene.firstChild.classList.contains('wolf') && parseInt(obstacle.style.left) - 60 < parseInt(character.style.left)) {
                state = 2;
                bounce();
                character.style.animationPlayState = 'paused';
            }

            if (moveX > scene.getBoundingClientRect().width - 50) {
                character.style.animationPlayState = 'paused';
            }
        }

        scene.append(character);
        animate();
    });
}