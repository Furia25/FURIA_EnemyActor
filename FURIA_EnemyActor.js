/*:
 * @author Furia25
 * @plugindesc EnemyActor [1.0]
 *  
 *
 * @help
 * Have you ever imagined....
 * if you can have this bat beauty in your team as a actor ? 
 * Like pokemon you can now have the enemy in your team. 
 * You can use this for taming enemy, or even swap team side ?
 * Enjoy this plugin, have fun and sorry for my bad english. ♡
 * --------------------------------------------------------------------------
 * THIS PLUGIN IS IN in the beginning of its development.
 * No copyright, this plugin are Free to use in Comercial and non-Comercial game
 * You can credit me if you want, and my code are "open-source" !
 * Sorry for the lack of optimization...
 * --------------------------------------------------------------------------
 * 
 * In french : 
 * Cordialement,
 * Furia25
 * 
 * 
 * --------------------------------------------------------------------------
 * Help :
 * --------------------------------------------------------------------------
 * Actor class :
 * <FE_spriteName:Bat> ---> The name of the file
 * <FE_path:img/characters/> ---> Specific the path of the image.
 * <FE_anchorX:0.25> ---> Change the X anchor of the image. Default 0.75
 * <FE_anchorY:0.25> ---> Change the Y anchor of the image. Default 1.6
 * 
 * /!\THE BASE FILE IS "img/sv_enemies/" /!\
 * --------------------------------------------------------------------------
 * Know issues :
 *    - Enemy actor stand on top of normal actor
 *    - No animation... (Death)
*/
    var Imported = Imported || {};
    Imported.FURIA_EnemyActor = true;

    var Furia25 = Furia25 || {};
    Furia25.Esprite = Furia25.Esprite || {};


    var Furia25_Game_Actor_setup = Game_Actor.prototype.setup;
    var le = Furia25.Esprite;

    Game_Actor.prototype.setup = function (actorId) {
        // Call the original function
        Furia25_Game_Actor_setup.call(this, actorId);
        if($dataActors[actorId].meta.FE_spriteName != null){
            this._Esprite = true;
            var path = $dataActors[actorId].meta.FE_path || "img/sv_enemies";
            var name = $dataActors[actorId].meta.FE_spriteName;
            var pic = le.getPicture(path,name,0);
            var sprite = new Sprite(pic);
            this._Epic = pic;

        }else{
            this._Esprite = false;
        }
        
    }

    le.getPicture = function(path, filename, hue) {
        return ImageManager.loadBitmap(path, filename, hue, true);
    };

    var Furia25_Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors;
    Spriteset_Battle.prototype.createActors = function() {
        this._actorSprites = [];
        for (var i = 0; i < $gameParty.maxBattleMembers(); i++) {
                var actor = $gameParty.members()[i]
                if(actor != null){
                    if(actor._Esprite === true){
                        this._actorSprites[i] = new Sprite_Eactor();
                        this._battleField.addChild(this._actorSprites[i]);
                        
                }else{
                    this._actorSprites[i] = new Sprite_Actor();
                    this._battleField.addChild(this._actorSprites[i]);
                }
            }
               
        }
       
    }

    function Sprite_Eactor() {
        this.initialize.apply(this, arguments);
    }
    
    Sprite_Eactor.prototype = Object.create(Sprite_Battler.prototype);
    Sprite_Eactor.prototype.constructor = Sprite_Eactor;
    
    
    Sprite_Eactor.prototype.initialize = function(battler) {
        Sprite_Battler.prototype.initialize.call(this, battler);
        this.moveToStartPosition();
    };
    
    Sprite_Eactor.prototype.initMembers = function() {
        Sprite_Battler.prototype.initMembers.call(this);
        this._battlerName = '';
        this._pattern = 0;
        this.createMainSprite();
        this.createStateSprite();
    };
    
    Sprite_Eactor.prototype.createMainSprite = function() {
        this._mainSprite = new Sprite_Base();
        this._mainSprite.anchor.x = 0.25;
        this._mainSprite.anchor.y = 1.25;
        this.addChild(this._mainSprite);
        this._effectTarget = this._mainSprite;
        this.name = "";
        this._mainSprite.scale.x *= -1;
    };
    
    
    Sprite_Eactor.prototype.createStateSprite = function() {
        this._stateSprite = new Sprite_StateOverlay();
        this.addChild(this._stateSprite);
    };
    
    Sprite_Eactor.prototype.setBattler = function(battler) {
        Sprite_Battler.prototype.setBattler.call(this, battler);
        var changed = (battler !== this._actor);
        if (changed) {
            this._actor = battler;
            if (battler) {
                this.setActorHome(battler.index());
            }
            this._stateSprite.setup(battler);
        }
    };
    
    Sprite_Eactor.prototype.moveToStartPosition = function() {
        this.startMove(300, 0, 0);
    };
    
    Sprite_Eactor.prototype.setActorHome = function(index) {
        this.setHome(600 + index * 32, 280 + index * 48);
    };
    
    Sprite_Eactor.prototype.update = function() {
        Sprite_Battler.prototype.update.call(this);
    };
    
    Sprite_Eactor.prototype.updateShadow = function() {
        this._shadowSprite.visible = !!this._actor;
    };
    
    Sprite_Eactor.prototype.updateMain = function() {
        Sprite_Battler.prototype.updateMain.call(this);
        if (this._actor.isSpriteVisible() && !this.isMoving()) {
            this.updateTargetPosition();
        }
    };
    
    
    Sprite_Eactor.prototype.setupWeaponAnimation = function() {
        if (this._actor.isWeaponAnimationRequested()) {
            this._weaponSprite.setup(this._actor.weaponImageId());
            this._actor.clearWeaponAnimation();
        }
    };

    Sprite_Eactor.prototype.updateTargetPosition = function() {
        if (this._actor.isInputting() || this._actor.isActing()) {
            this.stepForward();
        } else if (this._actor.canMove() && BattleManager.isEscaped()) {
            this.retreat();2
        } else if (!this.inHomePosition()) {
            this.stepBack();
        }
    };
    
    Sprite_Eactor.prototype.updateBitmap = function() {
        Sprite_Battler.prototype.updateBitmap.call(this);
            this._mainSprite.bitmap = this._actor._Epic
            this._mainSprite.anchor.x = $dataActors[this._actor._actorId].meta.FE_anchorX || 0.75;
            this._mainSprite.anchor.y = $dataActors[this._actor._actorId].meta.FE_anchorY || 1.6;
            if(this._actor.isStateAffected(1) && this.opacity > 0){
                this.opacity -= 0.5
            }else{
                this.opacity = 255
            }
    };
    
    
    Sprite_Eactor.prototype.updateMove = function() {
        var bitmap = this._mainSprite.bitmap;
        if (!bitmap || bitmap.isReady()) {
            Sprite_Battler.prototype.updateMove.call(this);
        }
    };
    

    Sprite_Eactor.prototype.stepForward = function() {
        this.startMove(-48, 0, 12);
    };
    
    Sprite_Eactor.prototype.stepBack = function() {
        this.startMove(0, 0, 12);
    };
    
    Sprite_Eactor.prototype.retreat = function() {
        this.startMove(300, 0, 30);
    };
    
    Sprite_Eactor.prototype.onMoveEnd = function() {
        Sprite_Battler.prototype.onMoveEnd.call(this);
        if (!BattleManager.isBattleEnd()) {
            this.refreshMotion();
        }
    };
   