import {Physics, Types} from 'phaser'

declare type  updateProps = {
    x: integer,
    y: integer,
    anim: string
}
export default class Actor extends Physics.Arcade.Sprite {
    key!: string
    cursorKeys!: Types.Input.Keyboard.CursorKeys
    speed: integer

    constructor(scene: Phaser.Scene, key: string, cursor: Types.Input.Keyboard.CursorKeys, speed: integer, debug?: boolean) {
        super(scene, 0, 0, key)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.key = key
        this.cursorKeys = cursor
        this.speed = speed
        this.setDebug(!!debug, !!debug, debug ? 3 : 0)
    }

    Resize(x: number, y: number): void {
        this.setScale(x, y)
    }

    InitAnimations(): void {
        const down = this.anims.generateFrameNames(this.key, {
            start: 1,
            end: 2,
            zeroPad: 0,
            prefix: "dark_bald_gray-",
            suffix: ".png",
        });
        const left = this.anims.generateFrameNames(this.key, {
            start: 3,
            end: 5,
            zeroPad: 0,
            prefix: "dark_bald_gray-",
            suffix: ".png",
        });
        const right = this.anims.generateFrameNames(this.key, {
            start: 9,
            end: 11,
            zeroPad: 0,
            prefix: "dark_bald_gray-",
            suffix: ".png",
        });
        const up = this.anims.generateFrameNames(this.key, {
            start: 6,
            end: 8,
            zeroPad: 0,
            prefix: "dark_bald_gray-",
            suffix: ".png",
        });
        this.anims.create({
            key: "down",
            frames: down,
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "left",
            frames: left,
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "right",
            frames: right,
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "up",
            frames: up,
            frameRate: 10,
            repeat: -1,
        });

    }

    Teleport(x: number, y: number) {
        this.setX(x)
        this.setY(y)
    }

    update(): void {
        let loopProp: updateProps = {x: 0, y: 0, anim: ""}
        if (this.cursorKeys.left.isDown) {
            loopProp.x = -this.speed
            loopProp.anim = "left"
        } else if (this.cursorKeys.right.isDown) {
            loopProp.x = this.speed
            loopProp.anim = "right"
        } else if (this.cursorKeys.up.isDown) {
            loopProp.y = -this.speed
            loopProp.anim = "up"
        } else if (this.cursorKeys.down.isDown) {
            loopProp.y = this.speed
            loopProp.anim = "down"
        }
        this.body.velocity.set(loopProp.x, loopProp.y)
        this.body.velocity.normalize().scale(this.speed);
        if (loopProp.anim === "") {
            this.anims.stop()
            this.setTexture(this.key, "dark_bald_gray-0.png");
        } else {
            this.anims.play(loopProp.anim, true)
        }
    }
}