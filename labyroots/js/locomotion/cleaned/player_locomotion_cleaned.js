CleanedPlayerLocomotion = class CleanedPlayerLocomotion {
    constructor(params) {
        this._myParams = params;

        this._myCollisionCheckParamsMovement = new CollisionCheckParams();
        this._setupCollisionCheckParamsMovement();
        this._myCollisionCheckParamsTeleport = null;
        this._setupCollisionCheckParamsTeleport();

        this._myCollisionRuntimeParams = new CollisionRuntimeParams();
        this._myMovementRuntimeParams = new PlayerLocomotionMovementRuntimeParams();
        this._myMovementRuntimeParams.myCollisionRuntimeParams = this._myCollisionRuntimeParams;

        {
            let params = new PlayerHeadManagerParams();

            params.mySessionChangeResyncEnabled = true;

            params.myBlurEndResyncEnabled = true;
            params.myBlurEndResyncRotation = true;

            //params.myNextEnterSessionFloorHeight = 3;
            params.myEnterSessionResyncHeight = false;
            params.myExitSessionResyncHeight = false;
            params.myExitSessionResyncVerticalAngle = false;
            params.myExitSessionRemoveRightTilt = true;
            params.myExitSessionAdjustMaxVerticalAngle = true;
            params.myExitSessionMaxVerticalAngle = 90;

            params.myHeightOffsetVRWithFloor = 0;
            params.myHeightOffsetVRWithoutFloor = 1.70;
            params.myHeightOffsetNonVR = 1.70;

            params.myForeheadExtraHeight = this._myParams.myForeheadExtraHeight;

            params.myFeetRotationKeepUp = true;

            params.myDebugActive = false;

            this._myPlayerHeadManager = new PlayerHeadManager(params);
        }

        {
            let params = new PlayerTransformManagerParams();

            params.myPlayerHeadManager = this._myPlayerHeadManager;

            params.myMovementCollisionCheckParams = this._myCollisionCheckParamsMovement;
            params.myTeleportCollisionCheckParams = null;
            params.myTeleportCollisionCheckParamsCopyFromMovement = true;
            params.myTeleportCollisionCheckParamsCheck360 = true;

            params.myHeadCollisionBlockLayerFlags.copy(params.myMovementCollisionCheckParams.myHorizontalBlockLayerFlags);
            params.myHeadCollisionBlockLayerFlags.add(params.myMovementCollisionCheckParams.myVerticalBlockLayerFlags);
            params.myHeadCollisionObjectsToIgnore.pp_copy(params.myMovementCollisionCheckParams.myHorizontalObjectsToIgnore);
            let objectsEqualCallback = (first, second) => first.pp_equals(second);
            for (let objectToIgnore of params.myMovementCollisionCheckParams.myVerticalObjectsToIgnore) {
                params.myHeadCollisionObjectsToIgnore.pp_pushUnique(objectToIgnore, objectsEqualCallback);
            }

            params.myCollisionRuntimeParams = this._myCollisionRuntimeParams;

            params.myHeadRadius = 0.075;

            params.myIsMaxDistanceFromRealToSyncEnabled = true;
            params.myMaxDistanceFromRealToSync = 100;

            params.myIsFloatingValidIfVerticalMovement = false;
            params.myIsFloatingValidIfVerticalMovementAndRealOnGround = false;
            params.myIsFloatingValidIfSteepGround = false;
            params.myIsFloatingValidIfVerticalMovementAndSteepGround = false;
            params.myIsFloatingValidIfRealOnGround = false;
            params.myIsLeaningValidAboveDistance = true;
            params.myLeaningValidDistance = 2;
            params.myFloatingSplitCheckEnabled = true;
            params.myFloatingSplitCheckMaxLength = 0.2;
            params.myFloatingSplitCheckMaxSteps = 5;
            params.myRealMovementAllowVerticalAdjustments = false;

            params.myUpdateRealPositionValid = true;
            params.myUpdatePositionValid = true;

            params.myIsBodyCollidingWhenHeightBelowValue = null;
            params.myIsBodyCollidingWhenHeightAboveValue = null;

            params.myResetToValidOnEnterSession = true;
            params.myResetToValidOnExitSession = true;

            params.myAlwaysResetRealPositionNonVR = true;
            params.myAlwaysResetRealRotationNonVR = true;
            params.myAlwaysResetRealHeightNonVR = true;

            params.myAlwaysResetRealPositionVR = false;
            params.myAlwaysResetRealRotationVR = false;
            params.myAlwaysResetRealHeightVR = false;

            params.myNeverResetRealPositionNonVR = false;
            params.myNeverResetRealRotationNonVR = true;
            params.myNeverResetRealHeightNonVR = false;

            params.myNeverResetRealPositionVR = false;
            params.myNeverResetRealRotationVR = false;
            params.myNeverResetRealHeightVR = true;

            params.myResetRealOnMove = false;

            params.myDebugActive = false;

            this._myPlayerTransformManager = new CleanedPlayerTransformManager(params);

            transformManager = this._myPlayerTransformManager;
        }

        {
            let params = new PlayerObscureManagerParams();

            params.myPlayerTransformManager = this._myPlayerTransformManager;

            params.myObscureObject = null;
            params.myObscureMaterial = null;
            params.myObscureRadius = 0.1;

            params.myObscureFadeOutSeconds = 0.15;
            params.myObscureFadeInSeconds = 0.15;

            params.myObscureFadeEasingFunction = PP.EasingFunction.linear;
            params.myObscureLevelRelativeDistanceEasingFunction = PP.EasingFunction.linear;

            params.myDistanceToStartObscureWhenBodyColliding = 0.5;
            params.myDistanceToStartObscureWhenHeadColliding = 0;
            params.myDistanceToStartObscureWhenFloating = 2220.35;
            params.myDistanceToStartObscureWhenFar = 0.5;

            params.myRelativeDistanceToMaxObscureWhenBodyColliding = 0.5;
            params.myRelativeDistanceToMaxObscureWhenHeadColliding = 0;
            params.myRelativeDistanceToMaxObscureWhenFloating = 0.5;
            params.myRelativeDistanceToMaxObscureWhenFar = 0.5;

            this._myPlayerObscureManager = new PlayerObscureManager(params);
        }

        {
            let params = new PlayerLocomotionRotateParams();

            params.myPlayerHeadManager = this._myPlayerHeadManager;
            params.myPlayerTransformManager = this._myPlayerTransformManager;

            params.myMaxRotationSpeed = this._myParams.myMaxRotationSpeed;
            params.myIsSnapTurn = this._myParams.myIsSnapTurn;
            params.mySnapTurnOnlyVR = this._myParams.mySnapTurnOnlyVR;
            params.mySnapTurnAngle = this._myParams.mySnapTurnAngle;

            if (this._myParams.mySnapTurnSpeedDegrees > LocomotionUtils.EPSILON_NUMBER) {
                params.mySmoothSnapActive = true;
                params.mySmoothSnapSpeedDegrees = this._myParams.mySnapTurnSpeedDegrees;
            } else {
                params.mySmoothSnapActive = false;
            }

            params.myRotationMinStickIntensityThreshold = 0.1;
            params.mySnapTurnActivateThreshold = 0.5;
            params.mySnapTurnResetThreshold = 0.4;

            params.myClampVerticalAngle = true;
            params.myMaxVerticalAngle = 90;

            this._myPlayerLocomotionRotate = new PlayerLocomotionRotate(params);

            params.myHandedness = PP.InputUtils.getOppositeHandedness(this._myParams.myMainHand);
        }

        {
            {
                let params = new PlayerLocomotionSmoothParams();

                params.myPlayerHeadManager = this._myPlayerHeadManager;
                params.myPlayerTransformManager = this._myPlayerTransformManager;

                params.myCollisionCheckParams = this._myCollisionCheckParamsMovement;

                params.myHandedness = this._myParams.myMainHand;

                params.myMaxSpeed = this._myParams.myMaxSpeed;

                params.myMovementMinStickIntensityThreshold = 0.1;

                params.myFlyEnabled = this._myParams.myFlyEnabled;
                params.myMinAngleToFlyUpNonVR = this._myParams.myMinAngleToFlyUpNonVR;
                params.myMinAngleToFlyDownNonVR = this._myParams.myMinAngleToFlyDownNonVR;
                params.myMinAngleToFlyUpVR = this._myParams.myMinAngleToFlyUpVR;
                params.myMinAngleToFlyDownVR = this._myParams.myMinAngleToFlyDownVR;
                params.myMinAngleToFlyRight = this._myParams.myMinAngleToFlyRight;

                params.myGravityAcceleration = -20;

                params.myVRDirectionReferenceType = this._myParams.myVRDirectionReferenceType;
                params.myVRDirectionReferenceObject = this._myParams.myVRDirectionReferenceObject;

                this._myPlayerLocomotionSmooth = new CleanedPlayerLocomotionSmooth(params, this._myMovementRuntimeParams);
            }

            {
                let params = new PlayerLocomotionTeleportParams();

                params.myPlayerHeadManager = this._myPlayerHeadManager;
                params.myPlayerTransformManager = this._myPlayerTransformManager;

                params.myCollisionCheckParams = this._myCollisionCheckParamsTeleport;

                params.myHandedness = this._myParams.myMainHand;

                params.myDetectionParams.myMaxDistance = 3;
                params.myDetectionParams.myMaxHeightDifference = 0.5;
                params.myDetectionParams.myGroundAngleToIgnoreUpward = this._myCollisionCheckParamsMovement.myGroundAngleToIgnore;
                params.myDetectionParams.myMustBeOnGround = true;

                params.myDetectionParams.myTeleportBlockLayerFlags.setFlagActive(0, true);
                params.myDetectionParams.myTeleportBlockLayerFlags.setFlagActive(4, true);
                params.myDetectionParams.myTeleportBlockLayerFlags.setFlagActive(5, true);
                params.myDetectionParams.myTeleportFloorLayerFlags.copy(params.myDetectionParams.myTeleportBlockLayerFlags);

                params.myDetectionParams.myTeleportFeetPositionMustBeVisible = false;
                params.myDetectionParams.myTeleportHeadPositionMustBeVisible = false;
                params.myDetectionParams.myTeleportHeadOrFeetPositionMustBeVisible = true;

                params.myDetectionParams.myTeleportParableStartReferenceObject = this._myParams.myTeleportParableStartReferenceObject;

                params.myDetectionParams.myVisibilityBlockLayerFlags.copy(params.myDetectionParams.myTeleportBlockLayerFlags);

                params.myVisualizerParams.myTeleportPositionObject = this._myParams.myTeleportPositionObject;

                params.myPerformTeleportAsMovement = false;
                params.myTeleportAsMovementRemoveVerticalMovement = true;
                params.myTeleportAsMovementExtraVerticalMovementPerMeter = -2;

                params.myGravityAcceleration = 0;

                params.myDebugActive = false;
                params.myDebugDetectActive = true;
                params.myDebugShowActive = true;
                params.myDebugVisibilityActive = false;

                this._myPlayerLocomotionTeleport = new PlayerLocomotionTeleport(params, this._myMovementRuntimeParams);
            }
        }

        this._setupLocomotionMovementFSM();

        this._myIdle = false;
    }

    start() {
        this._fixAlmostUp();

        this._myPlayerHeadManager.start();
        this._myPlayerTransformManager.start();

        this._myPlayerObscureManager.start();

        this._myPlayerLocomotionRotate.start();

        this._myLocomotionMovementFSM.perform("start");
    }

    canStop() {
        let canStop = false;

        if (this._myLocomotionMovementFSM.isInState("smooth") && this._myPlayerLocomotionSmooth.canStop()) {
            canStop = true;
        } else if (this._myLocomotionMovementFSM.isInState("teleport") && this._myPlayerLocomotionTeleport.canStop()) {
            canStop = true;
        }

        return canStop;
    }

    update(dt) {
        this._myPlayerHeadManager.update(dt);
        this._myPlayerTransformManager.update(dt);

        if (PP.myLeftGamepad.getButtonInfo(PP.GamepadButtonID.THUMBSTICK).isPressEnd(2)) {
            if (this._myLocomotionMovementFSM.isInState("smooth") && this._myPlayerLocomotionSmooth.canStop()) {

                Global.sendAnalytics("event", "switch_teleport", {
                    "value": 1
                });
                this._myLocomotionMovementFSM.perform("next");
            } else if (this._myLocomotionMovementFSM.isInState("teleport") && this._myPlayerLocomotionTeleport.canStop()) {
                this._myLocomotionMovementFSM.perform("next");

                Global.sendAnalytics("event", "switch_smooth", {
                    "value": 1
                });
            }
        }

        if (this._myPlayerHeadManager.isSynced()) {

            this._updateCollisionHeight();

            if (!this._myIdle) {
                this._myPlayerLocomotionRotate.update(dt);
                this._myLocomotionMovementFSM.update(dt);
            }
        }

        this._myPlayerObscureManager.update(dt);

        if (!this._myParams.myFlyEnabled) {
            let maxHeight = 0;
            let position = Global.myPlayer.getPosition();
            if (position[1] > maxHeight) {
                let fixedPosition = position.vec3_clone();
                fixedPosition[1] = maxHeight;
                Global.myPlayer.teleportPosition(fixedPosition, null, true);
            }
        }

        this._myCollisionCheckParamsTeleport.myHorizontalObjectsToIgnore.pp_copy(this._myPlayerTransformManager._myParams.myMovementCollisionCheckParams.myHorizontalObjectsToIgnore);
        this._myCollisionCheckParamsTeleport.myVerticalObjectsToIgnore.pp_copy(this._myPlayerTransformManager._myParams.myMovementCollisionCheckParams.myVerticalObjectsToIgnore);
    }

    setIdle(idle) {
        this._myIdle = idle;

        if (idle) {
            this._myLocomotionMovementFSM.perform("idle");
        } else {
            this._myLocomotionMovementFSM.perform("start");
        }
    }

    _updateCollisionHeight() {
        this._myCollisionCheckParamsMovement.myHeight = this._myPlayerHeadManager.getHeightHead();
        if (this._myCollisionCheckParamsMovement.myHeight <= 0.000001) {
            this._myCollisionCheckParamsMovement.myHeight = 0;
        }
        this._myCollisionCheckParamsTeleport.myHeight = this._myCollisionCheckParamsMovement.myHeight;
    }

    _setupCollisionCheckParamsMovement() {
        let simplifiedParams = new PP.CharacterColliderSetupSimplifiedCreationParams();

        simplifiedParams.myHeight = 1.70;
        simplifiedParams.myRadius = this._myParams.myCharacterRadius;

        simplifiedParams.myAccuracyLevel = PP.CharacterColliderSetupSimplifiedCreationAccuracyLevel.MEDIUM;

        simplifiedParams.myIsPlayer = true;

        simplifiedParams.myCheckOnlyFeet = true;

        simplifiedParams.myAverageSpeed = this._myParams.myMaxSpeed;

        simplifiedParams.myCanFly = false;

        simplifiedParams.myShouldSlideAgainstWall = true;

        simplifiedParams.myCollectGroundInfo = true;
        simplifiedParams.myShouldSnapOnGround = true;
        simplifiedParams.myMaxDistanceToSnapOnGround = 0.3;
        simplifiedParams.myMaxWalkableGroundAngle = 70;
        simplifiedParams.myMaxWalkableGroundStepHeight = 0.3;
        simplifiedParams.myShouldNotFallFromEdges = false;

        simplifiedParams.myHorizontalCheckBlockLayerFlags.setFlagActive(0, true);
        simplifiedParams.myHorizontalCheckBlockLayerFlags.setFlagActive(4, true);
        simplifiedParams.myHorizontalCheckBlockLayerFlags.setFlagActive(5, true);
        let physXComponents = PP.myPlayerObjects.myPlayer.pp_getComponentsHierarchy("physx");
        for (let physXComponent of physXComponents) {
            simplifiedParams.myHorizontalCheckObjectsToIgnore.pp_pushUnique(physXComponent.object, (first, second) => first.pp_equals(second));
        }
        simplifiedParams.myVerticalCheckBlockLayerFlags.copy(simplifiedParams.myHorizontalCheckBlockLayerFlags);
        simplifiedParams.myVerticalCheckObjectsToIgnore.pp_copy(simplifiedParams.myHorizontalCheckObjectsToIgnore);

        simplifiedParams.myHorizontalCheckDebugActive = false;
        simplifiedParams.myVerticalCheckDebugActive = false;

        let colliderSetup = PP.CharacterColliderUtils.createCharacterColliderSetupSimplified(simplifiedParams);

        colliderSetup.myVerticalCheckSetup.myVerticalPositionCheckEnabled = false;
        colliderSetup.myVerticalCheckSetup.myVerticalCheckCircumferenceSlices = 3;

        this._myCollisionCheckParamsMovement = PP.CollisionCheckBridge.convertCharacterColliderSetupToCollisionCheckParams(colliderSetup, this._myCollisionCheckParamsMovement);
    }

    _setupCollisionCheckParamsTeleport() {
        this._myCollisionCheckParamsTeleport = CollisionCheckUtils.generate360TeleportParamsFromMovementParams(this._myCollisionCheckParamsMovement);

        // increased so to let teleport on steep slopes from above (from below is fixed through detection myGroundAngleToIgnoreUpward)
        this._myCollisionCheckParamsTeleport.myGroundAngleToIgnore = 61;
        this._myCollisionCheckParamsTeleport.myTeleportMustBeOnIgnorableGroundAngle = true;
        this._myCollisionCheckParamsTeleport.myTeleportMustBeOnGround = true;

        /*
        this._myCollisionCheckParamsTeleport.myExtraTeleportCheckCallback = function (
            offsetTeleportPosition, endPosition, feetPosition, transformUp, transformForward, height,
            collisionCheckParams, prevCollisionRuntimeParams, collisionRuntimeParams, newFeetPosition

        ) {
            let isTeleportingUpward = endPosition.vec3_isFartherAlongAxis(feetPosition, transformUp);
            if (isTeleportingUpward) {
                collisionRuntimeParams.myTeleportCanceled = collisionRuntimeParams.myGroundAngle > 30 + 0.0001;
                console.error(collisionRuntimeParams.myTeleportCanceled);
            }

            return newFeetPosition;
        }*/

        // this is needed for when u want to perform the teleport as a movement
        // maybe this should be another set of collsion check params copied from the smooth ones?
        // when you teleport as move, u check with the teleport for the position, and this other params for the move, so that u can use a smaller
        // cone, and sliding if desired
        // if nothing is specified it's copied from the teleport and if greater than 90 cone is tuned down, and also the below settings are applied

        // you could also do this if u want to perform the teleport as movement, instead of using the smooth
        // but this will make even the final teleport check be halved
        //this._myCollisionCheckParamsTeleport.myHalfConeAngle = 90;
        //this._myCollisionCheckParamsTeleport.myHalfConeSliceAmount = 3;
        //this._myCollisionCheckParamsTeleport.myCheckHorizontalFixedForwardEnabled = false;
        //this._myCollisionCheckParamsTeleport.mySplitMovementEnabled = true;
        //this._myCollisionCheckParamsTeleport.mySplitMovementMaxLength = 0.2;

        //this._myCollisionCheckParamsTeleport.myDebugActive = true;
    }

    _fixAlmostUp() {
        // get rotation on y and adjust if it's slightly tilted when it's almsot 0,1,0

        let defaultUp = PP.vec3_create(0, 1, 0);
        let angleWithDefaultUp = PP.myPlayerObjects.myPlayer.pp_getUp().vec3_angle(defaultUp);
        if (angleWithDefaultUp < 1) {
            let forward = PP.myPlayerObjects.myPlayer.pp_getForward();
            let flatForward = forward.vec3_clone();
            flatForward[1] = 0;

            let defaultForward = PP.vec3_create(0, 0, 1);
            let angleWithDefaultForward = defaultForward.vec3_angleSigned(flatForward, defaultUp);

            PP.myPlayerObjects.myPlayer.pp_resetRotation();
            PP.myPlayerObjects.myPlayer.pp_rotateAxis(angleWithDefaultForward, defaultUp);
        }
    }

    _setupLocomotionMovementFSM() {
        this._myLocomotionMovementFSM = new PP.FSM();
        //this._myLocomotionMovementFSM.setDebugLogActive(true, "Locomotion Movement");

        this._myLocomotionMovementFSM.addState("init");
        this._myLocomotionMovementFSM.addState("smooth", (dt) => this._myPlayerLocomotionSmooth.update(dt));
        this._myLocomotionMovementFSM.addState("teleport", (dt) => this._myPlayerLocomotionTeleport.update(dt));
        this._myLocomotionMovementFSM.addState("idleSmooth");
        this._myLocomotionMovementFSM.addState("idleTeleport");

        this._myLocomotionMovementFSM.addTransition("init", "smooth", "start", function () {
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("smooth", "teleport", "next", function () {
            this._myPlayerLocomotionSmooth.stop();
            this._myPlayerLocomotionTeleport.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("teleport", "smooth", "next", function () {
            this._myPlayerLocomotionTeleport.stop();
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("smooth", "idleSmooth", "idle", function () {
            this._myPlayerLocomotionSmooth.stop();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("teleport", "idleTeleport", "idle", function () {
            this._myPlayerLocomotionTeleport.stop();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("idleSmooth", "smooth", "start", function () {
            this._myPlayerLocomotionSmooth.start();
        }.bind(this));

        this._myLocomotionMovementFSM.addTransition("idleTeleport", "teleport", "start", function () {
            this._myPlayerLocomotionTeleport.start();
        }.bind(this));

        this._myLocomotionMovementFSM.init("init");
    }
};