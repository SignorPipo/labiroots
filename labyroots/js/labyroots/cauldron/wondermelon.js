WL.registerComponent('wondermelon', {
}, {
    start: function () {
        this._myGathered = false;
        this._myUsed = false;
        this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
        this._myIsGrabbed = false;

        this._myStarted = false;

        this._myChange = 0;
        this._myEnd = 0;

        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myStoryReady) {
                this._myStarted = true;
                this._myAudioMangia = PP.myAudioManager.createAudioPlayer(AudioID.MANGIA_FRUTTO);
            }
        }

        if (this._myGrabbable != null) {
            if (this._myGrabbable.isGrabbed()) {
                if (!this._myGathered) {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "collect_wondermelon", {
                            "value": 1
                        });
                    }
                }

                this._myGathered = true;
                this._myIsGrabbed = true;
            } else {
                this._myIsGrabbed = false;
            }
        } else {
            this._myGrabbable = this.object.pp_getComponent("pp-grabbable");
        }

        this._updateOpenLink(dt);
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        return clonedComponent;
    },
    pp_clonePostProcess() {
        this.start();
    },
    activateEffect() {
        if (!this._myUsed && this._myGrabbable != null && this._myGrabbable.isGrabbed()) {

            this._myEnd = 60;
            this._myChange = 60;

            if (Global.myGoogleAnalytics) {
                gtag("event", "open_wondermelon", {
                    "value": 1
                });
            }

            this._myUsed = true;

            //this._myAudioMangia.setPosition(this.object.pp_getPosition());
            this._myAudioMangia.setPitch(Math.pp_random(1.25 - 0.15, 1.25 + 0.05));
            this._myAudioMangia.play();
        }
    },
    _updateOpenLink(dt) {
        if (this._myEnd > 0) {
            this._myEnd--;
            if (this._myEnd == 0) {
                this._myChange = 1;

                if (WL.xrSession) {
                    Global.myUnmute = true;
                    Howler.mute(true);

                    if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                        Global.myAxe._myGrabbable.release();
                    }

                    WL.xrSession.end();
                }
            }
        }

        if (this._myEnd == 0 && this._myChange > 0) {
            this._myChange--;
            if (this._myChange == 0) {
                let result = Global.windowOpen("https://signor-pipo.itch.io");

                if (result == null) {
                    this._myChange = 10;
                } else {
                    Global.myUnmute = true;
                    Howler.mute(true);

                    if (Global.myAxe != null && Global.myAxe._myGrabbable != null) {
                        Global.myAxe._myGrabbable.release();
                    }

                    if (Global.myGoogleAnalytics) {
                        gtag("event", "open_wondermelon_success", {
                            "value": 1
                        });
                    }
                }
            }
        }
    },
    _onXRSessionEnd() {
        this._myEnd = 0;
        if (this._myChange > 0) {
            this._myChange = 1;
        }
    }
});
