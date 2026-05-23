function hodiny() {
    led.plot(1, 0)
    led.plot(2, 0)
    led.plot(3, 0)
    led.plot(1, 1)
    led.plot(3, 1)
    led.plot(2, 2)
    led.plot(3, 3)
    led.plot(1, 3)
    led.plot(1, 4)
    led.plot(2, 4)
    led.plot(3, 4)
}
function pozor() {
    led.plot(2, 0)
    led.plot(2, 1)
    led.plot(2, 2)
    led.plot(2, 4)
}
enum GameState {
    Passive,   // čekání – hráč může zobrazit skóre nebo spustit hru
    Started,   // přehrávání intervalu – zobrazeny přesýpací hodiny
    Running    // hráč odhaduje – zobrazuje se otazník, měří se čas
}

let state: GameState = GameState.Passive
let targetInterval: number = 0   // sekundy (5–15)
let startTime: number = 0        // ms – základ pro měření
let pushTime: number = 0
let smazat: boolean = false;
let pressedA: boolean = false;
let pressedB: boolean = false;

input.onLogoDown(function () {

    if (state === GameState.Passive) {
        state = GameState.Started
        basic.clearScreen()
        pozor()
        pressedA = false
        pressedB = false
        startTime = 0
        pushTime = 0
        targetInterval = randint(2, 5) * 1000;
        basic.pause(500);
        control.runInBackground(() => music.playTone(440, 300));
        basic.clearScreen()
        hodiny()
        basic.pause(targetInterval);
        basic.clearScreen()
        control.runInBackground(() => music.playTone(240, 500));
        state = GameState.Running
        basic.showIcon(IconNames.Pitchfork);
        basic.pause(100)
        basic.clearScreen()
    }
});

input.onButtonPressed(Button.A, function () {
    if (state === GameState.Started) {
        basic.showString("B")
        state = GameState.Passive
    }
    if (state === GameState.Running) {
        if (!pressedB) {
            pressedA = true;
            basic.showString("A")
            state = GameState.Passive
        }
    }
});

input.onButtonPressed(Button.B, function () {
    if (state === GameState.Started) {
        basic.showString("A")
        state = GameState.Passive
    }
    if (state === GameState.Running) {
        if (!pressedA) {
            pressedB = true;
            basic.showString("B")
            state = GameState.Passive
        }
    }
})

input.onButtonPressed(Button.AB, function () {
    if (state === GameState.Started) {
        basic.showIcon(IconNames.Sad)
        state = GameState.Passive
    }

    if (state === GameState.Running) {

        if (!pressedA && !pressedB) {
            basic.showString("=")
        } else {
            basic.clearScreen()
            basic.showString("R")
            basic.pause(200)
            basic.clearScreen()
        }

        state = GameState.Passive
    }
})