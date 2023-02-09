WL.registerComponent('root-wall', {
}, {
    init: function () {
    },
    start: function () {
        this._myStarted = false;
        this._myHit = 0;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myStarted = true;
                this._myHit = Global.mySetup.myTreeSetup.myRootWallHit;
            }
        } else {

        }
    },
    hit() {
        let hitted = false;

        if (this._myHit > 0) {
            this._myHit--;
            hitted = true;
            // suono

            if (this._myHit == 0) {
                if (Global.myGoogleAnalytics) {
                    gtag("event", "defeat_root_wall", {
                        "value": 1
                    });
                }
            }
        }


        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);

        return clonedComponent;
    }
});