# Lusito's Asteroids Clone!

An asteroids clone showcasing [typed-ecstasy](https://github.com/Lusito/typed-ecstasy) and [typed-signals](https://github.com/Lusito/typed-signals/)

[Play Here](https://lusito.github.io/typed-asteroids/)

![Screenshot](https://raw.githubusercontent.com/Lusito/typed-asteroids/master/screenshot.png "Screenshot")

## About the Game

I made this asteroids game back in 2010 using c/c++ and when I decided to create a game using TypeScript, I thought it might be nice to revive this game. It's written entirely in TypeScript and packed together using parcel.

This was partially written as a way to test some libraries I have ported from C/C++ to TypeScript ([typed-ecstasy](https://github.com/Lusito/typed-ecstasy) and [typed-signals](https://github.com/Lusito/typed-signals/)), and due to limited time, the code of this game is far from perfect. I'll try to work on it further when I have more time. Some things like the sceneanimator (credits animation) could be moved into a separate npm module. And I'm not sure I'm too happy with pixi.js, as it complicates a lot of things for me.

## Building and running

You need npm to get started. Then go into the directory, call:
```
npm ci
npm run build
npm start
```

Open a browser with the url given on the command line. This is usually 
http://localhost:1234/

## License
The code of this game has been released under the [zlib/libpng License](https://github.com/Lusito/typed-asteroids/blob/master/LICENSE)
The assets are not released under this license!

## Credits

- 2D Artwork
  - [xiller](https://www.xiller.de/)
- Sound Effects
  - [Bart Kelsey](https://opengameart.org/users/bart)
  - [Bliss](https://freesound.org/people/Bliss/)
  - [broumbroum](https://freesound.org/people/broumbroum/)
  - [inferno](https://freesound.org/people/inferno/)
  - [RunnerPack](https://freesound.org/people/RunnerPack/)
  - [Simon_Lacelle](https://freesound.org/people/Simon_Lacelle/)
  - [THE_bizniss](https://freesound.org/people/THE_bizniss/)
- Music
  - [Joost Egelie](https://www.jamendo.com/artist/344884/joost-egelie)
  - [Pogotron](https://freesound.org/people/Pogotron/)
  - [lucasgonze](https://freesound.org/people/lucasgonze/)
- Used Libraries
  - [PixiJS v5](http://www.pixijs.com/)
  - [pixi-sound](https://www.npmjs.com/package/pixi-sound)
  - [typed-ecstasy](https://github.com/Lusito/typed-ecstasy)
  - [typed-signals](https://github.com/Lusito/typed-signals/)
- Special Thanks
  - www.FreeSound.org
  - www.Jamendo.com
  - www.OpenGameArt.org
