WL.registerComponent('big-tree', {
    _myPhase1: { type: WL.Type.Object },
    _myPhase2: { type: WL.Type.Object },
    _myPhase3: { type: WL.Type.Object },
    _myPhase4: { type: WL.Type.Object },
    _myPhase5: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myBigTreeRoots = 0;
        this._myHit = 0;

        this._myPhases = [];

        this._myCurrentPhase = 0;
        this.avoidIncrement = false;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                let children = this.object.pp_getChildren();
                for (let i = 0; i < children.length; i++) {
                    this._myPhases[parseInt(children[i].pp_getName()) - 1] = children[i];
                }

                for (let phase of this._myPhases) {
                    phase.pp_setActive(false);
                }

                this._myStarted = true;
                this._myBigTreeRoots = Global.mySetup.myTreeSetup.myBigTreeRoots;
                this._myHit = Global.mySetup.myTreeSetup.myBigTreeHit;

                this._myPhases[0].pp_setActive(true);
            }
        } else {

        }
    },
    rootDie() {
        if (this._myBigTreeRoots > 0) {
            this._myBigTreeRoots--;

            for (let phase of this._myPhases) {
                phase.pp_setActive(false);
            }

            this._myCurrentPhase++;
            this._myPhases[Math.floor(this._myCurrentPhase / 2)].pp_setActive(true);
        }
    },
    hit() {
        let hitted = false;

        if (this._myBigTreeRoots == 0) {

            if (!this.avoidIncrement) {
                this._myCurrentPhase++;
            }

            if (this._myHit > 0) {

                this._myHit--;
                hitted = true;
                //suono

                for (let phase of this._myPhases) {
                    phase.pp_setActive(false);
                }

                this._myCurrentPhase++;
                this._myPhases[Math.floor(this._myCurrentPhase / 2)].pp_setActive(true);
                this.avoidIncrement = true;
            }
        }

        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    },
    pp_clonePostProcess() {
        this.start();
    }
});