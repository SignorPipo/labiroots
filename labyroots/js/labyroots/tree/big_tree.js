Global.myBigTree = null;
Global.myBigTreeDead = false;

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
        this._myAvoidIncrement = false;

        Global.myBigTree = this;

        this._myTimeToWin = 0;
    },
    update: function (dt) {
        if (!this._myStarted) {
            if (Global.myReady) {
                this._myBigTreeDie = new LR.BigTreeDie();

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

                let rotationQuat = Global.lookPlayerAligned(this.object.pp_getPosition());
                this.object.pp_setRotationQuat(rotationQuat);
            }
        } else if (this._myHit == 0) {
            this._myBigTreeDie.update(dt);
        }

        if (this._myStarted && Global.myReady) {
            if (this._myHit > 0) {
                this._myTimeToWin += dt;
            }
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

            if (!this._myAvoidIncrement) {
                this._myCurrentPhase++;
            }

            if (this._myHit > 0) {

                this._myHit--;
                hitted = true;
                //suono

                for (let phase of this._myPhases) {
                    phase.pp_setActive(false);
                }

                if (this._myHit > 4) {
                    this._myPhases[2].pp_setActive(true);
                } else if (this._myHit > 0) {
                    this._myPhases[3].pp_setActive(true);
                } else {
                    this._myPhases[4].pp_setActive(true);
                }
                this._myAvoidIncrement = true;

                if (this._myHit == 0) {
                    Global.myBigTreeDead = true;
                    Global.myStage = 0;

                    let isFirstWin = !Global.mySaveManager.load("win_normal_maze", false);
                    if (isFirstWin && !Global.myIsMazeverseTime) {
                        // Automatically switch to mazeverse
                        Global.mySaveManager.save("is_mazeverse", true);
                    }

                    Global.mySaveManager.save("win", true);
                    if (Global.myIsMazeverseTime) {
                        Global.mySaveManager.save("win_mazeverse", true);
                    } else {
                        Global.mySaveManager.save("win_normal_maze", true);
                    }

                    Global.sendAnalytics("event", "defeat_mother_tree", {
                        "value": 1
                    });

                    if (Global.myIsMazeverseTime) {
                        Global.sendAnalytics("event", "defeat_mother_tree_mazeverse", {
                            "value": 1
                        });

                        if (!Global.myWinMazeverse) {
                            Global.sendAnalytics("event", "defeat_mother_tree_mazeverse_first_time", {
                                "value": 1
                            });
                        }
                    } else {
                        Global.sendAnalytics("event", "defeat_mother_tree_normal", {
                            "value": 1
                        });
                    }

                    Global.sendAnalytics("event", "defeat_mother_tree_seconds", {
                        "value": Math.round(this._myTimeToWin)
                    });

                    if (!Global.myIsMazeverseTime) {
                        let score = Math.floor(this._myTimeToWin * 1000);

                        let scoreSubmittedSucceded = false;
                        let scoreStopSubmitting = false;
                        let submitScoreSuccessCallback = function () {
                            if (!scoreSubmittedSucceded) {
                                scoreSubmittedSucceded = true;

                                let leaderboards = WL.scene.pp_getComponents("display-leaderboard");
                                for (let leaderboard of leaderboards) {
                                    leaderboard.updateLeaderboard();
                                }

                                Global.sendAnalytics("event", "score_submitted", {
                                    "value": 1
                                });
                            }
                        };

                        let submitScoreErrorCallback = function (error) {
                            if (error != null && error.type != PP.CAUtils.CAError.SUBMIT_SCORE_FAILED) {
                                scoreStopSubmitting = true;
                            }
                        };

                        PP.CAUtils.submitScore("labyroots", score, submitScoreSuccessCallback, submitScoreErrorCallback, false);

                        setTimeout(function () {
                            if (!scoreSubmittedSucceded && !scoreStopSubmitting) {
                                PP.CAUtils.submitScore("labyroots", score, submitScoreSuccessCallback, submitScoreErrorCallback, false);
                            }
                        }, 5000);

                        setTimeout(function () {
                            if (!scoreSubmittedSucceded && !scoreStopSubmitting) {
                                PP.CAUtils.submitScore("labyroots", score, submitScoreSuccessCallback, submitScoreErrorCallback, false);
                            }
                        }, 10000);
                    }
                } else {
                    Global.sendAnalytics("event", "mother_tree_hit", {
                        "value": 1
                    });
                }
            }
        } else {
            Global.sendAnalytics("event", "mother_tree_hit_invincible", {
                "value": 1
            });
        }

        return hitted;
    },
    pp_clone(targetObject) {
        let clonedComponent = targetObject.pp_addComponent(this.type);
        clonedComponent.active = this.active;

        return clonedComponent;
    },
    pp_clonePostProcess(clonedComponent) {
        clonedComponent.start();
    }
});