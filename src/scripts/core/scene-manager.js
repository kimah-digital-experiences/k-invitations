export class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.sequence = [];
    this.currentSceneId = null;
    this.status = "idle";
    this.sceneStates = new Map();
    this.activeTransition = null;
  }

  registerScene(scene) {
    if (!scene?.id) {
      throw new Error("A scene must define a unique id.");
    }

    if (this.scenes.has(scene.id)) {
      throw new Error(`Scene "${scene.id}" is already registered.`);
    }

    this.scenes.set(scene.id, scene);
    this.sequence.push(scene.id);
    this.sceneStates.set(scene.id, "hidden");

    scene.init?.({ sceneManager: this });

    return this;
  }

  hasScene(sceneId) {
    return this.scenes.has(sceneId);
  }

  getCurrentSceneId() {
    return this.currentSceneId;
  }

  getStatus() {
    return this.status;
  }

  isTransitioning() {
    return this.status === "transitioning";
  }

  getSceneState(sceneId) {
    return this.sceneStates.get(sceneId) ?? "unknown";
  }

  async showScene(sceneId, context = {}) {
    if (this.isTransitioning()) {
      context.onTransitionBlocked?.(this.activeTransition);
      return false;
    }

    const scene = this.scenes.get(sceneId);

    if (!scene) {
      context.onMissingScene?.(sceneId);
      return false;
    }

    if (this.currentSceneId === sceneId && this.getSceneState(sceneId) === "active") {
      return true;
    }

    const fromSceneId = this.currentSceneId;
    const fromScene = fromSceneId ? this.scenes.get(fromSceneId) : null;
    const transitionContext = {
      ...context,
      direction: context.direction ?? "direct",
      fromSceneId,
      sceneManager: this,
      toSceneId: sceneId,
    };

    this.beginTransition(transitionContext);

    try {
      if (this.currentSceneId && this.currentSceneId !== sceneId) {
        await this.runSceneExit(fromScene, fromSceneId, transitionContext);
      }

      this.currentSceneId = sceneId;
      await this.runSceneEnter(scene, sceneId, transitionContext);
    } finally {
      this.endTransition();
    }

    return true;
  }

  async hideScene(sceneId, context = {}) {
    if (this.isTransitioning()) {
      context.onTransitionBlocked?.(this.activeTransition);
      return false;
    }

    const scene = this.scenes.get(sceneId);

    if (!scene) {
      return false;
    }

    const transitionContext = {
      ...context,
      direction: context.direction ?? "hide",
      fromSceneId: sceneId,
      sceneManager: this,
      toSceneId: null,
    };

    this.beginTransition(transitionContext);

    try {
      await this.runSceneExit(scene, sceneId, transitionContext);

      if (this.currentSceneId === sceneId) {
        this.currentSceneId = null;
      }
    } finally {
      this.endTransition();
    }

    return true;
  }

  async nextScene(context = {}) {
    if (this.isTransitioning()) {
      context.onTransitionBlocked?.(this.activeTransition);
      return false;
    }

    const currentScene = this.scenes.get(this.currentSceneId);
    const nextSceneId = currentScene?.nextSceneId ?? this.getAdjacentSceneId(1);

    if (!nextSceneId || !this.hasScene(nextSceneId)) {
      const transitionContext = {
        ...context,
        direction: "forward",
        fromSceneId: this.currentSceneId,
        sceneManager: this,
        toSceneId: nextSceneId,
      };

      this.beginTransition(transitionContext);

      try {
        await currentScene?.onMissingNextScene?.(transitionContext);
        context.onMissingScene?.(nextSceneId);
      } finally {
        this.endTransition();
      }

      return false;
    }

    return this.showScene(nextSceneId, { ...context, direction: "forward" });
  }

  async previousScene(context = {}) {
    if (this.isTransitioning()) {
      context.onTransitionBlocked?.(this.activeTransition);
      return false;
    }

    const previousSceneId = this.getAdjacentSceneId(-1);

    if (!previousSceneId) {
      context.onMissingScene?.(previousSceneId);
      return false;
    }

    return this.showScene(previousSceneId, { ...context, direction: "backward" });
  }

  getAdjacentSceneId(offset) {
    const currentIndex = this.sequence.indexOf(this.currentSceneId);

    if (currentIndex === -1) {
      return null;
    }

    return this.sequence[currentIndex + offset] ?? null;
  }

  beginTransition(context) {
    this.status = "transitioning";
    this.activeTransition = {
      direction: context.direction,
      fromSceneId: context.fromSceneId,
      toSceneId: context.toSceneId,
    };
  }

  endTransition() {
    this.status = "idle";
    this.activeTransition = null;
  }

  async runSceneExit(scene, sceneId, context) {
    if (!scene || !sceneId) {
      return;
    }

    this.sceneStates.set(sceneId, "exiting");
    await this.callSceneHook(scene, "beforeExit", context);
    await this.callSceneHook(scene, "exit", context, "hide");
    await this.callSceneHook(scene, "afterExit", context);
    this.sceneStates.set(sceneId, "hidden");
  }

  async runSceneEnter(scene, sceneId, context) {
    this.sceneStates.set(sceneId, "entering");
    await this.callSceneHook(scene, "beforeEnter", context);
    await this.callSceneHook(scene, "enter", context, "show");
    await this.callSceneHook(scene, "afterEnter", context);
    this.sceneStates.set(sceneId, "active");
  }

  async callSceneHook(scene, hookName, context, fallbackHookName) {
    const hook = scene[hookName] ?? (fallbackHookName ? scene[fallbackHookName] : null);

    if (!hook) {
      return;
    }

    await hook.call(scene, context);
  }
}
