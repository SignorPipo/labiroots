WL.registerComponent('open-github', {
}, {
    init: function () {
    },
    start: function () {
        this._myHit = 3;
    },
    update: function (dt) {
        if (this._myChange > 0) {
            this._myChange--;
            if (this._myChange == 0) {
                window.open("https://github.com/SignorPipo/labiroots");
            }
        }
    },
    hit() {
        if (this._myHit == 0) {
            this._myHit = 3;
        }

        this._myHit--;
        return true;
    },
    open() {
        if (WL.xrSession) {
            WL.xrSession.end();
        }

        this._myChange = 10;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        return clonedComponent;
    }
});