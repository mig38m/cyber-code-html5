var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Config;
(function (Config) {
    Config.DOM_PARENT_ID = 'content';
    Config.GW = 960;
    Config.GH = 720;
    Config.GSW = 960;
    Config.GSH = 720;
})(Config || (Config = {}));
var Const;
(function (Const) {
    Const.cercObjs = ['alienBeige_round', 'alienBlue_round', 'alienGreen_round', 'alienPink_round', 'alienYellow_round'];
    Const.rectObjs = ['alienBeige_square', 'alienBlue_square', 'alienGreen_square', 'alienPink_square', 'alienYellow_square'];
})(Const || (Const = {}));
var Params;
(function (Params) {
    Params.isIOS = false;
})(Params || (Params = {}));
var P2JSExample;
(function (P2JSExample) {
    var Client;
    (function (Client) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine() {
                _super.call(this, Config.GW, Config.GH, Phaser.AUTO, Config.DOM_PARENT_ID, null);
                this.state.add(States.BOOT, Client.Boot, false);
                this.state.add(States.PRELOADER, Client.Preloader, false);
                this.state.add(States.GAME, Client.Game, false);
                this.state.start(States.BOOT);
            }
            return GameEngine;
        }(Phaser.Game));
        Client.GameEngine = GameEngine;
    })(Client = P2JSExample.Client || (P2JSExample.Client = {}));
})(P2JSExample || (P2JSExample = {}));
window.onload = function () {
    new P2JSExample.Client.GameEngine();
};
var P2JSExample;
(function (P2JSExample) {
    var Client;
    (function (Client) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.preload = function () {
            };
            Boot.prototype.create = function () {
                this.stage.setBackgroundColor(0x333333);
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                ScaleManager.init(this.game, Config.DOM_PARENT_ID, Config.GW, Config.GH, Config.GSW, Config.GSH);
                LogMng.logSystem('Created by MonaxGames studio', 'http://monaxgames.com');
                Params.isIOS =
                    this.game.device.iOS ||
                        this.game.device.iPhone ||
                        this.game.device.iPhone4 ||
                        this.game.device.iPad ||
                        this.game.device.mobileSafari;
                this.time.events.add(100, this.onWaitComplete, this);
            };
            Boot.prototype.onWaitComplete = function () {
                this.game.state.start(States.PRELOADER, true, false);
            };
            return Boot;
        }(Phaser.State));
        Client.Boot = Boot;
    })(Client = P2JSExample.Client || (P2JSExample.Client = {}));
})(P2JSExample || (P2JSExample = {}));
var P2JSExample;
(function (P2JSExample) {
    var Client;
    (function (Client) {
        var Game = (function (_super) {
            __extends(Game, _super);
            function Game() {
                _super.apply(this, arguments);
            }
            Game.prototype.create = function () {
                this.game.time.advancedTiming = true;
                this.physics.startSystem(Phaser.Physics.P2JS);
                this.game.physics.p2.gravity.y = 300;
                this.game.input.onDown.add(this.onDown, this);
                this.tfFPS = new Phaser.Text(this.game, 5, 5, 'FPS: ', { fill: '#EEEEEE', align: 'left' });
                this.add.existing(this.tfFPS);
                var info = this.add.text(Config.GW - 5, 5, 'Phaser P2 physics test\nclick on the screen and objects', { fill: '#EEEEEE', align: 'right' });
                info.anchor.set(1, 0);
                this.addRandomObject(new Phaser.Point(this.world.centerX, this.world.centerY));
            };
            Game.prototype.onDown = function (pointer) {
                var bodyClicked = this.game.physics.p2.hitTest(pointer.position);
                if (bodyClicked.length == 0) {
                    this.addRandomObject(pointer.position);
                }
                else {
                    try {
                        for (var i = 0; i < bodyClicked.length; i++) {
                            var spr = bodyClicked[i]['parent']['sprite'];
                            if (spr != null)
                                spr.kill();
                        }
                    }
                    catch (e) {
                        LogMng.log(e, LogMng.ERROR);
                    }
                }
            };
            Game.prototype.addRandomObject = function (aPos) {
                var isCerc = MyMath.randomIntInRange(1, 10) <= 5;
                var key = isCerc ? Const.cercObjs[MyMath.randomIntInRange(0, Const.cercObjs.length - 1)] :
                    Const.rectObjs[MyMath.randomIntInRange(0, Const.rectObjs.length - 1)];
                var newObj = this.add.sprite(aPos.x, aPos.y, key);
                this.game.physics.p2.enable(newObj);
                if (isCerc)
                    newObj.body.setCircle(35);
            };
            Game.prototype.update = function () {
            };
            Game.prototype.render = function () {
                this.tfFPS.text = 'FPS: ' + (String(this.game.time.fps) || '--');
            };
            return Game;
        }(Phaser.State));
        Client.Game = Game;
    })(Client = P2JSExample.Client || (P2JSExample.Client = {}));
})(P2JSExample || (P2JSExample = {}));
var P2JSExample;
(function (P2JSExample) {
    var Client;
    (function (Client) {
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader() {
                _super.apply(this, arguments);
            }
            Preloader.prototype.preload = function () {
                for (var i = 0; i < Const.cercObjs.length; i++) {
                    this.game.load.image(Const.cercObjs[i], './assets/sprites/' + Const.cercObjs[i] + '.png');
                }
                for (var i = 0; i < Const.rectObjs.length; i++) {
                    this.game.load.image(Const.rectObjs[i], './assets/sprites/' + Const.rectObjs[i] + '.png');
                }
            };
            Preloader.prototype.create = function () {
                this.startMainMenu();
            };
            Preloader.prototype.startMainMenu = function () {
                this.game.state.start(States.GAME, true, false);
            };
            return Preloader;
        }(Phaser.State));
        Client.Preloader = Preloader;
    })(Client = P2JSExample.Client || (P2JSExample.Client = {}));
})(P2JSExample || (P2JSExample = {}));
var States;
(function (States) {
    States.BOOT = 'Boot';
    States.PRELOADER = 'Preloader';
    States.MAINMENU = 'MainMenu';
    States.GAME = 'Game';
})(States || (States = {}));
var LogMng;
(function (LogMng) {
    LogMng.DEBUG = 'DEBUG';
    LogMng.INFO = 'INFO';
    LogMng.NETWORK = 'NETWORK';
    LogMng.WARNING = 'WARNING';
    LogMng.ERROR = 'ERROR';
    LogMng.levels = [LogMng.DEBUG, LogMng.INFO, LogMng.NETWORK, LogMng.WARNING, LogMng.ERROR];
    function getCSS(bgColor) {
        return 'background: ' + bgColor + ';' +
            'background-repeat: no-repeat;' +
            'color: #1df9a8;' +
            'line-height: 16px;' +
            'padding: 1px 0;' +
            'margin: 0;' +
            'user-select: none;' +
            '-webkit-user-select: none;' +
            '-moz-user-select: none;';
    }
    ;
    function getLink(color) {
        return 'background: ' + color + ';' +
            'background-repeat: no-repeat;' +
            'font-size: 12px;' +
            'color: #446d96;' +
            'line-height: 14px';
    }
    ;
    function logSystem(message, link) {
        console.log("%c %c %c %s %c %c %c %c%s", getCSS('#5C6166'), getCSS('#4F5357'), getCSS('#313335'), message, getCSS('#4F5357'), getCSS('#5C6166'), getLink('none'), getLink('none'), link);
    }
    LogMng.logSystem = logSystem;
    function log(message, level) {
        if (level === void 0) { level = LogMng.DEBUG; }
        if (LogMng.levels.indexOf(level) < 0)
            return;
        var css = '';
        switch (level) {
            case LogMng.INFO:
                css = 'background: #308AE4; color: #fff; padding: 1px 4px';
                break;
            case LogMng.WARNING:
                css = 'background: #f7a148; color: #fff; padding: 1px 4px';
                break;
            case LogMng.ERROR:
                css = 'background: #DB5252; color: #fff; padding: 1px 4px';
                break;
            case LogMng.NETWORK:
                css = 'background: #7D2998; color: #fff; padding: 1px 4px';
                break;
            case LogMng.DEBUG:
            default:
                css = 'background: #ADADAD; color: #fff; padding: 1px 4px';
        }
        console.log("%c%s", css, level, message);
    }
    LogMng.log = log;
    ;
})(LogMng || (LogMng = {}));
var MyMath;
(function (MyMath) {
    var RectABCD = (function () {
        function RectABCD(a, b, c, d) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
        }
        return RectABCD;
    }());
    MyMath.RectABCD = RectABCD;
    function randomInRange(aMin, aMax) {
        return Math.random() * Math.abs(aMax - aMin) + aMin;
    }
    MyMath.randomInRange = randomInRange;
    function randomIntInRange(aMin, aMax) {
        return Math.round(randomInRange(aMin, aMax));
    }
    MyMath.randomIntInRange = randomIntInRange;
    function toRadian(aDeg) {
        return aDeg * Math.PI / 180;
    }
    MyMath.toRadian = toRadian;
    function toDeg(aRad) {
        return aRad * 180 / Math.PI;
    }
    MyMath.toDeg = toDeg;
    function IsPointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        var b0x, b0y, c0x, c0y, p0x, p0y;
        var m, l;
        var res = false;
        b0x = bx - ax;
        b0y = by - ay;
        c0x = cx - ax;
        c0y = cy - ay;
        p0x = px - ax;
        p0y = py - ay;
        m = (p0x * b0y - b0x * p0y) / (c0x * b0y - b0x * c0y);
        if (m >= 0 && m <= 1) {
            l = (p0x - m * c0x) / b0x;
            if (l >= 0 && (m + l) <= 1)
                res = true;
        }
        return res;
    }
    MyMath.IsPointInTriangle = IsPointInTriangle;
    function isPointInRect(rect, p) {
        return IsPointInTriangle(rect.a.x, rect.a.y, rect.b.x, rect.b.y, rect.c.x, rect.c.y, p.x, p.y) &&
            IsPointInTriangle(rect.c.x, rect.c.y, rect.d.x, rect.d.y, rect.a.x, rect.a.y, p.x, p.y);
    }
    MyMath.isPointInRect = isPointInRect;
    function isCirclesIntersect(x1, y1, r1, x2, y2, r2) {
        var veclen = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        return veclen <= r1 + r2;
    }
    MyMath.isCirclesIntersect = isCirclesIntersect;
})(MyMath || (MyMath = {}));
var ScaleManager = (function () {
    function ScaleManager() {
    }
    ScaleManager.init = function (aGame, aDomId, GW, GH, GSW, GSH) {
        this.game = aGame;
        this.dom_id = aDomId;
        this.dom = document.getElementById(this.dom_id);
        this.game_w = GW;
        this.game_h = GH;
        this.game_sw = GSW;
        this.game_sh = GSH;
        aGame.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        ScaleManager.SizeCalculation();
        window.onresize = function () {
            ScaleManager.SizeCalculation();
        };
    };
    ScaleManager.doEventOriChange = function () {
        this.onOrientationChange.dispatch(this.isPortrait);
    };
    ScaleManager.SizeCalculation = function () {
        var wnd = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        var g = {
            w: ScaleManager.game_w,
            h: ScaleManager.game_h,
            sw: ScaleManager.game_sw,
            sh: ScaleManager.game_sh
        };
        var gw;
        var gh;
        if (g.h / g.w > wnd.h / wnd.w) {
            if (g.sh / g.w > wnd.h / wnd.w) {
                gh = wnd.h * g.h / g.sh;
                gw = gh * g.w / g.h;
            }
            else {
                gw = wnd.w;
                gh = gw * g.h / g.w;
            }
        }
        else {
            if (g.h / g.sw > wnd.h / wnd.w) {
                gh = wnd.h;
                gw = gh * g.w / g.h;
            }
            else {
                gw = wnd.w * g.w / g.sw;
                gh = gw * g.h / g.w;
            }
        }
        var sclX = gw / g.sw;
        var sclY = gh / g.sh;
        var newScale = Math.min(sclX, sclY);
        ScaleManager.game.scale.setUserScale(newScale, newScale, 0, 0);
        this.dtx = (wnd.w - gw) / 2;
        this.dty = (wnd.h - gh) / 2;
        this.gameViewW = this.game_w + 2 * this.dtx / newScale;
        if (this.gameViewW > this.game_w)
            this.gameViewW = this.game_w;
        this.gameViewH = this.game_h + 2 * this.dty / newScale;
        if (this.gameViewH > this.game_h)
            this.gameViewH = this.game_h;
        this.dom.style.marginLeft = Math.round(this.dtx).toString() + 'px';
        this.dom.style.marginTop = Math.round(this.dty).toString() + 'px';
        this.dom.style.maxWidth = String(gw) + 'px';
        this.dom.style.maxHeight = String(gh) + 'px';
        ScaleManager.game.scale.refresh();
        var oldOri = this.isPortrait;
        this.isPortrait = wnd.h > wnd.w;
        if (this.isPortrait != oldOri)
            this.doEventOriChange();
    };
    ScaleManager.handleIncorrect = function () {
        if (!this.game.device.desktop) {
            document.getElementById("turn").style.display = "block";
            ScaleManager.game.world.isPaused = true;
        }
    };
    ScaleManager.handleCorrect = function () {
        if (!this.game.device.desktop) {
            document.getElementById("turn").style.display = "none";
            ScaleManager.game.world.isPaused = false;
        }
        setTimeout("window.scrollTo(0,0)", 1000);
    };
    ScaleManager.dom_id = '';
    ScaleManager.dtx = 0;
    ScaleManager.dty = 0;
    ScaleManager.onOrientationChange = new Phaser.Signal();
    return ScaleManager;
}());
var SndMng;
(function (SndMng) {
    SndMng.MUSIC = 'music';
    SndMng.SFX_CLICK_1 = 'click';
    var musics = [SndMng.MUSIC];
    var sfx_click = [SndMng.SFX_CLICK_1];
    SndMng.LOAD_SOUNDS = musics.concat(musics, sfx_click);
    var MUS_MAX_VOL = 1;
    var game;
    var enabled;
    var music = null;
    function init(aGame, aEnabled) {
        game = aGame;
        enabled = aEnabled;
    }
    SndMng.init = init;
    function fadeInMusic(aVolFrom, aVolEnd, aDuration) {
        if (aVolFrom === void 0) { aVolFrom = 0; }
        if (aVolEnd === void 0) { aVolEnd = 1; }
        if (aDuration === void 0) { aDuration = 500; }
        if (aVolEnd > MUS_MAX_VOL)
            aVolEnd = MUS_MAX_VOL;
        if (music == null)
            music = game.add.audio(SndMng.MUSIC, aVolFrom, true);
        if (enabled) {
            game.tweens.removeFrom(music);
            if (!music.isPlaying) {
                music.volume = aVolFrom;
                music.play();
            }
            game.add.tween(music).to({ volume: aVolEnd }, aDuration, Phaser.Easing.Linear.None, true);
        }
    }
    SndMng.fadeInMusic = fadeInMusic;
    function fadeOutMusic(aVol, aDuration) {
        if (aVol === void 0) { aVol = 0; }
        if (aDuration === void 0) { aDuration = 500; }
        game.tweens.removeFrom(music);
        return game.add.tween(music).to({ volume: aVol }, aDuration, Phaser.Easing.Linear.None, true);
    }
    SndMng.fadeOutMusic = fadeOutMusic;
    function setEnabled(aEnabled) {
        enabled = aEnabled;
        if (enabled) {
            fadeInMusic();
        }
        else {
            fadeOutMusic().onComplete.add(function () { music.stop(); });
        }
    }
    SndMng.setEnabled = setEnabled;
    function getEnabled() {
        return enabled;
    }
    SndMng.getEnabled = getEnabled;
    function sfxPlay(aName, aVol) {
        if (aVol === void 0) { aVol = 1; }
        if (!enabled)
            return;
        game.add.audio(aName, aVol).play();
    }
    SndMng.sfxPlay = sfxPlay;
    function sfxClick(aVol) {
        if (aVol === void 0) { aVol = 1; }
        sfxPlay(SndMng.SFX_CLICK_1, aVol);
    }
    SndMng.sfxClick = sfxClick;
})(SndMng || (SndMng = {}));
//# sourceMappingURL=game.js.map